/**
 * MeterMatcher — مطابقة البيت على البحور.
 *
 * برمجة ديناميكية على مستوى التفعيلات: لكل تفعيلة في البحر تُجرَّب كل
 * صورها المسموحة (السالمة والمزاحَفة والمعلولة)، وتُطابَق كل صورة على
 * مخطّط مقاطع البيت. الحالة = (رقم التفعيلة، موضع الوحدة).
 *
 * لماذا هكذا لا بمقارنة نصّية للنمط:
 *  - الزحافات تتضاعف تباديًا؛ توليد كل التركيبات ثم مقارنتها لا يُحتمَل،
 *    بينما البرمجة الديناميكية تمرّ عليها كلها في زمن خطّي.
 *  - نعرف **أي تفعيلة** اختلّت وبأي مقطع، لا مجرد أن البيت مكسور.
 *  - إضافة بحر أو صورة جديدة لا تمسّ هذا الملف إطلاقًا.
 */

import { matchFoot, minSyllablesToEnd, createAlignmentCache } from './footMatcher.js';
import { inconsistentWordReadings } from './wordConsistency.js';
import { assumedFinalVowels } from './finalSukun.js';

/**
 * @param {object} dag مخطّط مقاطع الشطر
 * @param {object} meter من السجلّ
 * @param {object} scorer
 * @param {{ repeat?: number }} [options] عدد الأشطر المطلوب مطابقتها بالنمط
 */
