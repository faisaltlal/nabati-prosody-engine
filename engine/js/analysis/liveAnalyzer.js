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
import { prosodicLetters, groupLettersByFeet } from '../prosody/prosodicLetters.js';
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
  // ويؤخذ التعادل من الترتيب الذي خرج منه الحكم نفسه: أخذُه من ترتيب
  // آخر يُظهر البحرَ الفائز في قائمة منافسيه.
  const tied = source === 'full'
    ? ((full.ambiguity && full.ambiguity.tiedWith) || [])
        .map((t) => ({ id: t.id, name: t.name, score: t.score }))
    : partialBest
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
      // حرفٌ في النطق لا في الرسم: مدُّ الإشباع آخر الشطر.
      added: !!l.added,
    })),
    // ملاحظاتٌ على العرض نفسه. المحرك يُخرجها نصًّا ولا يطبعها: الطباعة
    // سلوك مضيف لا سلوك محرك.
    notes: letters.some((l) => l.added)
      ? ['آخر حرف في التقطيع مدُّ إشباعٍ لحركة الرويّ: يُنطق ولا يُرسم، وليس حرفًا في الكلمة.']
      : [],
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
export function analyzeLive(fields, engine) {
  // وضعان للإدخال:
  //   شطر — حقل واحد. لا يُعرف أصدرٌ هو أم عجز، فلا تُرجَّح صيغة على
  //         أخرى ويُترك الوزن وحده يحسم.
  //   بيت — حقلان. الحقل نفسه خبرٌ يُرجَّح به عند تساوي الدرجات.
  const parts = fields.single !== undefined
    ? [{ role: null, label: 'الشطر', text: fields.single }]
    : [
        { role: 'sadr', label: 'الصدر', text: fields.sadr },
        { role: 'ajz', label: 'العجز', text: fields.ajz },
      ];

  const hemistichs = parts.map((p) => ({
    ...p,
    result: analyzeHemistich(p.text, engine, { preferRole: p.role || undefined }),
  }));

  const written = hemistichs.filter((h) => h.result);
  if (!written.length) return { empty: true, hemistichs, warnings: [] };

  // بحر البيت: ما اتّفق عليه الشطران المكتوبان. اتّفاقهما تأكيدٌ،
  // واختلافهما خبرٌ يُعرض ولا يُطوى.
  const names = written.map((h) => h.result.meter?.name).filter(Boolean);
  const agreed = names.length > 1 && names.every((n) => n === names[0]);
  const lead = written
    .slice()
    .sort((a, b) => (b.result.meter?.score || 0) - (a.result.meter?.score || 0))[0];

  const disagreement = names.length > 1 && !agreed
    ? written.map((h) => ({ role: h.role, label: h.label, name: h.result.meter?.name || null }))
    : null;

  return {
    empty: false,
    hemistichs,
    meter: lead.result.meter,
    agreed: names.length > 1 ? agreed : null,
    disagreement,
    complete: written.every((h) => h.result.complete),
    writing: written.some((h) => !h.result.complete),
    warnings: collectWarnings(written, disagreement, engine),
  };
}

/**
 * كل ما يتحفّظ عليه المحرك في هذا التحليل، بيانًا لا عرضًا.
 *
 * هذه بدلٌ من صفحةٍ كانت تعرض التحفّظات للقارئ. والتحفّظ ليس خطأً
 * يُخفى ولا نتيجةً تُعرض: هو خبرٌ عن حدود ما يستطيع المحرك أن يقطع به،
 * موضعه سجلٌّ يقرؤه المطوّر لا شاشةٌ تُربك الشاعر.
 *
 * ولا يُطبَع هنا شيء: الطباعة سلوك مضيف لا سلوك محرك، وطبقةُ العرض هي
 * التي تختار أتكتبه في السجلّ أم ترسله إلى مكان آخر. فيبقى المحرك
 * صالحًا لتطبيق iOS كما هو صالح للمتصفح.
 */
