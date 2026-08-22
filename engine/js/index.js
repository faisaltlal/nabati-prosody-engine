/**
 * محرك عروض الشعر النبطي — نقطة الدخول الوحيدة.
 *
 * المحرك حتمي بالكامل: لا عشوائية، ولا نموذج لغوي، ولا نسبة مقدَّرة.
 * النصّ نفسه مع البيانات نفسها يعطي النتيجة نفسها في كل تشغيل.
 *
 *   import { createEngine } from './engine/js/index.js';
 *   import { DATA } from './engine/js/data.generated.js';
 *   const engine = createEngine(DATA);
 *   engine.analyze('بيت من الشعر');
 */

import { buildRegistry } from './meters/registry.js';
import { createScorer } from './scoring/scorer.js';
import { createEncoder } from './prosody/digitalPattern.js';
import { analyzeLine } from './analysis/lineAnalyzer.js';
import { analyzePoem } from './analysis/poemAnalyzer.js';
import { analyzeLive, analyzeHemistich } from './analysis/liveAnalyzer.js';
import { checkAttempt, exercises, DIFFICULTY } from './analysis/trainingMode.js';
import { isDebugEnabled, traceReport, dumpDag } from './debug/trace.js';
import { normalize, splitHemistichs, splitLines } from './text/normalizer.js';
import { phonemize } from './phonology/phonemizer.js';
import { buildSyllableDag, freeSyllabify } from './prosody/syllableDag.js';
import { matchMeter, rankMeters } from './matching/meterMatcher.js';

/**
 * نطق أسماء التفعيلات، مشتقًّا من `tafaeel.json` و`variations.json`.
 *
 * الفائدة عملية: هذه صفحة تجربةٍ للمحرك، وأكثر ما يُكتب فيها للاختبار
 * أسماءُ التفعيلات نفسها. و«مستفعلن» مجرّدةً من التشكيل تحتمل قراءات،
 * فيتعادل عليها الرجز والرمل والوافر تعادلًا تامًّا — ومَن كتبها إنما
 * أراد `مُسْتَفْعِلُنْ` لا غير.
 *
 * ولا اختراع فيه: التشكيل مأخوذ من البيانات نفسها التي يُبنى منها
 * البحر. وما احتمل نطقين — «فعلن» فَعِلُنْ أو فَعْلُنْ — يُترك حرًّا
 * ولا يُفرض عليه أحدهما.
 *
 * ولا يُطبَّق إلا على كلمة كُتبت مجرّدة: تشكيل الشاعر أولى دائمًا.
 */
function tafilaVocalizations(data) {
  const strip = (s) => [...s].filter((c) => !/[\u064B-\u0652\u0670]/.test(c)).join('');
  const seen = new Map();
  const add = (vocalized) => {
    const plain = strip(vocalized);
    if (!seen.has(plain)) seen.set(plain, new Set());
    seen.get(plain).add(vocalized);
  };
  for (const t of data.tafaeel.tafaeel) add(t.vocalized);
  for (const list of Object.values(data.variations.variations)) {
    for (const v of list) add(v.result);
  }
  const out = {};
  for (const [plain, forms] of seen) {
    if (forms.size === 1) out[plain] = [...forms][0]; // ما احتمل نطقين يُترك
  }
  return out;
}

