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

import { matchFoot, minSyllablesToEnd } from './footMatcher.js';

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
  let states = new Map([[0, { cost: 0, chosen: [] }]]);

  for (let f = 0; f < feet.length; f++) {
    const foot = feet[f];
    const next = new Map();
    const posCtx = { isFirst: foot.isFirst, isArudDarb: foot.isArudDarb };
    const posMult = scorer.positionMultiplier(posCtx);

    for (const [u, state] of states) {
      for (const variant of foot.variants) {
        const vCost = scorer.variationCost(variant, posCtx);
        const ends = matchFoot(dag, u, variant.syllables, scorer);
        for (const [end, res] of ends) {
          let cost = state.cost + (vCost + res.cost) * posMult;
          if (end === u) cost += scorer.weights.unfilledFoot;

          const prev = next.get(end);
          if (prev !== undefined && prev.cost <= cost + 1e-12) continue;

          next.set(end, {
            cost,
            chosen: [
              ...state.chosen,
              {
                footIndex: f,
                hemistich: foot.hemistich,
                tafila: foot.plain,
                tafilaId: foot.tafilaId,
                variant: { id: variant.id, name: variant.name, result: variant.result, kind: variant.kind },
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
      best = { total, state, endUnit: u, leftoverSyllables: leftover };
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
  const { score, confidence, cost, normalizer } = scorer.finalize(
    best.total,
    meterSyllables,
    { assumedVocalization: dag.assumedVocalization }
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
    score,
    confidence,
    cost,
    normalizer,
    verdict: scorer.classify(score, { brokenFeet: brokenFeet.length, totalFeet: chosen.length }),
    feet: chosen,
    matchedPattern: chosen.flatMap((c) => c.expected).join(''),
    actualPattern: chosen.flatMap((c) => c.actual).join(''),
    brokenFeet,
    leftoverSyllables: best.leftoverSyllables,
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

  for (const meter of registry.enabled) {
    let bestForMeter = null;
    const formCount = meter.forms ? meter.forms.length : 1;
    for (const repeat of repeats) {
      for (const forms of formCombinations(formCount, repeat)) {
        const r = matchMeter(dag, meter, scorer, { repeat, forms });
        if (!r || !r.matched) continue;
        if (!bestForMeter || r.score > bestForMeter.score) bestForMeter = r;
      }
    }
    if (bestForMeter) results.push(bestForMeter);
  }

  results.sort((a, b) => b.score - a.score || a.meterId.localeCompare(b.meterId));
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
