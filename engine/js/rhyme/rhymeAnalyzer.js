/**
 * تحليل القافية.
 *
 * لا قاعدة واحدة مكتوبة في هذا الملف: الحدود والأنواع وحروف الردف
 * والتأسيس كلها تُقرأ من `data/rhyme.json`، وهذا الملف يُجري الحساب
 * وحده. تعديل قاعدة قافية تعديلُ ذلك الملف لا هذا.
 *
 * يعمل على **المقاطع التي اختارها الوزن** لا على الرسم، لأن القافية
 * حكم صوتي: الحرف المشدَّد وحدتان، والتنوين نون ساكنة، واللام الشمسية
 * لا تُنطق، وحركة آخر الشطر تُشبَع فتصير مدًّا. كل ذلك محسوم في طبقة
 * المقاطع قبل أن تصل إلى هنا، فلا يُعاد هنا ولا يُخالَف.
 *
 * وما لا يُحسم من شطر واحد يبقى مُعلنًا: الرويّ إنما يثبت بالتزام
 * الشاعر إياه في كل بيت، والشطر الواحد يُرجَّح فيه ولا يُقطَع.
 */

/** حرف المدّ المقابل لكل حركة. */
const MADD = { a: 'ا', i: 'ي', u: 'و' };

const TEH_MARBUTA = 'ة';

/**
 * يفرد المقاطع حروفًا متحركة وساكنة.
 *
 * الاشتقاق من صورة المقطع لا من نواته: المقطع المُشبَع آخر الشطر يبقى
 * مرسومًا CV وحركته قصيرة، ومع ذلك يتولّد عنه مدٌّ ساكن هو الذي تُقفَل
 * به القافية. والاعتماد على النواة وحدها يُسقطه فتختلّ الحدود والنوع.
 *
 * وهو الاشتقاق نفسه الذي يعتمده الترميز الحرفي (متحرك واحد للقصير،
 * ومتحرك فساكن للطويل، ومتحرك فساكنين للمفرط)، فلا يفترقان.
 */
function lettersOf(syllables, units) {
  const out = [];
  const unitAt = (i) => (units && i !== undefined ? units[i] : undefined);

  syllables.forEach((s, si) => {
    const consumed = s.units || [];
    const shape = s.shape || (s.weight === 'S' ? 'CV' : s.weight === 'X' ? 'CVVC' : 'CVC');
    const hasMadd = shape === 'CVV' || shape === 'CVVC' || (!!s.ishbaa && !s.coda);
    const hasCoda = !!s.coda && (shape === 'CVC' || shape === 'CVVC');

    out.push({
      ch: s.onset, moving: true, syllable: si, role: 'onset',
      assumed: !!s.assumed, unit: unitAt(consumed[0]),
    });
    if (hasMadd) {
      out.push({
        ch: MADD[s.quality] || 'ا', moving: false, syllable: si, role: 'madd',
        quality: s.quality, ishbaa: !!s.ishbaa, assumed: !!s.assumed,
      });
    }
    if (hasCoda) {
      out.push({
        ch: s.coda, moving: false, syllable: si, role: 'coda',
        assumed: !!s.assumed, unit: unitAt(consumed[1]),
      });
    }
  });
  return out;
}

/**
 * يستبعد حرف الوصل من آخر الشطر ليظهر الرويّ تحته.
 *
 * الحالة الوحيدة التي يُقطَع فيها بالاستبعاد: هاء الوقف المنقلبة عن
 * تاء مربوطة. وهذا استنتاج من عمل المحرك نفسه لا تخمين — هو الذي قلب
 * التاء هاءً حين وقف، والوحدة محتفظة برسمها الأصلي. فرويّ «سهيرة»
 * الراءُ لا الهاء.
 *
 * أمّا الهاء المرسومة هاءً والألف والواو والياء فلا يُقطَع فيها: قد
 * تكون أصلًا في بنية الكلمة («وجه»، «دعا»)، وتمييز الأصلي من الزائد
 * صرفٌ لا يملكه المحرك. فتُنبَّه في `caution` ولا تُستبعد — والبند 26
 * يمنع أن يُخترع لها حكم.
 */
function stripWasl(letters) {
  if (!letters.length) return { letters, wasl: null };
  const last = letters[letters.length - 1];

  // الهاء ساكنةً في آخر الشطر: حرف واحد يُستبعد.
  if (last.role === 'coda' && last.unit && last.unit.letter === TEH_MARBUTA) {
    return {
      letters: letters.slice(0, -1),
      wasl: { letter: last.ch, from: TEH_MARBUTA, reason: 'هاء الوقف عن تاء مربوطة' },
    };
  }

  // الهاء متحركةً مُشبَعة: تُستبعد هي ومدُّ إشباعها معًا، فهما مقطع واحد.
  const onset = letters.findLast
    ? letters.findLast((l) => l.role === 'onset')
    : [...letters].reverse().find((l) => l.role === 'onset');
  if (onset && onset.unit && onset.unit.letter === TEH_MARBUTA) {
    const kept = letters.filter((l) => l.syllable !== onset.syllable);
    if (kept.length) {
      return {
        letters: kept,
        wasl: { letter: onset.ch, from: TEH_MARBUTA, reason: 'هاء الوقف عن تاء مربوطة' },
      };
    }
  }

  return { letters, wasl: null };
}