export function matchMeter(dag, meter, scorer, options = {}) {
  const repeat = options.repeat || 1;
  // forms[i] = صيغة الشطر i. الصدر والعجز صورتان للبحر نفسه لا بحران،
  // فلكل شطر أن يأتي على أيّهما.
  const forms = options.forms
    || Array.from({ length: repeat }, () => options.form || 0);
  const feet = expandFeet(meter, forms);
  if (!feet.length) return null;
  const tailCost = minSyllablesToEnd(dag);

  // states: Map<unitIndex, {cost, chosen[]}>
  let states = new Map([[0, { cost: 0, licensed: 0, hashw: 0, chosen: [] }]]);

  for (let f = 0; f < feet.length; f++) {
    const foot = feet[f];
    const next = new Map();
    const posCtx = { isFirst: foot.isFirst, isArudDarb: foot.isArudDarb };
    const posMult = scorer.positionMultiplier(posCtx);

    for (const [u, state] of states) {
      for (const variant of foot.variants) {
        const vCost = scorer.variationCost(variant, posCtx);
        const vLicence = scorer.variationLicence(variant, posCtx);
        const inHashw = scorer.isHashwVariation(variant, posCtx);
        const ends = matchFoot(dag, u, variant.syllables, scorer, options.cache);
        for (const [end, res] of ends) {
          let cost = state.cost + (vCost + res.cost) * posMult;
          if (end === u) cost += scorer.weights.unfilledFoot;
          // المأذون فيه من الكلفة يسير مع الحالة ليُطرح في آخرها.
          const licensed = state.licensed + (vLicence + (res.licence || 0)) * posMult;
          const hashw = state.hashw + (inHashw ? 1 : 0);

          const prev = next.get(end);
          if (prev !== undefined && prev.cost <= cost + 1e-12) continue;

          next.set(end, {
            cost,
            licensed,
            hashw,
            chosen: [
              ...state.chosen,
              {
                footIndex: f,
                hemistich: foot.hemistich,
                tafila: foot.plain,
                tafilaId: foot.tafilaId,
                variant: { id: variant.id, name: variant.name, result: variant.result, kind: variant.kind },
                // صورةٌ في حشو الشطر: شبهةُ كسر لا رخصة.
                inHashw,
                expected: variant.syllables,
                actual: res.syllables.map((e) => e.weight),
                unitSpan: [u, end],
                alignCost: res.cost,
                variationCost: vCost,
                positionMultiplier: posMult,
                totalCost: (vCost + res.cost) * posMult,
                ops: res.ops,
                empty: end === u,
              },
            ],
          });
        }
      }
    }
    states = next;
    if (states.size === 0) break;
  }

  // إغلاق: ما بقي من وحدات بعد آخر تفعيلة يُحاسَب بعدد المقاطع اللازمة له.
  let best = null;
  for (const [u, state] of states) {
    const leftover = tailCost[u];
    if (!Number.isFinite(leftover)) continue; // مسار لا يستهلك بقية البيت
    const total = state.cost + leftover * scorer.weights.unconsumedSyllable;
    if (!best || total < best.total - 1e-12) {
      best = { total, licensed: state.licensed, hashw: state.hashw, state, endUnit: u, leftoverSyllables: leftover };
    }
  }

  if (!best) {
    return {
      meterId: meter.id,
      name: meter.name,
      repeat,
      matched: false,
      reason: 'لا يوجد تقطيع صالح لهذا البيت يوافق بنية هذا البحر',
      score: 0,
      confidence: 0,
    };
  }

  const meterSyllables = feet.reduce(
    (n, f) => n + (f.salim ? f.salim.length : 0), 0
  ) || meter.pattern.length * repeat;

  // الكلمة الواحدة لا تُنطق في الشطر الواحد نطقين. والنصّ غير المشكول
  // يتعادل عليه بحور كثيرة تعادلًا تامًّا، فيصير اتّساق القراءة هو
  // الفارق الحقيقي بينها — لا ترتيب القائمة.
  const oddReadings = inconsistentWordReadings(best.state.chosen, options.units, options.words);
  // واتّساق القراءة ترجيحٌ في قراءة النصّ لا حكمٌ على البيت، فيدخل
  // الترتيبَ ولا يدخل الدرجة المعروضة.
  const readingCost = oddReadings * scorer.weights.inconsistentWordReading;
  const total = best.total + readingCost;
  const licensed = best.licensed + readingCost;

  const { score, rankScore, confidence, cost, licensedCost, normalizer } = scorer.finalize(
    total,
    meterSyllables,
    {
      assumedVocalization: dag.assumedVocalization,
      licensedCost: licensed,
      // الصورة في حشو الشطر شبهةُ كسر لا رخصة، فتنزل بالدرجة المعروضة
      // ولا تدخل الترتيب: البحر يبقى هو البحر، والحكم على البيت لا عليه.
      hashwVariations: best.hashw,
    }
  );

  const chosen = best.state.chosen;
  const brokenFeet = chosen
    .filter((c) => c.alignCost >= scorer.brokenFootThreshold || c.empty)
    .map((c) => ({
      footIndex: c.footIndex,
      hemistich: c.hemistich,
      tafila: c.tafila,
      expected: c.expected.join(''),
      actual: c.actual.join('') || '—',
      cost: round(c.alignCost),
      issues: describeOps(c.ops),
    }));

  return {
    meterId: meter.id,
    name: meter.name,
    aliases: meter.aliases,
    status: meter.status,
    repeat,
    forms,
    formRole: feet[0] && feet[0].formRole,
    // صيغة كل شطر على حدة ومرتَّبة، لا مجموعةً مبهمة: البيت قد يأتي
    // صدرًا ثم عجزًا، وقد يأتي شطراه على الصيغة نفسها.
    formRoles: forms.map((i) => {
      const available = meter.forms && meter.forms.length ? meter.forms : [];
      const f = available[Math.min(i, available.length - 1)];
      return (f && f.role) || null;
    }),
    matched: true,
    // الدرجة المعروضة: عيوبُ البيت وحدها.
    score,
    // درجة الترتيب: تدخلها الرخصُ ليتقدّم السالم على المزاحَف.
    rankScore,
    confidence,
    cost,
    licensedCost,
    normalizer,
    verdict: scorer.classify(score, {
      brokenFeet: brokenFeet.length, totalFeet: chosen.length, hashwVariations: best.hashw,
    }),
    // صورٌ وقعت في حشو الشطر — تُعلَن ولا تُطوى.
    hashwVariations: best.hashw,
    feet: chosen,
    matchedPattern: chosen.flatMap((c) => c.expected).join(''),
    actualPattern: chosen.flatMap((c) => c.actual).join(''),
    brokenFeet,
    leftoverSyllables: best.leftoverSyllables,
    // كلمات قُرئت خلافًا لمثيلاتها — تُعلَن ولا تُطوى.
    inconsistentWordReadings: oddReadings,
    // حركاتٌ مفترضة على أواخر الكلمات — ترجيحٌ عند التساوي لا كلفة.
    assumedFinalVowels: assumedFinalVowels(chosen, options.units),
    assumedVocalization: dag.assumedVocalization,
  };
}