export function createEngine(data) {
  const registry = buildRegistry(data);
  const scorer = createScorer(data.scoring);
  const encoder = createEncoder(data.encodings);

  const engine = {
    registry,
    scorer,
    encoder,
    lexicon: { ...data.lexicon, tafilaVocalizations: tafilaVocalizations(data) },
    data,

    /** تحليل بيت واحد. */
    analyze(input, options = {}) {
      const debug = isDebugEnabled(options.debug);
      const result = analyzeLine(input, engine, { ...options, debug });
      if (debug) result.trace = traceReport(result);
      return result;
    },

    /**
     * التحليل اللحظي أثناء الكتابة — حقلا الصدر والعجز.
     * الحقل الفارغ لا يُعطّل شيئًا: يُحلَّل المكتوب وحده.
     */
    analyzeLive(fields, options = {}) {
      return analyzeLive(fields || {}, engine, options);
    },

    /** شطر واحد وهو يُكتب. */
    analyzeHemistich(text, options = {}) {
      return analyzeHemistich(text, engine, options);
    },

    /** تحليل قصيدة كاملة. */
    analyzePoem(input, options = {}) {
      return analyzePoem(input, engine, options);
    },

    /** وضع التدريب. */
    train(input, targetMeter, options = {}) {
      return checkAttempt(input, targetMeter, engine, options);
    },

    exercises() {
      return exercises(engine);
    },

    /** البحور المفعَّلة وغير المفعَّلة وما ينقصها. */
    listMeters() {
      return registry.meters.map((m) => ({
        id: m.id,
        name: m.name,
        aliases: m.aliases,
        enabled: m.enabled,
        status: m.status,
        sourceQuote: m.sourceQuote,
        tafaeel: m.tafaeelNames,
        pattern: m.pattern.join(''),
        syllableCount: m.pattern.length,
        blockedBy: m.enabled ? null : (m.derivation?.why_not_implemented || m.status),
        needs: m.enabled ? null : (m.derivation?.resolvedBy || m.validation?.resolvedBy),
      }));
    },

    /** كل ما يحتاج تحقّقًا — البند 26. */
    openQuestions() {
      const out = [];
      for (const t of data.tafaeel.tafaeel) {
        if (t.status === 'NEEDS_VALIDATION') {
          out.push({ area: 'tafila', id: t.id, name: t.plain, ...t.validation });
        }
      }
      for (const m of registry.meters) {
        if (m.status === 'NEEDS_VALIDATION') {
          out.push({
            area: 'meter', id: m.id, name: m.name,
            issue: m.validation?.issue || m.derivation?.why_not_implemented,
            resolvedBy: m.validation?.resolvedBy || m.derivation?.resolvedBy,
            enabled: m.enabled,
          });
        }
      }
      for (const s of data.encodings.schemes) {
        if (s.status === 'NEEDS_VALIDATION') {
          out.push({ area: 'encoding', id: s.id, issue: s.note, resolvedBy: s.resolvedBy });
        }
      }
      for (const n of registry.notInSource) {
        out.push({ area: 'missing_meter', name: n.name, issue: n.reason, resolvedBy: 'تفعيلات البحر' });
      }
      // صور مسجَّلة ومعطَّلة: قواعد وردت في المادة ولم تثبت في النبطي.
      for (const [tafilaId, list] of Object.entries(data.variations.variations)) {
        for (const v of list) {
          if (v.enabled === false) {
            out.push({
              area: 'variation', id: `${tafilaId}/${v.id}`, name: v.name,
              issue: v.validation?.issue,
              resolvedBy: v.validation?.resolvedBy,
            });
          }
        }
      }
      if (data.rhyme?.nabatiSpecific?.status === 'NEEDS_VALIDATION') {
        out.push({
          area: 'rhyme', id: 'nabatiRhyme',
          issue: data.rhyme.nabatiSpecific.note,
          gaps: data.rhyme.nabatiSpecific.knownGaps,
          resolvedBy: data.rhyme.nabatiSpecific.resolvedBy,
        });
      }
      if (data.lexicon.nabatiDialect?.status === 'NEEDS_VALIDATION') {
        out.push({
          area: 'dialect', id: 'nabatiDialect',
          issue: data.lexicon.nabatiDialect.note,
          gaps: data.lexicon.nabatiDialect.knownGaps,
        });
      }
      return out;
    },

    /** مشكلات تناسق البيانات — تُفحص في الاختبارات. */
    integrity() {
      return registry.problems;
    },

    /** المراحل الوسيطة مكشوفة للاختبار المنفصل لكل طبقة (البند 19). */
    stages: {
      normalize,
      splitHemistichs,
      splitLines,
      phonemize: (text, options) => {
        const n = normalize(text);
        return phonemize(n.words, data.lexicon, options);
      },
      syllabify: (text, options) => {
        const n = normalize(text);
        const { units } = phonemize(n.words, data.lexicon, options);
        const dag = buildSyllableDag(units, options);
        return { units, dag, free: freeSyllabify(dag) };
      },
      dumpDag,

      /** مطابقة نمط مقطعي معطى مباشرةً — لاختبار المطابق وحده. */
      matchPattern(syllables, meterRef, options = {}) {
        const meter = typeof meterRef === 'string' ? registry.find(meterRef) : meterRef;
        if (!meter) throw new Error(`بحر غير معروف: ${meterRef}`);
        return matchMeter(patternToDag(syllables), meter, scorer, options);
      },

      rankPattern(syllables, options = {}) {
        return rankMeters(patternToDag(syllables), registry, scorer, options);
      },

      patternToDag,
    },
  };

  return engine;
}

/**
 * مخطّط بمسار واحد يمثّل نمطًا مقطعيًا معطى.
 * يُستعمل لاختبار المطابقة والدرجة معزولتين عن طبقتَي الصوت والمقاطع.
 */
export function patternToDag(syllables) {
  const pattern = Array.isArray(syllables) ? syllables : [...String(syllables)];
  const edges = Array.from({ length: pattern.length + 1 }, () => []);
  pattern.forEach((weight, i) => {
    edges[i].push({
      from: i, to: i + 1, weight,
      meta: { shape: null, consumed: [i], onset: null, nucleus: null },
    });
  });
  return { edges, size: pattern.length, assumedVocalization: false };
}

export { normalize, splitHemistichs, splitLines, phonemize, buildSyllableDag, freeSyllabify, DIFFICULTY, traceReport, dumpDag, matchMeter, rankMeters };