/**
 * @param {object[]} syllables مقاطع الشطر كما اختارها الوزن
 * @param {object} rules data/rhyme.json
 * @param {object[]} [units] الوحدات الصوتية — منها يُعرف رسم الحرف الأصلي
 */
export function analyzeRhyme(syllables, rules, units) {
  if (!syllables || syllables.length === 0) return null;
  const all = lettersOf(syllables, units);
  if (!all.length) return null;

  const { letters, wasl } = stripWasl(all);
  if (!letters.length) return null;
  const assumed = all.some((l) => l.assumed);

  // ── الرويّ والإطلاق ────────────────────────────────────────────────
  const lastLetter = letters[letters.length - 1];
  let rawiIndex;
  let release;
  if (lastLetter.role === 'coda') {
    // مختوم بساكن صحيح: هو الرويّ، والقافية مقيَّدة.
    rawiIndex = letters.length - 1;
    release = rules.release.muqayyada;
  } else if (lastLetter.role === 'madd') {
    // مدٌّ في الآخر — إشباعًا كان أو أصليًّا — فالرويّ ما قبله متحركًا.
    rawiIndex = letters.length - 2;
    release = rules.release.mutlaqa;
  } else {
    // متحرك في الآخر بلا إشباع: يقع في بعض الأضرب المصدرية.
    rawiIndex = letters.length - 1;
    release = rules.release.mutlaqa;
  }
  // استُبعد وصلٌ فانكشف تحته متحرك: القافية مطلقة موصولة.
  if (wasl) release = rules.release.mutlaqa;

  const rawi = letters[rawiIndex] || lastLetter;

  const excluded = rules.rawi.excludedWhenFinal;
  const caution =
    !wasl && rawi && !rawi.moving && excluded.letters.includes(rawi.ch)
      ? excluded.condition
      : null;

  // ── الردف ─────────────────────────────────────────────────────────
  // مدٌّ ساكن ملاصق للرويّ من قبله، بلا فاصل.
  const before = letters[rawiIndex - 1];
  const ridf =
    before && before.role === 'madd' && rules.ridf.maddLetters.includes(before.ch)
      ? { letter: before.ch, quality: before.quality }
      : null;

  // ── التأسيس ───────────────────────────────────────────────────────
  // ألف بينها وبين الرويّ حرف واحد متحرك هو الدخيل.
  const twoBefore = letters[rawiIndex - 2];
  const tasees =
    !ridf && before && before.moving &&
    twoBefore && twoBefore.role === 'madd' && twoBefore.ch === rules.tasees.letter
      ? { letter: twoBefore.ch, dakheel: before.ch }
      : null;

  // ── الحدود والنوع ─────────────────────────────────────────────────
  // من آخر ساكن إلى أول ساكن يسبقه، مع المتحرك الذي قبل ذلك الساكن.
  const s2 = lastIndexWhere(letters, (l) => !l.moving);
  const s1 = s2 > 0 ? lastIndexWhere(letters, (l) => !l.moving, s2 - 1) : -1;

  let type = null;
  let movingBetween = null;
  let start = 0;
  if (s2 >= 0 && s1 >= 0) {
    movingBetween = letters.slice(s1 + 1, s2).filter((l) => l.moving).length;
    const found = rules.types.byMovingCount.find((t) => t.count === movingBetween);
    type = found || { ...rules.types.beyondMax, count: movingBetween };
    start = s1 > 0 && letters[s1 - 1].moving ? s1 - 1 : s1;
  }

  const span = letters.slice(start);

  return {
    text: span.map((l) => l.ch).join('') + (wasl ? wasl.letter : ''),
    letters: span.map((l) => ({ ch: l.ch, moving: l.moving, role: l.role })),
    rawi: {
      letter: rawi.ch,
      moving: rawi.moving,
      // الرويّ لا يُقطع به من شطر واحد — التزام الشاعر هو الذي يثبته.
      certain: false,
      caution,
      limitation: rules.rawi.limitation,
    },
    ridf,
    tasees,
    // حرف الوصل إن وُجد — يُعرَض ولا يُحسب من حدّ القافية.
    wasl,
    release: { id: release.id, name: release.name, definition: release.definition },
    type: type
      ? { id: type.id, name: type.name, definition: type.definition || type.note, movingBetween }
      : null,
    bounds: {
      rule: rules.bounds.rule,
      fromLetter: start,
      letterCount: span.length,
      silentPair: s1 >= 0 && s2 >= 0 ? [letters[s1].ch, letters[s2].ch] : null,
    },
    // القافية محسوبة على قراءةٍ افترض المحرك تشكيلها، فتُعلَن لا تُخفى.
    assumedVocalization: assumed,
    // ما يخصّ النبطي وحده غير منفَّذ — البند 26.
    openQuestion: rules.nabatiSpecific.status === 'NEEDS_VALIDATION'
      ? { note: rules.nabatiSpecific.note, gaps: rules.nabatiSpecific.knownGaps }
      : null,
  };
}

function lastIndexWhere(arr, pred, from = arr.length - 1) {
  for (let i = from; i >= 0; i--) if (pred(arr[i])) return i;
  return -1;
}
