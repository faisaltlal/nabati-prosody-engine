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
import { buildReadableDag, freeSyllabify, edgeToSyllable } from '../prosody/syllableDag.js';
import { rankMetersPartial } from '../matching/partialMatcher.js';
import { partialTafilaName } from '../meters/registry.js';
import { analyzeRhyme } from '../rhyme/rhymeAnalyzer.js';
import { prosodicLetters, splitLettersByFeet } from '../prosody/prosodicLetters.js';
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
export function analyzeHemistich(text, engine, options = {}) {
  const clean = String(text || '').trim();
  if (!clean) return null;

  const norm = normalize(clean);
  if (!norm.words.length) return null;

  const { units: raw } = phonemize(norm.words, engine.lexicon, { pausalEnd: true });
  if (!raw.length) return null;

  // الشاعر يكتب السكون علامةَ سرعةٍ في النطق، فيجتمع ساكنان لا يقبلان
  // تقطيعًا. تركُ ذلك يُخرج الشاشة بيضاء عند كل حرف — فيُرخى ويُعلَن.
  const readable = buildReadableDag(raw);
  const units = readable.units;
  const dag = readable.dag;
  const free = freeSyllabify(dag);
  const partialRanking = rankMetersPartial(dag, engine.registry, engine.scorer, {
    preferRole: options.preferRole,
  });
  const partialBest = partialRanking[0] || null;

  // التحليل التامّ: صوابه إن كان المكتوب شطرًا منتهيًا.
  const full = analyzeLine(clean, engine, { repeats: [1], preferRole: options.preferRole });
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

  // المقاطع المعروضة هي التي اختارها التطابق المعروض نفسه، لا قراءةٌ
  // حرّة أخرى — وإلا لم تصطفّ الحروف مع التفعيلات.
  const syllables = source === 'full'
    ? full.syllables
    : (partialBest && partialBest.syllables.length
        ? partialBest.syllables
        : free.syllables.map((s) => (s.weight ? s : edgeToSyllable(s))));

  // نصّ كل تفعيلة حروفُها العروضية لا كلماتُها: التفعيلة لا تقف عند
  // حدّ الكلمة، فعرضُ الكلمات يُكرّر الواحدة في تفعيلتين. أمّا الحروف
  // فتقع في واحدة لا غير، وتصطفّ مع الرمز حرفًا برمز.
  const letters = prosodicLetters(syllables, units);
  const cards = source === 'partial'
    ? cardsFromPartial(partialBest, engine, letters)
    : cardsFromFull(full, engine, letters);

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
    // الكتابة العروضية حرفًا حرفًا مع رمز كل حرف — يصطفّان معًا.
    letters: letters.map((l) => ({
      ch: l.ch,
      symbol: l.moving ? '/' : '0',
      role: l.role,
    })),
    typedSyllables: partialBest ? partialBest.typedSyllables : syllables.length,
    meterSyllables: partialBest ? partialBest.meterSyllables : null,
    brokenFeet: source === 'full' ? full.brokenFeet : [],
    rhyme: analyzeRhyme(syllables, engine.data.rhyme, units),
    assumedVocalization: dag.assumedVocalization,
    // تشكيلٌ مكتوب لم يقبل تقطيعًا فأُرخيت سكوناته — يُقال ولا يُخفى.
    relaxedSukun: readable.relaxed,
    readable: readable.readable,
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
    // الحقل نفسه خبرٌ: ما كُتب في حقل العجز فصورة العجز أولى به
    // عند تساوي الدرجات.
    result: analyzeHemistich(p.text, engine, { preferRole: p.role }),
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

/** تعريف الصورة من البيانات — لا نصّ منها مكتوب في الكود. */
function licenceOf(engine, variantId, baseName, resultName, variantName) {
  const def = engine.data.variations.definitions?.[variantId];
  if (!def) return null;
  return {
    id: variantId,
    name: variantName,
    category: def.category,
    definition: def.definition,
    from: baseName,
    to: resultName,
  };
}

/**
 * التفعيلة المزيدة زيادتُها علّة وإن كانت في القاعدة تفعيلةً مستقلّة.
 *
 * «فاعلاتان» في هذه القاعدة تفعيلةٌ قائمة بنفسها لا صورةٌ من صور
 * «فاعلاتن»، لأن العجز يُبنى عليها. لكنها في العروض زيادةُ ساكنٍ على
 * فاعلاتن، وإخفاء ذلك يجعل عجز البيت يبدو بلا علّة وهو معلول.
 *
 * والاسم يُشتقّ ولا يُكتب: الزيادة على آخره وتد مجموع (مقطعان S ثم L)
 * تذييلٌ، وعلى سبب خفيف تسبيغٌ.
 */
function addedSakinLicence(engine, tafilaId) {
  const t = engine.registry.tafilaById.get(tafilaId);
  if (!t || t.family !== 'mudhayyal' || !t.baseOf) return null;
  const base = engine.registry.tafilaById.get(t.baseOf);
  if (!base) return null;
  const last2 = base.syllables.slice(-2).join('');
  const id = last2 === 'SL' ? 'tadhyil' : 'tasbeegh';
  const def = engine.data.variations.definitions?.[id];
  if (!def) return null;
  return {
    id,
    name: id === 'tadhyil' ? 'التذييل' : 'التسبيغ',
    category: def.category,
    definition: def.definition,
    from: base.plain,
    to: t.plain,
  };
}

function cardState(engine, tafilaId, isSalim, variationName) {
  if (!isSalim) return variationName;
  const added = addedSakinLicence(engine, tafilaId);
  return added ? added.name : STATE.salim;
}

function cardKind(engine, tafilaId, isSalim) {
  if (!isSalim) return 'licensed';
  return addedSakinLicence(engine, tafilaId) ? 'licensed' : 'salim';
}

function card(engine, { name, syllables, state, kind, variation, text, broken, dim, licence }) {
  return {
    name,
    // الرمز العروضي يُشتقّ من المقاطع بالترميز نفسه الذي يستعمله المحرك،
    // لا بجدول مكتوب في الواجهة.
    symbol: engine.encoder.encode(syllables, 'arudi_slash_zero').value,
    text: text || '',
    state,
    kind: kind || null,
    variation: variation || null,
    licence: licence || null,
    broken: !!broken,
    dim: !!dim,
  };
}

/** اسم الصورة مجرَّدًا من التشكيل — للعرض في سطر العلّة. */
function plainName(vocalized) {
  return [...String(vocalized)].filter((c) => !/[\u064B-\u0652\u0670]/.test(c)).join('');
}

function cardsFromFull(full, engine, letters) {
  const texts = splitLettersByFeet(
    letters,
    full.tafaeel.map((f) => (f.actual === '—' ? 0 : [...f.actual].length))
  );
  return full.tafaeel.map((f, i) => {
    const broken = f.sound === false;
    const isSalim = !f.variation || f.variation === 'سالم';
    return card(engine, {
      name: f.tafila,
      syllables: [...f.expected],
      state: broken ? 'مكسورة' : cardState(engine, f.tafilaId, isSalim, f.variation),
      kind: broken ? 'broken' : cardKind(engine, f.tafilaId, isSalim),
      variation: isSalim ? null : f.variation,
      licence: isSalim
        ? addedSakinLicence(engine, f.tafilaId)
        : licenceOf(engine, f.variationId, f.tafila, plainName(f.realized), f.variation),
      text: texts[i] || '',
      broken,
    });
  });
}

function cardsFromPartial(best, engine, letters) {
  if (!best) return [];
  const counts = best.feet.map((f) => f.actual.length);
  if (best.partialFoot) counts.push(best.partialFoot.actual.length);
  const texts = splitLettersByFeet(letters, counts);
  const out = [];

  let i = 0;
  for (const f of best.feet) {
    const isSalim = f.variant.kind === 'salim';
    const broken = f.alignCost >= engine.scorer.brokenFootThreshold;
    out.push(card(engine, {
      name: partialTafilaName(f.variant.result, f.expected, f.expected.length),
      syllables: f.expected,
      state: broken ? 'مكسورة' : cardState(engine, f.tafilaId, isSalim, f.variant.name),
      kind: broken ? 'broken' : cardKind(engine, f.tafilaId, isSalim),
      variation: isSalim ? null : f.variant.name,
      licence: isSalim
        ? addedSakinLicence(engine, f.tafilaId)
        : licenceOf(engine, f.variant.id, f.tafila, plainName(f.variant.result), f.variant.name),
      text: texts[i++] || '',
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
      text: texts[i++] || '',
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
