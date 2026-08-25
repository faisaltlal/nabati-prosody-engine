/**
 * مطابقة **جزئية**: البيت وهو يُكتب، لا البيت بعد تمامه.
 *
 * الفرق عن `meterMatcher` واحد وجوهري: ما لم يُكتب بعد لا يُحاسَب.
 *
 * المطابق التامّ يفترض أن ما بين يديه شطر منتهٍ، فيغرّم النقص: تفعيلة
 * لم تمتلئ، ومقاطع طلبها البحر ولم يجدها. وهذا صواب هناك وخطأ هنا: من
 * كتب «البا» لم يكسر مستفعلن، بل بلغ منها مقطعين ولمّا يبلغ الرابع.
 * فالنقص عنده خبرٌ عن موضعه من الشطر لا عيبٌ في شعره.
 *
 * فهنا تنتهي المطابقة عند آخر ما كُتب: التفعيلات التامّة قبله تُحاسَب
 * حسابها المعتاد، والتفعيلة الجارية تُطابَق بادئةً، وما بعدها لا يُذكر
 * أصلًا. والكلفة تُنسَب إلى ما كُتب لا إلى طول البحر، وإلا لبدا كل بحر
 * طويل مكسورًا في أول حرف.
 *
 * ولأن المطابقة تنتهي حيث انتهت الكتابة، فالبحر الطويل والبحر القصير
 * يستويان ما دام المكتوب بادئةً لهما معًا. وهذا صدقٌ لا نقص: من كتب
 * ثمانية مقاطع لم يخبرنا بعدُ أيريد الحدا أم أوّل الرجز. ولذلك يُرجع
 * هذا الملف ترتيبًا ويُعلن التساوي، ولا يدّعي حسمًا لم يبلغه النصّ.
 */

import { matchFootBoth, minSyllablesToEnd, createAlignmentCache } from './footMatcher.js';
import { edgeToSyllable } from '../prosody/syllableDag.js';

/**
 * @param {object} dag مخطّط مقاطع ما كُتب
 * @param {object} meter من السجلّ
 * @param {object} scorer
 * @param {{ form?: number }} [options] أي صيغتَي البحر تُجرَّب (صدر/عجز)
 */