/**
 * يبسط تفعيلات البحر على الأشطر المطلوبة.
 *
 * الصدر والعجز صورتان للبحر الواحد لا بحران، والعجز هو الصدر مع تذييل.
 * فيختار كل شطر صيغته باستقلال: شطر واحد قد يأتي على أيّهما، والبيت
 * الكامل قد يأتي شطراه على صيغتين مختلفتين أو على واحدة.
 */
function expandFeet(meter, forms) {
  const available = meter.forms && meter.forms.length
    ? meter.forms
    : [{ feet: meter.feet }];
  const out = [];
  forms.forEach((formIndex, r) => {
    const form = available[Math.min(formIndex, available.length - 1)];
    form.feet.forEach((foot, i) => {
      out.push({
        ...foot,
        hemistich: r,
        formRole: form.role,
        isFirst: i === 0,
        // آخر تفعيلة في كل شطر هي العروض أو الضرب، وفيهما وحدهما تجوز العلل.
        isArudDarb: i === form.feet.length - 1,
      });
    });
  });
  return out;
}

function describeOps(ops) {
  const issues = [];
  let pos = 0;
  for (const o of ops) {
    if (o.op === 'match') { pos++; continue; }
    if (o.op === 'substitute') {
      issues.push({
        position: pos,
        kind: 'substitute',
        text: `المقطع ${pos + 1}: البحر يطلب ${o.expected} والبيت أعطى ${o.edge.weight}`,
      });
      pos++;
    } else if (o.op === 'insert') {
      issues.push({
        position: pos,
        kind: 'insert',
        text: `مقطع ${o.edge.weight} زائد لا موضع له في التفعيلة`,
      });
    } else if (o.op === 'delete') {
      issues.push({
        position: pos,
        kind: 'delete',
        text: `المقطع ${pos + 1}: البحر يطلب ${o.expected} ولا مقابل له في البيت`,
      });
      pos++;
    }
  }
  return issues;
}

/**
 * يطابق البيت على كل بحر مفعَّل ويرجع ترتيبًا لا إجابة واحدة (البند 12).
 */
