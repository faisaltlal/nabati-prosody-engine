/**
 * Scoring Engine — معادلة الدرجة، معزولة عمدًا.
 *
 * لا يوجد في هذا الملف رقم مكتوب: كل المعاملات تأتي من data/scoring.json.
 * تعديل الترتيب يتم بتحرير ذلك الملف وحده، دون إعادة بناء المحرك.
 *
 * المعادلة كاملةً في docs/SCORING.md. ملخّصها:
 *
 *   التكلفة = Σ (كلفة صورة التفعيلة + كلفة محاذاة مقاطعها) × معامل الموضع
 *           + كلفة المقاطع الفائضة + كلفة التفعيلات الخاوية
 *
 *   الدرجة = 1 − التكلفة ÷ (عدد مقاطع البحر × كلفة المقطع الواحد)
 *
 * الدرجة حتمية: النصّ نفسه والبيانات نفسها تعطيان الرقم نفسه دائمًا.
 */

export function createScorer(config) {
  const w = config.weights;

  /** كلفة وضع مقطع مكان مقطع. */
  function substitutionCost(actual, expected) {
    if (actual === expected) return 0;
    // الطويل والمفرط في آخر الشطر فرق تدوين أكثر منه فرق سمع.
    const pair = [actual, expected].sort().join('');
    if (pair === 'LX') return w.overlongMismatch;
    return w.substitution;
  }

  /** كلفة استعمال صورة مزاحَفة أو معلولة بدل السالمة. */
  function variationCost(variant, { isArudDarb }) {
    const base = w.variationKind[variant.kind] ?? w.variationKind.zihaf;
    const sev = w.severityMultiplier[String(variant.severity ?? 1)] ?? 1;
    let cost = base * sev;
    // العلة لا تقع إلا في العروض والضرب؛ وقوعها في الحشو مخالفة تُحاسَب.
    if (variant.scope === 'arud_darb' && !isArudDarb) cost += w.scopeViolation;
    return cost;
  }

  /**
   * وكم من تلك الكلفة **مأذونٌ فيه شعرًا**؟
   *
   * الزحاف رخصة، والعلة في العروض والضرب أصلٌ من أصول البحر — فالبيت
   * الذي جاء عليهما موزونٌ تامّ الوزن، لا بيتٌ فيه عيب. وإنما تُحسب
   * لهما كلفةٌ صغيرة **للترجيح**: لتتقدّم القراءة السالمة على
   * المزاحَفة عند تساوي كل شيء آخر. فالكلفتان مفترقتان في المعنى،
   * ولا يجوز أن تُخلطا في رقم واحد يُعرض على الشاعر.
   *
   * وما وقع في غير موضعه ليس مأذونًا فيه: علّةٌ في الحشو مخالفة
   * تُحاسَب كاملةً — أصلُها وزيادتُها معًا.
   */
  function variationLicence(variant, { isFirst, isArudDarb }) {
    if (variant.scope === 'arud_darb' && !isArudDarb) return 0;
    // ولا إذن في حشو الشطر أصلًا: النبطي يأذن بالرخص في التفعيلة
    // الأولى وفي العروض والضرب، وما وقع بينهما شبهةُ كسر لا رخصة.
    if (!isFirst && !isArudDarb) return 0;
    const base = w.variationKind[variant.kind] ?? w.variationKind.zihaf;
    const sev = w.severityMultiplier[String(variant.severity ?? 1)] ?? 1;
    return base * sev;
  }

  /** هل هذه صورةٌ وقعت في حشو الشطر؟ */
  function isHashwVariation(variant, { isFirst, isArudDarb }) {
    return variant.kind !== 'salim' && !isFirst && !isArudDarb;
  }

  /**
   * كلفة الصورة في الحشو — حصّةٌ من البيت لا رقمٌ مطلق.
   *
   * المطلق يختلف أثره باختلاف طول البحر: خُمس البيت ينزل بالدرجة إلى
   * ما دون ٨٠٪ في الطويل والقصير سواءً، وينزل مرّتين إن تكرّر.
   */
  function hashwPenalty(normalizer) {
    return (w.hashwVariationShare || 0) * normalizer;
  }

  /** المقام: عدد مقاطع البحر (بحدٍّ أدنى) × كلفة المقطع الواحد. */
  function normalizerFor(meterSyllableCount) {
    return Math.max(meterSyllableCount, config.normalizer.floor)
      * config.normalizer.perSyllableCost;
  }

  function positionMultiplier({ isFirst, isArudDarb }) {
    if (isArudDarb) return w.position.arudDarb;
    if (isFirst) return w.position.first;
    return w.position.hashw;
  }

  const weights = {
    substitution: w.substitution,
    insertion: w.insertion,
    deletion: w.deletion,
    overlongMismatch: w.overlongMismatch,
    unconsumedSyllable: w.unconsumedSyllable,
    unfilledFoot: w.unfilledFoot,
    inconsistentWordReading: w.inconsistentWordReading ?? 0,
    writtenMaddIgnored: w.writtenMaddIgnored ?? 0,
    assumedIshbaa: w.assumedIshbaa ?? 0,
  };

  /**
   * يحوّل التكلفة الخام إلى درجتين لا درجة واحدة.
   *
   *   `score`     — ما يُعرض على الشاعر: هل في بيته عيب؟ فلا تدخل فيه
   *                 الرخصُ المأذون فيها — زحافًا كانت أو علّةً في
   *                 موضعها — ولا افتراضاتُ المحرك في القراءة. البيت
   *                 الذي جاء على رخصةٍ مشروعة موزونٌ تامّ.
   *   `rankScore` — ما يُرتَّب به: تدخل فيه الرخص كلها، فتتقدّم
   *                 القراءة السالمة على المزاحَفة عند تساوي كل شيء
   *                 آخر. وهذا هو موضع الفرق الصغير بينهما.
   *
   * وخلطهما في رقم واحد كان يُنزل بيتًا سليمًا إلى ٩٨٪ لأن في ضربه
   * حذفًا — والحذف من البحر لا عليه.
   */
  function finalize(
    totalCost,
    meterSyllableCount,
    { assumedVocalization, licensedCost, hashwVariations = 0 } = {}
  ) {
    const normalizer = normalizerFor(meterSyllableCount);
    const clamp = (x) => Math.max(0, Math.min(1, x));
    // الصورة في حشو الشطر تدخل الدرجة المعروضة ولا تدخل الترتيب: هي
    // حكمٌ على البيت لا على قربه من البحر. ولو دخلت الترتيب لصار زحافٌ
    // واحد في الحشو أغلى من كسرين، فتُختار للبيت قراءةٌ ركيكة على بحرٍ
    // بعيد بدل أن يُقال لصاحبه: بحرُك هذا، وفي حشوه شبهة.
    const defects = Math.max(0, totalCost - (licensedCost || 0))
      + hashwVariations * hashwPenalty(normalizer);

    const score = clamp(1 - defects / normalizer);
    const rankScore = clamp(1 - totalCost / normalizer);

    let confidence = score;
    if (assumedVocalization) {
      confidence *= 1 - config.uncertainty.assumedVocalizationPenalty;
    }
    return {
      score: round(score),
      rankScore: round(rankScore),
      confidence: round(confidence),
      cost: round(defects),
      licensedCost: round(licensedCost || 0),
      normalizer: round(normalizer),
    };
  }

  /**
   * الحالات A/B/C/D من البند 15 من المواصفة.
   *
   * الدرجة وحدها لا تكفي: بيت اختلّت كل تفعيلاته بمقطع واحد لكلٍّ منها
   * ينال درجة متوسطة، فيُقال عنه «قريب من البحر» وهو ليس كذلك — القرب
   * من وزن معناه أن أكثره صحيح. لذلك نسبة التفعيلات المختلّة تردّ الحكم
   * وإن لم تردّه الدرجة.
   */
  function classify(score, { brokenFeet = 0, totalFeet = 0, hashwVariations = 0 } = {}) {
    const t = config.thresholds;
    if (totalFeet > 0 && brokenFeet / totalFeet > t.maxBrokenFootRatio) {
      return 'unrecognized';
    }
    // تفعيلة لم توافق أي صورة مأذون فيها هي كسر بالتعريف، مهما ارتفعت
    // الدرجة. الزحاف والعلة لا يقعان هنا: كلفتهما في variationCost لا في
    // كلفة المحاذاة، فالبيت المزاحَف يبقى «موزونًا برخصة» لا مكسورًا.
    const byScore =
      score >= t.sound ? 'sound'
      : score >= t.acceptable ? 'acceptable'
      : score >= t.broken ? 'broken'
      : 'unrecognized';
    if (brokenFeet > 0 && (byScore === 'sound' || byScore === 'acceptable')) {
      return 'broken';
    }
    // زحافٌ أو علّة في حشو الشطر: النبطي لا يأذن بهما إلا في التفعيلة
    // الأولى وفي العروض والضرب. فالبيت **مشتبه** — لا هو موزون ولا
    // يُقطَع بكسره، وإنما شبهةٌ تُعلَن لصاحبه لينظر فيها. وإن اجتمع
    // معها كسرٌ في تفعيلة فالحكم للكسر، فهو أبين.
    if (hashwVariations > 0 && brokenFeet === 0) return 'suspect';
    return byScore;
  }

  return {
    substitutionCost,
    variationCost,
    variationLicence,
    isHashwVariation,
    hashwPenalty,
    normalizerFor,
    positionMultiplier,
    finalize,
    classify,
    weights,
    thresholds: config.thresholds,
    ranking: config.ranking,
    brokenFootThreshold: config.brokenFoot.minCostToReport,
    config,
  };
}

function round(x) {
  return Math.round(x * 1e6) / 1e6;
}