export function matchMeterPartial(dag, meter, scorer, options = {}) {
  const formIndex = options.form || 0;
  const form = pickForm(meter, formIndex);
  const feet = expandForm(form);
  if (!feet.length) return null;

  const end = dag.size; // موضع آخر وحدة كُتبت
  const tailCost = minSyllablesToEnd(dag);

  let states = new Map([[0, { cost: 0, licensed: 0, hashw: 0, chosen: [] }]]);
  let best = null;

  /** ينظر في مرشَّح انتهت عنده الكتابة، ويحتفظ بأقلّه كلفةً. */
  const considerTerminal = (cost, licensed, hashw, chosen, footsDone, pending) => {
    const typed = countTyped(chosen, pending);
    // مقياس الترتيب: الكلفة منسوبةً إلى ما كُتب. القسمة على طول البحر
    // كاملًا تُجازي البحور الطويلة على طولها لا على موافقتها.
    const norm = Math.max(typed, scorer.config.normalizer.floor);
    const unit = norm * scorer.config.normalizer.perSyllableCost;
    const scored = cost / unit;
    // والمعروض عيوبُ ما كُتب وحدها — كما في المطابقة التامّة — وفيها
    // شبهةُ الصورة في الحشو.
    const defects = (Math.max(0, cost - licensed) + hashw * scorer.hashwPenalty(unit)) / unit;
    if (!best || scored < best.scored - 1e-12) {
      best = { cost, licensed, hashw, chosen, footsDone, pending, typed, scored, defects };
    }
  };

  for (let f = 0; f < feet.length; f++) {
    const foot = feet[f];
    const posCtx = { isFirst: foot.isFirst, isArudDarb: foot.isArudDarb };
    const posMult = scorer.positionMultiplier(posCtx);
    const next = new Map();

    for (const [u, state] of states) {
      // (أ) الكتابة بلغت هذا الحدّ تمامًا: التفعيلات الباقية لم تُكتب بعد.
      if (u === end) considerTerminal(state.cost, state.licensed, state.hashw, state.chosen, f, null);

      for (const variant of foot.variants) {
        const vCost = scorer.variationCost(variant, posCtx);
        const vLicence = scorer.variationLicence(variant, posCtx);
        const inHashw = scorer.isHashwVariation(variant, posCtx) ? 1 : 0;
        // محاذاة واحدة تعطي التامّ والبادئة معًا — إجراؤها مرّتين كان
        // يضاعف كلفة أسخن حلقة في المحرك بلا فائدة.
        const { ends, prefixes } = matchFootBoth(
          dag, u, variant.syllables, scorer, u < end ? end : undefined, options.cache
        );

        // (ب) التفعيلة الجارية: بادئةٌ منها تنتهي عند آخر ما كُتب.
        if (u < end) {
          for (const [filled, res] of prefixes) {
            // البادئة الصفرية هي الحالة (أ). والتامّة لا تصل هنا أصلًا:
            // `matchFootBoth` تُخرجها في `ends` لا في `prefixes`.
            if (filled === 0) continue;
            considerTerminal(
              state.cost + (vCost + res.cost) * posMult,
              state.licensed + (vLicence + (res.licence || 0)) * posMult,
              state.hashw + inHashw,
              state.chosen,
              f,
              { footIndex: f, foot, variant, filled, res, unitSpan: [u, end], posMult, vCost }
            );
          }
        }

        // (ج) تفعيلة تامّة تتقدّم بالحالة كما في المطابق التامّ.
        for (const [to, res] of ends) {
          if (to === u) continue; // تفعيلة لم تستهلك شيئًا: لا معنى لها هنا
          const cost = state.cost + (vCost + res.cost) * posMult;
          const licensed = state.licensed + (vLicence + (res.licence || 0)) * posMult;
          const prev = next.get(to);
          if (prev !== undefined && prev.cost <= cost + 1e-12) continue;
          next.set(to, {
            cost,
            licensed,
            hashw: state.hashw + inHashw,
            chosen: [...state.chosen, describeFoot(f, foot, variant, res, [u, to], vCost, posMult)],
          });
        }
      }
    }

    states = next;
    if (states.size === 0) break;
  }

  // الشطر اكتمل: كل تفعيلات الصيغة كُتبت.
  for (const [u, state] of states) {
    if (u === end) considerTerminal(state.cost, state.licensed, state.hashw, state.chosen, feet.length, null);
  }

  // كُتب أكثر ممّا تسع الصيغة: الزائد يُحاسَب كما يحاسبه المطابق التامّ،
  // فيبقى البحر في الترتيب مع بيان أن فيه فضلة.
  for (const [u, state] of states) {
    if (u === end) continue;
    const leftover = tailCost[u];
    if (!Number.isFinite(leftover)) continue;
    considerTerminal(
      state.cost + leftover * scorer.weights.unconsumedSyllable,
      state.licensed, state.hashw,
      state.chosen, feet.length, null
    );
  }

  if (!best) return null;

  const complete = best.footsDone >= feet.length && !best.pending;
  const partialFoot = best.pending
    ? partialFootView(best.pending)
    : null;

  return {
    meterId: meter.id,
    name: meter.name,
    aliases: meter.aliases,
    status: meter.status,
    form: formIndex,
    formRole: form.role || null,
    matched: true,
    // الدرجة هنا درجة **موافقة ما كُتب**، لا درجة البيت. تُقرأ: هل ما
    // كُتب حتى الآن يسير على هذا البحر؟
    // المعروضة: عيوبُ ما كُتب وحدها — الرخصةُ المأذون فيها ليست عيبًا.
    progressScore: clamp01(round(1 - best.defects)),
    // والترتيب يبقى بالكلفة كاملةً، فيتقدّم السالم على المزاحَف.
    rankProgress: clamp01(round(1 - best.scored)),
    hashwVariations: best.hashw,
    typedSyllables: best.typed,
    meterSyllables: feet.reduce((n, x) => n + (x.salim ? x.salim.length : 0), 0),
    complete,
    feet: best.chosen,
    partialFoot,
    // المقاطع التي اختارها هذا التطابق بعينه — لا القراءة الحرّة.
    // منها تُشتقّ حروف كل تفعيلة، فتصطفّ مع رمزها.
    syllables: [
      ...best.chosen.flatMap((c) => c.ops.filter((o) => o.edge).map((o) => edgeToSyllable(o.edge))),
      ...(best.pending
        ? best.pending.res.ops.filter((o) => o.edge).map((o) => edgeToSyllable(o.edge))
        : []),
    ],
    // التفعيلات التي لم يبلغها القلم بعد — تُعرض باهتةً لا ناقصةً.
    remaining: feet
      .slice(best.footsDone + (best.pending ? 1 : 0))
      .map((x) => ({ tafila: x.plain, tafilaId: x.tafilaId, syllables: x.salim })),
    cost: round(best.cost),
    assumedVocalization: dag.assumedVocalization,
  };
}

