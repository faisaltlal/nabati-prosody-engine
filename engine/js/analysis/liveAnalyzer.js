/**
 * التحليل اللحظي: البيت وهو يُكتب حرفًا حرفًا.
 *
 * الواجهة لا زرّ فيها. فكل ضغطة مفتاح تستدعي هذا الملف، ويجب أن يخرج
 * منه شيء نافع أيًّا كان ما كُتب — حرفٌ واحد، أو كلمة ناقصة، أو شطر
 * تامّ، أو بيت كامل.
 *
 * ولذلك يجري تحليلان لا واحد:
 *
 *   التامّ (`analyzeLine`)   يفترض شطرًا منتهيًا، فيغرّم النقص. صوابه
 *                            حين يفرغ الكاتب، وخطؤه حين يكون في وسط
 *                            الكلمة.
 *   الجزئي (`partialMatcher`) لا يحاسب ما لم يُكتب بعد. صوابه أثناء
 *                            الكتابة، وقصورُه أنه لا يميّز الشطر التامّ
 *                            من بادئةِ شطر أطول منه.
 *
 * فيُعرض التقطيع من التامّ إذا حكم بأن ما بين يديه موزون، ومن الجزئي
 * فيما عدا ذلك. وهذا يعطي السلوك المطلوب من غير أن يُخمَّن متى فرغ
 * الكاتب: «البا» تُعرض «مستف»، و«البارحه» تُعرض «مستفعلن»، والشطر
 * التامّ يُعرض بتفعيلاته وزحافاتها المسمّاة.
 */

import { normalize } from '../text/normalizer.js';
import { phonemize } from '../phonology/phonemizer.js';
import { buildSyllableDag, freeSyllabify, edgeToSyllable } from '../prosody/syllableDag.js';
import { rankMetersPartial } from '../matching/partialMatcher.js';
import { partialTafilaName } from '../meters/registry.js';
import { analyzeRhyme } from '../rhyme/rhymeAnalyzer.js';
import { analyzeLine } from './lineAnalyzer.js';

/** حالة كل تفعيلة كما تُعرض على بطاقتها. */
const STATE = {
  salim: 'سليمة',
  partial: 'قيد الكتابة',
  pending: 'لم تُكتب',
};

/**
 * يحلّل شطرًا واحدًا وهو يُكتب.
 * @param {string} text
 * @param {object} engine
 */
export function analyzeHemistich(text, engine) {
  const clean = String(text || '').trim();
  if (!clean) return null;

  const norm = normalize(clean);
  if (!norm.words.length) return null;

  const { units } = phonemize(norm.words, engine.lexicon, { pausalEnd: true });
  if (!units.length) return null;

  const dag = buildSyllableDag(units);
  const free = freeSyllabify(dag);
  const partialRanking = rankMetersPartial(dag, engine.registry, engine.scorer);
  const partialBest = partialRanking[0] || null;

  // التحليل التامّ: صوابه إن كان المكتوب شطرًا منتهيًا.
  const full = analyzeLine(clean, engine, { repeats: [1] });
  const fullIsSound = full.verdict === 'sound' || full.verdict === 'acceptable';

  // متى يُعرض الجزئي؟ حين يكون المكتوب **بادئة نظيفة** لبحر، أي يوافقه
  // بلا كلفة تُذكر وإنما ينقصه تمامه.
  //
  // بغير هذا الشرط يلتبس الشطر المكسور بالشطر الذي لم يتمّ: كلاهما
  // «ناقص» في نظر المطابق التامّ، فيُعرضان معًا «قيد الكتابة» ويُطوى
  // موضع الكسر عن صاحبه. والفرق بينهما ظاهر في الرقم: البادئة الحقّة
  // توافق بحرها موافقةً تامّة، والمكسور يقصر عنها.
  //
  // فإن قصر المكتوب عن عتبة السلامة، فليس ببادئة نظيفة، ويُعرض
  // التحليل التامّ بموضع كسره — وهذا أنفع لكاتبه من أن يُقال له
  // «أكمِل» وهو قد أكمل.
  const cleanPrefix =
    !!partialBest && partialBest.progressScore >= engine.scorer.thresholds.sound;
  const writing = !fullIsSound && cleanPrefix;

  // البحر مجهول تمامًا وليس ثمّ بادئة نظيفة: يُعرض أقرب ما وافق ما كُتب
  // بدل أن تُترك الشاشة فارغة.
  const fallbackToPartial = !writing && !full.bestMeter && !!partialBest;
  const source = writing || fallbackToPartial ? 'partial' : 'full';

  const cards = source === 'partial'
    ? cardsFromPartial(partialBest, engine, units, norm.words)
    : cardsFromFull(full, engine);

  const syllables = source === 'full'
    ? full.syllables
    : free.syllables.map((s) => (s.weight ? s : edgeToSyllable(s)));

  // البحور التي تساوت مع الأول في موافقة ما كُتب. أول الكتابة يوافقه
  // كثير منها، وإخفاء ذلك ادّعاء حسمٍ لم يبلغه النصّ.
  const tied = partialBest
    ? partialRanking
        .slice(1)
        .filter((r) => partialBest.progressScore - r.progressScore <= engine.scorer.config.uncertainty.tieDelta)
        .map((r) => ({ id: r.meterId, name: r.name, score: r.progressScore }))
    : [];

  return {
    text: clean,
    source,
    // «تامّ» هنا: حُكِم عليه حكمَ شطرٍ منتهٍ، سليمًا كان أو مكسورًا.
    complete: !writing,
    writing,
    meter: source === 'full'
      ? full.bestMeter && {
          id: full.bestMeter.id, name: full.bestMeter.name,
          score: full.bestMeter.score, verdict: full.verdict,
          formRole: full.bestMeter.formRole,
        }
      : partialBest && {
          id: partialBest.meterId, name: partialBest.name,
          score: partialBest.progressScore, verdict: 'writing',
          formRole: partialBest.formRole,
        },
    tied,
    cards,
    typedSyllables: partialBest ? partialBest.typedSyllables : syllables.length,
    meterSyllables: partialBest ? partialBest.meterSyllables : null,
    brokenFeet: source === 'full' ? full.brokenFeet : [],
    rhyme: analyzeRhyme(syllables, engine.data.rhyme, units),
    assumedVocalization: dag.assumedVocalization,
    verdict: full.verdict,
  };
}