export function rankMeters(dag, registry, scorer, options = {}) {
  const repeats = options.repeats || [1];
  const results = [];
  // ذاكرة واحدة لكل ترتيب: التفعيلة الواحدة تتكرّر في عشرات البحور،
  // فتُحاذى مرّة وتُقرأ مرارًا. و`cache: false` تُعطّلها — يحتاجها
  // اختبارٌ يقارن النتيجتين ليثبت أنها تسريع لا تغيير.
  const cache = options.cache === false ? null : (options.cache || createAlignmentCache());

  for (const meter of registry.enabled) {
    let bestForMeter = null;
    const formCount = meter.forms ? meter.forms.length : 1;
    for (const repeat of repeats) {
      for (const forms of formCombinations(formCount, repeat)) {
        const r = matchMeter(dag, meter, scorer, { repeat, forms, cache: cache || false, units: options.units, words: options.words });
        if (!r || !r.matched) continue;
        if (!bestForMeter || betterForm(r, bestForMeter, options.preferRole)) bestForMeter = r;
      }
    }
    if (bestForMeter) results.push(bestForMeter);
  }

  // عند تساوي الدرجة: أوّلًا القراءة الأقلّ افتراضًا لحركةٍ على آخر
  // الكلمة — فالنبطي يُسكّن الأواخر ولا إعراب فيه (انظر finalSukun.js) —
  // ثم الأسبق في قائمة المصدر.
  //
  // وكان الترجيح قبلُ بترتيب المعرّف أبجديًّا، وهو لا يدلّ على شيء:
  // يُقدّم `al_baseet_1` على `al_maskhub` لأن الباء قبل الميم لا غير.
  // وترتيب القائمة دلالةٌ حقيقية — صاحبها قدّم المسحوب على سائر
  // البحور — فاتّباعه أولى من اتّباع الهجاء.
  //
  // ولا يُخفي هذا التعادلَ: البحور المتساوية تبقى معلَنة في `ambiguity`.
  const finalSukun = scorer.ranking.preferFinalSukun !== false;
  results.sort(
    (a, b) =>
      // الترتيب بدرجة الترتيب لا بالمعروضة: المعروضة حكمٌ على البيت،
      // وهذه قياسُ قربه من البحر. ولو رُتّب بالمعروضة لتقدّم بحرٌ
      // مكسورةٌ فيه تفعيلة على بحرٍ هو بحرُه حقًّا وفي حشوه شبهة —
      // فيُقال لصاحبه «بحرُك ذاك» وليس به.
      b.rankScore - a.rankScore ||
      b.score - a.score ||
      (finalSukun ? (a.assumedFinalVowels || 0) - (b.assumedFinalVowels || 0) : 0) ||
      sourceOrder(registry, a.meterId) - sourceOrder(registry, b.meterId) ||
      a.meterId.localeCompare(b.meterId)
  );
  return results;
}

/**
 * كل توزيعات الصيغ على الأشطر. لبحر بصيغتين وبيتٍ من شطرين تُنتج أربعة:
 * صدر‑عجز، وصدر‑صدر، وعجز‑صدر، وعجز‑عجز. عددها صغير دائمًا (٢ أو ٤)
 * لأن الصيغ لا تتجاوز اثنتين والأشطر لا تتجاوز شطرين.
 */
function formCombinations(formCount, repeat) {
  let out = [[]];
  for (let r = 0; r < repeat; r++) {
    const next = [];
    for (const prefix of out) {
      for (let f = 0; f < formCount; f++) next.push([...prefix, f]);
    }
    out = next;
  }
  return out;
}

function round(x) {
  return Math.round(x * 1e6) / 1e6;
}

/**
 * عند تساوي الدرجتين تُرجَّح الصيغة الموافقة للحقل المكتوب فيه:
 * ما كُتب في حقل العجز فصورة العجز أولى به. والأعلى درجةً يفوز دائمًا،
 * فلا يُتجاوَز الوزن — الترجيح عند التساوي وحده.
 */
function betterForm(candidate, current, preferRole) {
  // بدرجة الترتيب لا بالمعروضة — لسببين: المعروضة لا تفرّق بين الصدر
  // والعجز (الفرق بينهما علّةٌ في الضرب مأذون فيها)، وهي حكمٌ على
  // البيت لا قياسٌ لقربه من الصيغة.
  if (candidate.rankScore > current.rankScore + 1e-12) return true;
  if (candidate.rankScore < current.rankScore - 1e-12) return false;
  if (candidate.score > current.score + 1e-12) return true;
  if (candidate.score < current.score - 1e-12) return false;
  if (!preferRole) return false;
  return candidate.formRole === preferRole && current.formRole !== preferRole;
}

/** موضع البحر في قائمة المصدر — به يُرجَّح عند تساوي الدرجات. */
function sourceOrder(registry, meterId) {
  const m = registry.byId.get(meterId);
  return m && Number.isFinite(m.sourceIndex) ? m.sourceIndex : Number.MAX_SAFE_INTEGER;
}