function collectWarnings(written, disagreement, engine) {
  const out = [];
  const add = (area, message, detail) => out.push({ area, message, ...detail });

  for (const h of written) {
    const x = h.result;
    const where = h.label;

    if (x.relaxedSukun) {
      add('vocalization', `${where}: تشكيلٌ لا يقبل تقطيعًا، فأُرخيت ${x.relaxedSukun} من سكوناته`, {
        hemistich: h.role, count: x.relaxedSukun,
      });
    }
    if (x.assumedVocalization) {
      add('vocalization', `${where}: النصّ غير مشكول بالكامل، فالتقطيع قراءةٌ قبِلها الوزن لا قراءةٌ يقينية`, {
        hemistich: h.role,
      });
    }
    if (x.tied && x.tied.length) {
      add('ambiguity', `${where}: بحور توافق بالدرجة نفسها — ${x.tied.map((t) => t.name).join('، ')}`, {
        hemistich: h.role, tiedWith: x.tied,
      });
    }
    if (x.meter && x.meter.status === 'NEEDS_VALIDATION') {
      add('meter', `${where}: تعريف «${x.meter.name}» يحتاج تحقّقًا`, {
        hemistich: h.role, meterId: x.meter.id,
      });
    }
    if (x.rhyme && x.rhyme.rawi && x.rhyme.rawi.caution) {
      add('rhyme', `${where}: قد تكون «${x.rhyme.rawi.letter}» حرف وصل لا رويًّا`, {
        hemistich: h.role, letter: x.rhyme.rawi.letter,
      });
    }
  }

  if (disagreement) {
    add('meter', `الشطران على بحرين: ${disagreement.map((d) => `${d.label} ${d.name || '—'}`).join('، ')}`, {
      hemistichs: disagreement,
    });
  }

  // ما لم يُحسم في القاعدة نفسها — لا يتعلّق بهذا البيت بل بالبيانات.
  for (const q of engine.openQuestions()) {
    add('open_question', `${q.area}: ${q.issue || ''}`.trim(), { id: q.id, gaps: q.gaps });
  }

  return out;
}

/* ─────────────── بطاقات التفعيلات ─────────────── */

/** تعريف الصورة من البيانات — لا نصّ منها مكتوب في الكود. */
function licenceOf(engine, variantId, baseName, resultName, variantName, tafilaId) {
  const def = engine.data.variations.definitions?.[variantId];
  if (!def) return null;
  // بعض الصور لها اسمان: تفعيلةٌ معروفة تُنقل إليها وهي المعتمدة،
  // وصورةٌ نتجت عن التغيير مباشرةً وهي أدلّ عليه. «مستفعلن» مخبونةً
  // تُنقل إلى «مفاعلن» وأصلها «متفعلن»، ومقطوعةً إلى «مفعولن» وأصلها
  // «مستفعلْ». والصورتان واحدة وزنًا دائمًا — اختبارٌ يشترط ذلك.
  const raw = (engine.data.variations.variations[tafilaId] || [])
    .find((v) => v.id === variantId);

  // الاسمان المجرَّدان قد يتطابقان والصورتان مختلفتان: «فَعِلُنْ»
  // و«فَعْلُنْ» كلتاهما «فعلن» مجرّدةً، فيخرج السطر «فعلن : فعلن» ولا
  // يفيد قارئه شيئًا. فإذا تطابقا عُرضتا مشكولتين — وهو موضع الفرق.
  const base = engine.registry.tafilaById.get(tafilaId);
  const sameBare = baseName === resultName;
  const from = sameBare && base ? base.vocalized : baseName;
  const to = sameBare && raw && raw.result ? raw.result : resultName;

  return {
    id: variantId,
    name: variantName,
    category: def.category,
    definition: def.definition,
    from,
    to,
    // «فاعل» و«فعلن» قراءة واحدة (/0/0)، فذكر الأصل معهما تكرار لا
    // بيان. ولا يُذكر الأصل إلا إذا خالف المعتمدة رسمًا.
    beforeTransfer:
      raw && raw.beforeTransfer && plainName(raw.beforeTransfer) !== plainName(raw.result)
        ? plainName(raw.beforeTransfer)
        : null,
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

function card(engine, { name, syllables, state, kind, variation, letters, broken, dim, licence }) {
  const group = letters || [];
  return {
    name,
    // الرمز العروضي يُشتقّ من المقاطع بالترميز نفسه الذي يستعمله المحرك،
    // لا بجدول مكتوب في الواجهة.
    symbol: engine.encoder.encode(syllables, 'arudi_slash_zero').value,
    text: group.map((l) => l.ch).join(''),
    // الحروف مفصَّلة: منها تعرف طبقةُ العرض ما زِيد للإشباع مما كتبه
    // الشاعر — والنصّ وحده لا يميّزهما.
    textParts: group.map((l) => ({ ch: l.ch, added: !!l.added })),
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
  const texts = groupLettersByFeet(
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
        : licenceOf(engine, f.variationId, f.tafila, plainName(f.realized), f.variation, f.tafilaId),
      letters: texts[i] || [],
      broken,
    });
  });
}

function cardsFromPartial(best, engine, letters) {
  if (!best) return [];
  const counts = best.feet.map((f) => f.actual.length);
  if (best.partialFoot) counts.push(best.partialFoot.actual.length);
  const texts = groupLettersByFeet(letters, counts);
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
        : licenceOf(engine, f.variant.id, f.tafila, plainName(f.variant.result), f.variant.name, f.tafilaId),
      letters: texts[i++] || [],
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
      letters: texts[i++] || [],
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