/**
 * يحلّل البيت بحقلَيه. الحقل الفارغ لا يُعطَّل به شيء: يُحلَّل المكتوب
 * وحده، ويُترك الآخر بلا نتيجة.
 */
export function analyzeLive({ sadr, ajz }, engine) {
  const parts = [
    { role: 'sadr', label: 'الصدر', text: sadr },
    { role: 'ajz', label: 'العجز', text: ajz },
  ];

  const hemistichs = parts.map((p) => ({
    ...p,
    result: analyzeHemistich(p.text, engine),
  }));

  const written = hemistichs.filter((h) => h.result);
  if (!written.length) return { empty: true, hemistichs };

  // بحر البيت: ما اتّفق عليه الشطران المكتوبان. اتّفاقهما تأكيدٌ،
  // واختلافهما خبرٌ يُعرض ولا يُطوى.
  const names = written.map((h) => h.result.meter?.name).filter(Boolean);
  const agreed = names.length > 1 && names.every((n) => n === names[0]);
  const lead = written
    .slice()
    .sort((a, b) => (b.result.meter?.score || 0) - (a.result.meter?.score || 0))[0];

  return {
    empty: false,
    hemistichs,
    meter: lead.result.meter,
    agreed: names.length > 1 ? agreed : null,
    disagreement: names.length > 1 && !agreed
      ? written.map((h) => ({ role: h.role, label: h.label, name: h.result.meter?.name || null }))
      : null,
    complete: written.every((h) => h.result.complete),
    writing: written.some((h) => !h.result.complete),
  };
}

/* ─────────────── بطاقات التفعيلات ─────────────── */

function card(engine, { name, syllables, state, kind, variation, text, broken, dim }) {
  return {
    name,
    // الرمز العروضي يُشتقّ من المقاطع بالترميز نفسه الذي يستعمله المحرك،
    // لا بجدول مكتوب في الواجهة.
    symbol: engine.encoder.encode(syllables, 'arudi_slash_zero').value,
    text: text || '',
    state,
    kind: kind || null,
    variation: variation || null,
    broken: !!broken,
    dim: !!dim,
  };
}

function cardsFromFull(full, engine) {
  const threshold = engine.scorer.brokenFootThreshold;
  return full.tafaeel.map((f) => {
    const broken = f.sound === false;
    const isSalim = !f.variation || f.variation === 'سالم';
    return card(engine, {
      name: f.tafila,
      syllables: [...f.expected],
      state: broken ? 'مكسورة' : isSalim ? STATE.salim : f.variation,
      kind: broken ? 'broken' : isSalim ? 'salim' : 'licensed',
      variation: isSalim ? null : f.variation,
      text: (f.words || []).join(' ') || f.text || '',
      broken,
    });
  });
}

/** الكلمات التي وقعت في مدى وحدات تفعيلة — نظير `linkFeetToWords`. */
function wordsIn(unitSpan, units, words) {
  if (!units || !words || !unitSpan) return '';
  const [a, b] = unitSpan;
  const idx = [...new Set(units.slice(a, b).map((u) => u.word))];
  return idx.map((i) => words[i]?.text).filter(Boolean).join(' ');
}

function cardsFromPartial(best, engine, units, words) {
  if (!best) return [];
  const out = [];

  for (const f of best.feet) {
    const isSalim = f.variant.kind === 'salim';
    const broken = f.alignCost >= engine.scorer.brokenFootThreshold;
    out.push(card(engine, {
      name: partialTafilaName(f.variant.result, f.expected, f.expected.length),
      syllables: f.expected,
      state: broken ? 'مكسورة' : isSalim ? STATE.salim : f.variant.name,
      kind: broken ? 'broken' : isSalim ? 'salim' : 'licensed',
      variation: isSalim ? null : f.variant.name,
      text: wordsIn(f.unitSpan, units, words),
      broken,
    }));
  }

  if (best.partialFoot) {
    const p = best.partialFoot;
    out.push(card(engine, {
      // الاسم مقتطعٌ بقدر ما كُتب: «مستف» لا «مستفعلن».
      name: partialTafilaName(p.variant.result, p.expected, p.filled),
      syllables: p.expected.slice(0, p.filled),
      state: STATE.partial,
      kind: 'partial',
      text: wordsIn(p.unitSpan, units, words),
    }));
  }

  for (const r of best.remaining) {
    out.push(card(engine, {
      name: r.tafila,
      syllables: r.syllables,
      state: STATE.pending,
      kind: 'pending',
      dim: true,
    }));
  }

  return out;
}