/** يرتّب البحور على موافقة ما كُتب، ويُعلن ما تساوى منها. */
export function rankMetersPartial(dag, registry, scorer, options = {}) {
  const results = [];
  const cache = options.cache === false ? null : (options.cache || createAlignmentCache());
  for (const meter of registry.enabled) {
    const formCount = meter.forms ? meter.forms.length : 1;
    let bestForMeter = null;
    for (let f = 0; f < formCount; f++) {
      const r = matchMeterPartial(dag, meter, scorer, { ...options, form: f, cache: cache || false });
      if (!r) continue;
      if (!bestForMeter || better(r, bestForMeter, options.preferRole)) bestForMeter = r;
    }
    if (bestForMeter) results.push(bestForMeter);
  }
  results.sort(
    (a, b) =>
      b.progressScore - a.progressScore ||
      // ثم درجة الترتيب: هي التي تفرّق بين المتساوين في السلامة.
      b.rankProgress - a.rankProgress ||
      // عند التساوي يُقدَّم الأقصر: من كتب ثمانية مقاطع فالحدا أقرب
      // احتمالًا من ربع الرجز، وهذا ترجيح عرضٍ لا حكمٌ على الوزن —
      // والتساوي مُعلَن في `tied` على كل حال.
      a.meterSyllables - b.meterSyllables ||
      // ثم الأسبق في قائمة المصدر، لا الأسبق هجاءً.
      order(registry, a.meterId) - order(registry, b.meterId) ||
      a.meterId.localeCompare(b.meterId)
  );
  return results;
}

/**
 * أيّ الصيغتين أولى حين تتساوى الدرجتان؟
 *
 * الصدر والعجز صورتان للبحر الواحد، وكثيرًا ما يقبل الشطرُ الواحد
 * الصورتين بالدرجة نفسها. والوزن لا يرجّح بينهما حينئذ — لكن الحقل
 * الذي كُتب فيه يرجّح: ما كُتب في حقل العجز فصورة العجز أولى به.
 *
 * وهذا استعمالٌ لخبرٍ تملكه الواجهة، لا تجاوزٌ للوزن: الأعلى درجةً
 * يفوز دائمًا، والدور هنا عند التساوي وحده.
 */
function better(candidate, current, preferRole) {
  if (candidate.progressScore > current.progressScore + 1e-12) return true;
  if (candidate.progressScore < current.progressScore - 1e-12) return false;
  // الدرجة المعروضة لا تفرّق بين الصدر والعجز — الفرق بينهما علّةٌ في
  // الضرب مأذون فيها — فيفرّق بينهما ترتيبُ الترجيح.
  if (candidate.rankProgress > current.rankProgress + 1e-12) return true;
  if (candidate.rankProgress < current.rankProgress - 1e-12) return false;
  if (!preferRole) return false;
  return candidate.formRole === preferRole && current.formRole !== preferRole;
}

function order(registry, meterId) {
  const m = registry.byId.get(meterId);
  return m && Number.isFinite(m.sourceIndex) ? m.sourceIndex : Number.MAX_SAFE_INTEGER;
}

function pickForm(meter, index) {
  const available = meter.forms && meter.forms.length
    ? meter.forms
    : [{ feet: meter.feet, role: null }];
  return available[Math.min(index, available.length - 1)];
}

function expandForm(form) {
  return form.feet.map((foot, i) => ({
    ...foot,
    isFirst: i === 0,
    isArudDarb: i === form.feet.length - 1,
  }));
}

function describeFoot(f, foot, variant, res, unitSpan, vCost, posMult) {
  return {
    footIndex: f,
    tafila: foot.plain,
    tafilaId: foot.tafilaId,
    variant: { id: variant.id, name: variant.name, result: variant.result, kind: variant.kind },
    expected: variant.syllables,
    actual: res.syllables.map((e) => e.weight),
    unitSpan,
    alignCost: res.cost,
    ops: res.ops,
    complete: true,
    totalCost: (vCost + res.cost) * posMult,
  };
}

function partialFootView(p) {
  return {
    footIndex: p.footIndex,
    tafila: p.foot.plain,
    tafilaId: p.foot.tafilaId,
    variant: { id: p.variant.id, name: p.variant.name, result: p.variant.result, kind: p.variant.kind },
    // كم مقطعًا من التفعيلة تحقّق حتى الآن — منه يُشتقّ اسمها الجزئي.
    filled: p.filled,
    of: p.variant.syllables.length,
    expected: p.variant.syllables,
    actual: p.res.syllables.map((e) => e.weight),
    unitSpan: p.unitSpan,
    alignCost: p.res.cost,
    ops: p.res.ops,
    complete: false,
  };
}

function countTyped(chosen, pending) {
  let n = 0;
  for (const c of chosen) n += c.actual.length;
  if (pending) n += pending.res.syllables.length;
  return n;
}

const round = (x) => Math.round(x * 1e6) / 1e6;
const clamp01 = (x) => Math.max(0, Math.min(1, x));
