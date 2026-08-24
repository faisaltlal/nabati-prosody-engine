/**
 * الكتابة اللحظية والقافية.
 *
 * الاختبارات هنا مشتقّة من البيانات حيثما أمكن: ما يمرّ على تفعيلة
 * واحدة يمرّ على العشرين، وما يمرّ على بحر يمرّ على الثلاثة والثلاثين.
 */

import { describe, it, assert, equal, atLeast } from './harness.js';
import { createEngine } from '../engine/js/index.js';
import { DATA } from '../engine/js/data.generated.js';
import { partialTafilaName, lettersFromSyllables } from '../engine/js/meters/registry.js';
import { normalize } from '../engine/js/text/normalizer.js';
import { phonemize, relaxWrittenSukun } from '../engine/js/phonology/phonemizer.js';
import { buildSyllableDag, enumeratePaths } from '../engine/js/prosody/syllableDag.js';
import { rankMeters } from '../engine/js/matching/meterMatcher.js';
import { rankMetersPartial } from '../engine/js/matching/partialMatcher.js';
import { createAlignmentCache } from '../engine/js/matching/footMatcher.js';
import { inconsistentWordReadings } from '../engine/js/matching/wordConsistency.js';
import { prosodicLetters, NEUTRAL_MADD } from '../engine/js/prosody/prosodicLetters.js';

const engine = createEngine(DATA);

/* ═════════════════ الاسم الجزئي ═════════════════ */

describe('التفعيلة الجزئية — الاسم المقتطع', () => {
  it('اسم كل تفعيلة يُقتطع بعدد حروف مقاطعها لا بالتخمين', () => {
    // الحرص هنا على الاشتقاق لا على النتيجة: عدد حروف المقطع يأتي من
    // lettersFromSyllables، وهي نفسها التي يتحقّق اختبارٌ آخر من
    // تطابقها مع khalilLetters المصرَّح به. فلو انحرف الاشتقاق ظهر هنا.
    for (const t of DATA.tafaeel.tafaeel) {
      for (let k = 0; k <= t.syllables.length; k++) {
        const name = partialTafilaName(t.vocalized, t.syllables, k);
        const expected = lettersFromSyllables(t.syllables.slice(0, k)).length;
        equal([...name].length, Math.min(expected, [...t.plain].length),
          `${t.plain} عند ${k} مقاطع`);
        assert(t.plain.startsWith(name), `«${name}» ليست بادئة «${t.plain}»`);
      }
    }
  });

  it('التفعيلة التامّة تعطي اسمها كاملًا', () => {
    for (const t of DATA.tafaeel.tafaeel) {
      equal(partialTafilaName(t.vocalized, t.syllables, t.syllables.length), t.plain, t.plain);
    }
  });
});

/* ═════════════════ التوليد أثناء الكتابة ═════════════════ */

describe('الكتابة اللحظية', () => {
  it('يعطي نتيجة عند كل حرف من أول حرف', () => {
    // لا زرّ في الواجهة، فكل حالة وسيطة يجب أن تُنتج شيئًا نافعًا.
    // الانهيار أو الفراغ عند حرف واحد يجعل الواجهة تومض وهي تُكتَب.
    const text = 'البارحه ما نمت من كثر شوقي';
    let seen = 0;
    for (let i = 1; i <= text.length; i++) {
      const r = engine.analyzeHemistich(text.slice(0, i));
      if (!r) continue; // مسافة أو فراغ
      seen++;
      assert(Array.isArray(r.cards), `لا بطاقات عند ${i} حرفًا`);
      assert(r.meter, `لا بحر عند ${i} حرفًا: «${text.slice(0, i)}»`);
    }
    atLeast(seen, text.length - 6, 'أغلب الحالات الوسيطة يجب أن تُنتج نتيجة');
  });

  it('التفعيلة تطول باطّراد كلما طال المكتوب', () => {
    // «البا» ← مستف، و«البارحه» ← مستفعلن. المطلوب أن يكون اسم
    // التفعيلة الجارية بادئةً تنمو، لا أن يقفز أو ينكمش بلا سبب.
    const steps = ['الب', 'البا', 'البار', 'البارح', 'البارحه'];
    const names = steps.map((s) => {
      const r = engine.analyzeHemistich(s);
      const live = r.cards.filter((c) => c.kind !== 'pending');
      return live.map((c) => c.name).join('');
    });
    for (let i = 1; i < names.length; i++) {
      atLeast([...names[i]].length, [...names[i - 1]].length,
        `«${steps[i]}» أعطى ${names[i]} بعد ${names[i - 1]}`);
    }
    equal(names[names.length - 1], 'مستفعلن', 'البارحه ← مستفعلن');
  });

  it('كل صيغة من كل بحر تُبنى تفعيلةً تفعيلةً حتى تتمّ', () => {
    // مشتقّ من البيانات: يمرّ على البحور الثلاثة والثلاثين بصيغها كلها.
    // يكتب نصّ الصيغة مشكولًا ثم يقتطعه عند كل تفعيلة، ويشترط أن يبقى
    // البحر ممكنًا وأن يتقدّم عدد التفعيلات المكتملة.
    for (const meter of engine.registry.enabled) {
      for (const form of meter.forms) {
        const words = form.feet.map((f) => f.vocalized);
        let previous = -1;
        for (let n = 1; n <= words.length; n++) {
          const r = engine.analyzeHemistich(words.slice(0, n).join(' '));
          assert(r, `${meter.name} عند ${n} تفعيلة: لا نتيجة`);
          const done = r.cards.filter((c) => c.kind === 'salim' || c.kind === 'licensed').length;
          atLeast(done, previous, `${meter.name} (${form.role}) تراجع عدد تفعيلاته`);
          previous = done;
        }
      }
    }
  });

  it('الشطر التامّ لا يُعرض «قيد الكتابة»', () => {
    for (const meter of engine.registry.enabled) {
      for (const form of meter.forms) {
        const text = form.feet.map((f) => f.vocalized).join(' ');
        const r = engine.analyzeHemistich(text);
        assert(r.complete, `${meter.name} (${form.role}) تامّ وعُرض قيد الكتابة`);
        assert(!r.cards.some((c) => c.kind === 'pending'),
          `${meter.name} تامّ وفيه تفعيلة «لم تُكتب»`);
      }
    }
  });

  it('الشطر المكسور يُعرض مكسورًا لا ناقصًا', () => {
    // هذا هو الفرق الذي يسهل أن يضيع: المطابق التامّ يرى المكسور
    // «ناقصًا»، فلولا شرط البادئة النظيفة لقيل لصاحبه «أكمِل» وقد أتمّ.
    const r = engine.analyzeHemistich('مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ فَعُولُنْ');
    equal(r.source, 'full', 'المكسور يُحكم عليه حكم الشطر التامّ');
    equal(r.meter.verdict, 'broken');
    assert(r.cards.some((c) => c.kind === 'broken'), 'موضع الكسر يجب أن يظهر في بطاقة');
  });

  it('البادئة النظيفة تُعرض قيد الكتابة', () => {
    // كلمة لم تتمّ بعد — وهذا هو الحال الغالب أثناء الكتابة.
    for (const t of [
      'البارحه ما',
      'الب',
      'مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ مُسْتَ',
      'مَفَاعِيلُنْ مَفَاعِيلُنْ مَفَا',
    ]) {
      const r = engine.analyzeHemistich(t);
      equal(r.source, 'partial', `«${t}»`);
      assert(r.writing, `«${t}» بادئة نظيفة ولم تُعرض قيد الكتابة`);
    }
  });

  it('ما وافق وزنًا تامًّا يُعرض تامًّا وإن بدا بادئةً', () => {
    // «مستفعلن مستفعلن» بادئة الرجز، وهي في الوقت نفسه الرجز المجزوء
    // كاملًا. فالصواب أن تُعرض بحرًا تامًّا — ومَن أراد الرجز يُتمّه
    // فينتقل الحكم معه.
    //
    // وكذلك «… فاعِ» بعد مستفعلَين: تقع على ضرب الرجز فتوافقه بـ٩٩٪،
    // فليست بادئةً لم تتمّ بل شطرًا تامًّا. والمحرك لا يخمّن نيّة
    // الكاتب، وإنما يحكم بما وافقه المكتوب.
    for (const t of ['مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ', 'مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ فَاعِ']) {
      const r = engine.analyzeHemistich(t);
      equal(r.source, 'full', `«${t}»`);
      assert(r.complete, `«${t}» وزن تامّ في القاعدة`);
    }
  });
});

/* ═════════════════ الحقلان ═════════════════ */

describe('حقلا الصدر والعجز', () => {
  const SADR = 'مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ فَاعِلَاتُنْ';
  const AJZ = 'مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ فَاعِلَاتَانْ';

  it('يحلّل الحقلين معًا فيتّفقان على البحر', () => {
    const r = engine.analyzeLive({ sadr: SADR, ajz: AJZ });
    assert(!r.empty);
    equal(r.meter.name, 'المسحوب');
    equal(r.agreed, true, 'الشطران على بحر واحد');
    equal(r.hemistichs[0].result.meter.formRole, 'sadr');
    equal(r.hemistichs[1].result.meter.formRole, 'ajz');
  });

  it('الحقل الفارغ لا يُعطّل شيئًا', () => {
    for (const fields of [{ sadr: SADR, ajz: '' }, { sadr: '', ajz: AJZ }, { sadr: SADR }]) {
      const r = engine.analyzeLive(fields);
      assert(!r.empty, 'حقل واحد مكتوب يكفي');
      assert(r.meter, 'يجب أن يُعطي بحرًا');
      equal(r.hemistichs.filter((h) => h.result).length, 1, 'شطر واحد فقط يُحلَّل');
    }
  });

  it('الحقلان فارغان: لا نتيجة ولا انهيار', () => {
    for (const fields of [{}, { sadr: '', ajz: '' }, { sadr: '   ' }]) {
      equal(engine.analyzeLive(fields).empty, true);
    }
  });

  it('اختلاف الشطرين يُعلَن لا يُطوى', () => {
    const r = engine.analyzeLive({ sadr: SADR, ajz: 'فَعُولُنْ مَفَاعِيلُنْ فَعُولُنْ مَفَاعِيلُنْ' });
    equal(r.agreed, false);
    assert(r.disagreement, 'يجب بيان بحر كل شطر');
    equal(r.disagreement.length, 2);
  });
});

/* ═════════════════ الرمز العروضي ═════════════════ */

describe('الرمز العروضي على البطاقات', () => {
  it('كل بطاقة تحمل رمزًا من / و 0 فقط', () => {
    const r = engine.analyzeLive({
      sadr: 'مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ فَاعِلَاتُنْ',
      ajz: 'مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ فَاعِلَاتَانْ',
    });
    for (const h of r.hemistichs) {
      if (!h.result) continue;
      for (const c of h.result.cards) {
        assert(/^[/0]*$/.test(c.symbol), `رمز غير صالح: «${c.symbol}» في ${c.name}`);
      }
    }
  });

  it('الرمز مشتقّ من الترميز الحرفي نفسه لا من جدول في الواجهة', () => {
    // مستفعلن = متحرك ساكن متحرك ساكن متحرك متحرك ساكن.
    equal(engine.encoder.encode(['L', 'L', 'S', 'L'], 'arudi_slash_zero').value, '/0/0//0');
    equal(engine.encoder.encode(['L', 'S', 'L', 'L'], 'arudi_slash_zero').value, '/0//0/0');
    // وهو الترميز الخليلي نفسه بعلامتين أخريين — فلا يجوز أن يفترقا.
    for (const t of DATA.tafaeel.tafaeel) {
      const slash = engine.encoder.encode(t.syllables, 'arudi_slash_zero').value;
      const khalil = engine.encoder.encode(t.syllables, 'khalil_arudi').value;
      equal(slash.replace(/\//g, '1'), khalil, t.plain);
    }
  });
});

/* ═════════════════ القافية ═════════════════ */

describe('القافية', () => {
  const rhymeOf = (t) => engine.analyzeHemistich(t).rhyme;

  it('حدود القافية ونوعها كما في كتب العروض', () => {
    // مطلع معلّقة امرئ القيس: قافيته «مَنْزِلِي»، ورويّها اللام،
    // ونوعها المتدارك — متحركان بين ساكنَيها.
    const q = rhymeOf('قِفَا نَبْكِ مِنْ ذِكْرَى حَبِيبٍ وَمَنْزِلِ');
    equal(q.rawi.letter, 'ل');
    equal(q.type.id, 'mutadarik');
    equal(q.type.movingBetween, 2);
    equal(q.release.id, 'mutlaqa');
    equal(q.text, 'منزلي');
  });

  it('الرويّ الساكن يُقيّد القافية والمتحرك يُطلقها', () => {
    equal(rhymeOf('يَا صَاحِبِي قُمْ نَاتِ بِالْهُمُومْ').release.id, 'muqayyada');
    equal(rhymeOf('وَاللَّهِ يَا خِلِّي عَلَيْكَ سَلَامُ').release.id, 'mutlaqa');
  });

  it('الردف مدٌّ ملاصق للرويّ، والتأسيس ألفٌ بينهما دخيل', () => {
    const mardoof = rhymeOf('يَا صَاحِبِي قُمْ نَاتِ بِالْهُمُومْ');
    equal(mardoof.ridf.letter, 'و');
    equal(mardoof.tasees, null, 'لا تأسيس مع ردف');

    const muassas = rhymeOf('مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ فَاعِلَاتُنْ');
    equal(muassas.tasees.letter, 'ا');
    equal(muassas.tasees.dakheel, 'ت');
    equal(muassas.ridf, null, 'الألف هنا مفصولة عن الرويّ فليست ردفًا');
  });

  it('هاء الوقف عن تاء مربوطة وصلٌ لا رويّ', () => {
    // «سهيرة» رويّها الراء، والهاء وصل. وهذا يُستنتج من عمل المحرك
    // نفسه — هو الذي قلب التاء هاءً — لا من تخمين.
    const q = rhymeOf('وعيني على درب الحبايب سهيرة');
    equal(q.rawi.letter, 'ر');
    assert(q.wasl, 'يجب بيان حرف الوصل');
    equal(q.wasl.letter, 'ه');
  });

  it('الهاء المرسومة هاءً لا يُقطع فيها بل يُنبَّه', () => {
    // قد تكون أصلًا في بنية الكلمة، وتمييزها صرفٌ لا يملكه المحرك.
    // البند 26 يمنع اختراع حكم، فتبقى رويًّا مع تنبيه.
    const q = rhymeOf('يا صاحبي قم نات بالحكمه');
    equal(q.wasl, null, 'لا يُقطع باستبعادها');
    assert(q.rawi.caution, 'يجب التنبيه على احتمال كونها وصلًا');
  });

  it('كل نوع يُشتقّ من عدد المتحركات المصرَّح به في البيانات', () => {
    // لا اسم نوع مكتوب في الكود: الأسماء كلها من data/rhyme.json.
    for (const t of DATA.rhyme.types.byMovingCount) {
      assert(t.id && t.name && typeof t.count === 'number', `نوع ناقص: ${JSON.stringify(t)}`);
    }
    equal(DATA.rhyme.types.byMovingCount.length, 5, 'أنواع القافية خمسة');
  });

  it('يُعلن أن الرويّ لا يُقطع به من شطر واحد', () => {
    const q = rhymeOf('قِفَا نَبْكِ مِنْ ذِكْرَى حَبِيبٍ وَمَنْزِلِ');
    equal(q.rawi.certain, false);
    assert(q.rawi.limitation, 'يجب بيان حدّ ما يُعرف من شطر واحد');
    assert(q.openQuestion, 'ما يخصّ النبطي وحده يبقى معلنًا');
  });

  it('لا ينهار على نصّ قصير جدًّا', () => {
    for (const t of ['ا', 'في', 'يا', 'قم']) {
      const r = engine.analyzeHemistich(t);
      if (!r) continue;
      assert(r.rhyme === null || r.rhyme.rawi, `انهار عند «${t}»`);
    }
  });
});

/* ═════════════════ ذاكرة المحاذاة ═════════════════ */

describe('ذاكرة المحاذاة — تسريعٌ لا تغيير', () => {
  it('الترتيب بالذاكرة وبدونها واحد حرفًا بحرف', () => {
    // الذاكرة تُسقط أكثر من تسعة أعشار عمل المحاذاة، وهي أخطر ما في
    // التسريع: خطأ في المفتاح يُرجع جوابَ تفعيلةٍ مكان أخرى فتتغيّر
    // النتائج بلا أن يظهر عطب. فيُقارَن الترتيبان كاملين.
    for (const text of [
      'مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ فَاعِلَاتُنْ',
      'مُتَفْعِلُنْ مُسْتَفْعِلُنْ فَاعِلَاتُنْ',
      'مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ فَعُولُنْ',
      'البارحه ما نمت من كثر شوقي',
      'الب',
    ]) {
      const norm = normalize(text);
      const { units } = phonemize(norm.words, DATA.lexicon, { pausalEnd: true });
      const dag = buildSyllableDag(units);

      const brief = (list, score) => list.map((r) => `${r.meterId}:${score(r).toFixed(6)}`).join(',');

      equal(
        brief(rankMeters(dag, engine.registry, engine.scorer, { repeats: [1], cache: false }), (r) => r.score),
        brief(
          rankMeters(dag, engine.registry, engine.scorer, { repeats: [1], cache: createAlignmentCache() }),
          (r) => r.score
        ),
        `المطابق التامّ اختلف على «${text}»`
      );

      equal(
        brief(rankMetersPartial(dag, engine.registry, engine.scorer, { cache: false }), (r) => r.progressScore),
        brief(
          rankMetersPartial(dag, engine.registry, engine.scorer, { cache: createAlignmentCache() }),
          (r) => r.progressScore
        ),
        `المطابق الجزئي اختلف على «${text}»`
      );
    }
  });
});

/* ═════════════════ التشكيل الذي لا يُقرأ ═════════════════ */

describe('تشكيل لا يقبل تقطيعًا', () => {
  it('الساكنان المتتاليان لا يُخرجان الشاشة بيضاء', () => {
    // «ذكْرْتك» ساكنان متتاليان، والمقطع لا يبدأ بساكن، فلا مسار في
    // المخطّط أصلًا. وكان هذا يُرجع تحليلًا بلا بحر ولا مقاطع — أسوأ ما
    // يقع في واجهة تُحلّل عند كل ضغطة مفتاح.
    const r = engine.analyzeHemistich('ياما ذكْرْتك ولْقصايد مقابيل', { preferRole: 'ajz' });
    assert(r, 'لا نتيجة البتّة');
    assert(r.meter, 'لا بحر');
    atLeast(r.cards.length, 1, 'لا بطاقات');
    atLeast(r.relaxedSukun, 1, 'يجب الإفصاح عن السكونات التي أُرخيت');
  });

  it('لا يُرخي سكونًا إلا عند العجز عنه', () => {
    // النصّ المشكول السليم يُقرأ كما كُتب، فلا يُمسّ سكونه.
    for (const meter of engine.registry.enabled) {
      for (const form of meter.forms) {
        const r = engine.analyzeHemistich(form.feet.map((f) => f.vocalized).join(' '));
        equal(r.relaxedSukun, 0, `${meter.name} (${form.role}) أُرخي سكونه بلا موجب`);
      }
    }
  });

  it('لا يمسّ إلا سكون الكاتب، لا سكون البنية', () => {
    // السكون المتولّد عن الشدّة أو التنوين أو اللام الشمسية بنيةٌ في
    // الكلمة لا اختيارٌ في الرسم.
    const { units } = phonemize(normalize('الشَّمْسُ كِتَابًا').words, DATA.lexicon, { pausalEnd: true });
    const structural = units.filter((u) => u.source && u.vowel.known && u.vowel.length === 'none');
    atLeast(structural.length, 1, 'يجب أن يكون في النصّ سكون بنيويّ');
    const { units: after } = relaxWrittenSukun(units);
    for (const u of after) {
      if (u.source) assert(!u.relaxedSukun, `أُرخي سكون بنيويّ: ${u.c} (${u.source})`);
    }
  });
});

/* ═════════════════ التذييل والتسبيغ ═════════════════ */

describe('علل الزيادة — التذييل والتسبيغ', () => {
  it('اسم الزيادة مشتقّ من آخر التفعيلة لا مكتوب اجتهادًا', () => {
    // التذييل زيادة ساكن على ما آخره وتد مجموع (//0 = مقطعان S ثم L)،
    // والتسبيغ زيادة ساكن على سبب خفيف (/0 = مقطع L). الخلط بينهما كان
    // في البيانات: أربع تفعيلات وُسمت تذييلًا وهي تسبيغ.
    const byId = new Map(DATA.tafaeel.tafaeel.map((t) => [t.id, t]));
    for (const [tid, list] of Object.entries(DATA.variations.variations)) {
      const base = byId.get(tid);
      const watad = base.syllables.slice(-2).join('') === 'SL';
      for (const v of list) {
        if (v.id !== 'tadhyil' && v.id !== 'tasbeegh') continue;
        equal(v.id, watad ? 'tadhyil' : 'tasbeegh', `${base.plain} (${base.syllables.join('')})`);
        equal(v.name, watad ? 'التذييل' : 'التسبيغ', base.plain);
      }
    }
  });

  it('التفعيلة المزيدة المستقلّة تُعرض معلولة لا سالمة', () => {
    // «فاعلاتان» تفعيلة قائمة في هذه القاعدة، لكنها في العروض زيادةُ
    // ساكن على فاعلاتن. وإخفاء ذلك يجعل عجز البيت يبدو بلا علّة وهو معلول.
    const r = engine.analyzeHemistich('مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ فَاعِلَاتَانْ', { preferRole: 'ajz' });
    const last = r.cards[r.cards.length - 1];
    equal(last.name, 'فاعلاتان');
    assert(last.licence, 'يجب بيان العلّة');
    equal(last.licence.name, 'التسبيغ');
    equal(last.licence.from, 'فاعلاتن');
    equal(last.licence.to, 'فاعلاتان');
  });

  it('لكل صورة تعريف في البيانات لا في الكود', () => {
    const defs = DATA.variations.definitions;
    assert(defs, 'ملف الصور يجب أن يحمل التعريفات');
    const used = new Set();
    for (const list of Object.values(DATA.variations.variations)) {
      for (const v of list) used.add(v.id);
    }
    for (const id of used) {
      assert(defs[id], `صورة بلا تعريف: ${id}`);
      assert(defs[id].category && defs[id].definition, `تعريف ناقص: ${id}`);
    }
  });
});

/* ═════════════════ ترجيح الصيغة بالحقل ═════════════════ */

describe('الحقل يرجّح صيغته عند التساوي', () => {
  it('ما كُتب في حقل العجز تُرجَّح له صورة العجز', () => {
    // الشطر الواحد يقبل الصورتين بالدرجة نفسها كثيرًا، والوزن لا
    // يرجّح بينهما حينئذ — لكن الحقل المكتوب فيه يرجّح.
    const text = 'ياما ذكْرْتك ولْقصايد مقابيل';
    equal(engine.analyzeHemistich(text, { preferRole: 'ajz' }).meter.formRole, 'ajz');
  });

  it('الترجيح لا يتجاوز الوزن: الأعلى درجةً يفوز دائمًا', () => {
    // صدرٌ صريح لا يقبل صورة العجز، فلا يُقلَب إليها بحجّة الحقل.
    const sadrOnly = 'مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ فَاعِلَاتُنْ';
    equal(engine.analyzeHemistich(sadrOnly, { preferRole: 'ajz' }).meter.formRole, 'sadr');
  });
});

/* ═════════════════ الحروف والرموز تصطفّ ═════════════════ */

describe('اسم البطاقة', () => {
  it('الاسم هو الصورة المتحقّقة، وطولُه طولُ رمزه', () => {
    // الرمز مشتقٌّ من الصورة المتحقّقة، فلو كُتب فوقه اسمُ الأصل
    // لخالف الاسمُ رمزَه: «مفاعيلن» (سبعة أحرف) فوق `//0/0` (خمسة).
    for (const text of ['حياتي كلّها صبْرو جلاده', 'صعيب مهما تساهلته']) {
      for (const c of engine.analyzeHemistich(text).cards) {
        if (c.kind === 'pending' || !c.name) continue;
        equal([...c.name].length, [...c.symbol].length,
          `«${c.name}» رمزها ${c.symbol} في «${text}»`);
      }
    }
    // والأصل لا يضيع: سطر العلّة يذكره مع الصورة.
    const r = engine.analyzeHemistich('حياتي كلّها صبْرو جلاده');
    const last = r.cards[r.cards.length - 1];
    equal(last.name, 'فعولن');
    equal(last.licence.from, 'مفاعيلن');
    equal(last.licence.to, 'فعولن');
  });
});

describe('الكتابة العروضية', () => {
  it('لكل حرف رمز واحد، وعددهما سواء', () => {
    const r = engine.analyzeHemistich('مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ فَاعِلَاتُنْ');
    for (const l of r.letters) assert(l.symbol === '/' || l.symbol === '0', `رمز غريب: ${l.symbol}`);
    equal(r.letters.filter((l) => l.symbol === '/').length + r.letters.filter((l) => l.symbol === '0').length,
      r.letters.length);
  });

  it('نصّ التفعيلة يساوي رمزها حرفًا برمز', () => {
    // «ياماذكر» تحت `/0/0//0` — سبعة بسبعة. لو اختلّا لظهر النصّ
    // مزاحًا عن رمزه على البطاقة.
    for (const text of [
      'مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ فَاعِلَاتُنْ',
      'مُتَفْعِلُنْ مُسْتَفْعِلُنْ فَاعِلَاتُنْ',
      'البارحه ما نمت من كثر شوقي',
    ]) {
      const r = engine.analyzeHemistich(text);
      for (const c of r.cards) {
        if (c.kind === 'pending') continue;
        equal([...c.text].length, [...c.symbol].length,
          `«${c.name}» نصّها ${c.text} ورمزها ${c.symbol} في «${text}»`);
      }
    }
  });

  it('الإشباع لا يُخترع له حرف إذا جُهلت حركة الرويّ', () => {
    // إشباع آخر الشطر يُولّد مدًّا يتبع الحركة: ألفًا من الفتحة وياءً
    // من الكسرة وواوًا من الضمة. فإن كان الرويّ غير مشكول فالحركة
    // مجهولة — و«ومنزل» كانت تخرج «ومنزلا» وصوابها «ومنزلي».
    //
    // والفحص مشتقّ من البيانات: كل صيغة من صيغ البحور، مشكولةً
    // ومجرّدة، ومعها أبيات حقيقية.
    const bare = (x) => [...x].filter((c) => !/[\u064B-\u0652\u0670]/.test(c)).join('');
    const corpus = [];
    for (const m of DATA.meters.meters) {
      for (const f of m.forms) { corpus.push(f.sourceQuote); corpus.push(bare(f.sourceQuote)); }
    }
    corpus.push(
      'قفا نبك من ذكرى حبيب ومنزل',
      'حياتي كلّها صبْرو جلاده',
      'صعيب مهما تساهلته',
      'البارحه يحْسين ياما ذكْرْتك'
    );

    for (const text of corpus) {
      const vocalized = text !== bare(text);
      for (const l of engine.analyzeHemistich(text).letters) {
        if (!l.added) continue;
        assert(
          vocalized || !'اوي'.includes(l.ch),
          `اختُرع حرف مدّ «${l.ch}» على نصّ غير مشكول: «${text}»`
        );
      }
    }

    // ومتى عُلمت الحركة كُتب حرفها — وهي الكتابة العروضية المعروفة.
    const known = engine.analyzeHemistich('قفا نبك من ذكرى حبيبٍ ومنزلِ');
    const tail = known.letters[known.letters.length - 1];
    equal(tail.ch, 'ي', 'كسرةٌ مشكولة يُشبعها ياء');
    assert(tail.added, 'ويُعلَن مزيدًا على كل حال');

    // ومجهولُ الحركة يأخذ علامة الإطالة لا حرفًا.
    const guess = prosodicLetters([
      { weight: 'L', shape: 'CV', onset: 'ه', nucleus: 'short', quality: null,
        ishbaa: true, assumed: true, units: [0] },
    ]);
    equal(guess[1].ch, NEUTRAL_MADD, 'لا يُخترع حرف لحركة مجهولة');
    assert(guess[1].added);

    // ولا يُوسم مزيدًا إلا ما زِيد: حرف المدّ المرسوم حرفُ الشاعر.
    const written = engine.analyzeHemistich('يا ما ذكرت حبيبي');
    assert(written.letters.some((l) => l.ch === 'ا' && !l.added),
      'ألفٌ مرسومة لا تُوسم زيادة');
  });

  it('حروف التفعيلات لا تتداخل ولا تتكرّر', () => {
    // عرضُ كلماتِ التفعيلة كان يُكرّر الكلمة الواحدة في تفعيلتين.
    // أمّا الحروف فتقع في واحدة لا غير، فمجموعها يساوي حروف الشطر.
    const r = engine.analyzeHemistich('مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ فَاعِلَاتُنْ');
    const joined = r.cards.filter((c) => c.kind !== 'pending').map((c) => c.text).join('');
    equal(joined, r.letters.map((l) => l.ch).join(''));
  });
});

/* ═════════════════ وضع الشطر الواحد ═════════════════ */

describe('شطر واحد أو بيت', () => {
  it('الشطر الواحد لا تُرجَّح له صيغة، ويُترك الوزن يحسم', () => {
    // في وضع البيت يرجّح الحقلُ صيغتَه. وفي وضع الشطر لا حقل يرجّح،
    // فلا يجوز أن تُفرض صورة الصدر لمجرّد أنها الأولى في البيانات.
    const ajzText = 'مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ فَاعِلَاتَانْ';
    equal(engine.analyzeLive({ single: ajzText }).meter.formRole, 'ajz',
      'عجزٌ صريح يجب أن يُعرف عجزًا ولو كُتب في حقل الشطر');
  });

  it('الشطر الواحد يُسمّى شطرًا لا صدرًا', () => {
    const r = engine.analyzeLive({ single: 'مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ فَاعِلَاتُنْ' });
    equal(r.hemistichs.length, 1);
    equal(r.hemistichs[0].role, null, 'لا دور له: ليس صدرًا ولا عجزًا');
    equal(r.hemistichs[0].label, 'الشطر');
  });

  it('الفارغ في الوضعين لا يُنتج شيئًا ولا ينهار', () => {
    for (const fields of [{ single: '' }, { single: '   ' }, { sadr: '', ajz: '' }, {}]) {
      const r = engine.analyzeLive(fields);
      equal(r.empty, true, JSON.stringify(fields));
      equal(r.warnings.length, 0, 'لا تحفّظات على نصّ لا وجود له');
    }
  });
});

/* ═════════════════ التحفّظات ═════════════════ */

describe('التحفّظات — بيانٌ لا عرض', () => {
  it('يُرجعها المحرك مصفوفةً في كل تحليل', () => {
    const r = engine.analyzeLive({ single: 'البارحه ما نمت من كثر شوقي' });
    assert(Array.isArray(r.warnings), 'warnings يجب أن تكون مصفوفة دائمًا');
    atLeast(r.warnings.length, 1, 'نصّ غير مشكول لا بدّ له من تحفّظ');
    for (const w of r.warnings) {
      assert(w.area && w.message, `تحفّظ ناقص: ${JSON.stringify(w)}`);
      equal(typeof w.message, 'string');
    }
  });

  it('النصّ غير المشكول يُعلَن، والمشكول لا يُتحفَّظ عليه بلا سبب', () => {
    const loose = engine.analyzeLive({ single: 'البارحه ما نمت من كثر شوقي' });
    assert(loose.warnings.some((w) => w.area === 'vocalization'), 'يجب الإعلان عن افتراض التشكيل');

    const tight = engine.analyzeLive({ single: 'مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ فَاعِلَاتُنْ' });
    assert(!tight.warnings.some((w) => w.area === 'vocalization'),
      'النصّ المشكول تقطيعه قاطع، فلا تحفّظ على تشكيله');
  });

  it('السكون المُرخى والتعادل واختلاف الشطرين كلها تُعلَن', () => {
    const relaxed = engine.analyzeLive({ single: 'ياما ذكْرْتك ولْقصايد مقابيل' });
    assert(relaxed.warnings.some((w) => w.area === 'vocalization' && w.count > 0),
      'إرخاء السكون يجب أن يُعلَن مع عدده');

    const split = engine.analyzeLive({
      sadr: 'مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ فَاعِلَاتُنْ',
      ajz: 'فَعُولُنْ مَفَاعِيلُنْ فَعُولُنْ مَفَاعِيلُنْ',
    });
    assert(split.warnings.some((w) => w.area === 'meter' && w.hemistichs),
      'اختلاف الشطرين يجب أن يُعلَن');
  });

  it('ما لم يُحسم في القاعدة يُرافق كل تحليل', () => {
    const r = engine.analyzeLive({ single: 'مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ فَاعِلَاتُنْ' });
    const open = r.warnings.filter((w) => w.area === 'open_question');
    equal(open.length, engine.openQuestions().length,
      'كل بند معلَّق في القاعدة يجب أن يظهر في التحفّظات');
  });

  it('لا طباعة ولا DOM في المحرك — التحفّظات بيانات محضة', () => {
    // المحرك نفسه سيعمل داخل تطبيق iOS. فإن طبع في الطرفية أو مسّ
    // شيئًا من المتصفح لم يعد صالحًا هناك. وطبقةُ العرض هي التي تختار
    // ما تفعله بالتحفّظات.
    const r = engine.analyzeLive({ single: 'البارحه ما نمت' });
    for (const w of r.warnings) {
      equal(typeof JSON.parse(JSON.stringify(w)).message, 'string',
        'كل تحفّظ يجب أن يكون قابلًا للتسلسل');
    }
  });
});

/* ═════════════════ الهمزة المرسومة ألفًا ═════════════════ */

describe('الألف بعد الساكن همزةٌ لا مدّ', () => {
  const unitsOf = (t) => {
    const n = normalize(t);
    return phonemize(n.words, DATA.lexicon, { pausalEnd: true }).units;
  };

  it('لا يضيع حرف: «الاطلال» فيها همزة', () => {
    // كانت تسقط سقوطًا صامتًا: لا مدًّا تُلحق — والمدّ يقتضي متحركًا
    // قبله، واللام ساكنة — ولا همزةً تُنطق. فيضيع حرفٌ من الوزن كلّه.
    // «الاطلال» ← ء ل ء ط ل ل: ألف «لال» مدٌّ يندمج في اللام، وألفُ
    // الوسط همزةٌ قائمة بنفسها.
    for (const [word, count] of [
      ['الاطلال', 6], ['الارض', 5], ['الاسم', 5], ['الامل', 5],
    ]) {
      equal(unitsOf(word).length, count, `${word}: عدد الوحدات`);
      assert(unitsOf(word).some((u) => u.source === 'hamzat_qat_bare'),
        `${word}: الألف بعد الساكن يجب أن تكون همزة`);
    }
  });

  it('الألف بعد متحرك تبقى مدًّا لا همزة', () => {
    // الشرط الفارق هو سكون ما قبلها. فألف «قال» مدٌّ كما كانت.
    for (const w of ['قال', 'باب', 'سماء']) {
      assert(!unitsOf(w).some((u) => u.source === 'hamzat_qat_bare'),
        `${w}: ألف مدّ عوملت همزةً خطأً`);
    }
  });

  it('القراءتان معروضتان على الوزن: منطوقةً وساقطة', () => {
    // في النطق المتصل تسقط الهمزة وتنتقل حركتها إلى الساكن قبلها:
    // «غطّ الاطلال» تُنطق «غَطْ‑طَ‑لَطْ‑لَالْ». والقراءتان مشروعتان،
    // فلا تُفرض إحداهما — يُعرضان ويحسم الوزن.
    const dag = buildSyllableDag(unitsOf('غطّ الاطلال'));
    const patterns = new Set(
      enumeratePaths(dag, 500).paths.map((p) => p.map((e) => e.weight).join(''))
    );
    assert(patterns.has('LLLX'), 'القراءة الفصيحة — الهمزة منطوقة — مفقودة');
    assert(patterns.has('LSLX'), 'القراءة المتصلة — الهمزة ساقطة — مفقودة');
  });

  it('لا يُمسّ سكونٌ كتبه الشاعر بيده', () => {
    // الابتلاع لا يُعلَّم به إلا ساكنٌ أوجبته قاعدةٌ من قواعد المحرك،
    // لا سكونٌ صرّح به صاحب النصّ.
    for (const u of unitsOf('قِفْ الان')) {
      if (!u.source && u.vowel.known && u.vowel.length === 'none') {
        assert(!u.absorbsNextIfShort, `سكون مكتوب عُلّم بالابتلاع: ${u.c}`);
      }
    }
  });

  it('«البارحه يوم الدجا غطّ الاطلال» على المسحوب', () => {
    // بيتٌ نبطي حقيقي أورده المستخدم، وأكّد وزنَه محرّكٌ آخر.
    // والفرق بين المسحوب والرجز هنا موضعٌ واحد: أساكنةٌ اللام أم
    // متحركة. وكان المحرك يقفلها على السكون فيقرأه رجزًا.
    const r = engine.analyzeHemistich('البارحه يوم الدجا غطّ الاطلال', { preferRole: 'ajz' });
    equal(r.meter.name, 'المسحوب');
    equal(r.meter.score, 1);
    equal(r.cards.map((c) => c.name).join(' '), 'مستفعلن مستفعلن فاعلاتان');
    equal(r.cards[2].licence.name, 'التسبيغ');
  });
});

/* ═════════════════ اتّساق قراءة الكلمة ═════════════════ */

describe('الكلمة الواحدة لا تُقرأ قراءتين', () => {
  it('تفعيلات كل بحر مكتوبةً مجرّدةً تُعطي بحرها لا غيره', () => {
    // مشتقّ من البيانات: يمرّ على البحور كلها. من كتب تفعيلات الرجز
    // فقد أراد الرجز — وكان المحرك يعطيه المسحوب، لأن «مستفعلن»
    // مجرّدةً تحتمل قراءتين فيتعادل عليها بحور، ثم يرجّح بترتيب
    // القائمة وهو لا يدلّ على شيء.
    const strip = (s) => [...s].filter((c) => !/[ً-ْٰ]/.test(c)).join('');
    let checked = 0;
    for (const meter of engine.registry.enabled) {
      for (const form of meter.forms) {
        const bare = form.feet.map((f) => strip(f.vocalized)).join(' ');
        const r = engine.analyzeHemistich(bare, { preferRole: form.role || undefined });
        equal(r.meter.score, 1, `${meter.name} (${form.role}): ${bare}`);

        // اسمٌ يحتمل نطقين مجرّدًا («فعلن» فَعِلُنْ أو فَعْلُنْ) يحتمل
        // معه الشطرُ أكثر من تقطيع، فيتعادل عليه أكثر من بحر تعادلًا
        // صادقًا لا يُحسم إلا بالتشكيل. فلا يُشترط عليه تقطيعٌ بعينه.
        const ambiguous = form.feet.some(
          (f) => !(f.plain in engine.lexicon.tafilaVocalizations)
        );
        if (ambiguous) { checked++; continue; }

        // المشترَط **القراءة** لا اسم البحر: البحور تتداخل، وقد يصحّ
        // أن تُنسب التفعيلة إلى أصلها مزاحَفةً بدل نظيرتها المستقلّة.
        // أمّا أن تُقرأ «مستفعلن» فاعلاتنَ فتغيُّرٌ في التقطيع نفسه،
        // وهو الذي كان يقع.
        equal(
          engine.analyze(bare, { repeats: [1] }).internalPattern,
          form.pattern.join(''),
          `${meter.name} (${form.role}) قُرئت تفعيلاته على غير وجهها`
        );
        checked++;
      }
    }
    atLeast(checked, 60, 'يجب أن يمرّ على صيغ البحور كلها');
  });

  it('«مستفعلن» ثلاثًا رجزٌ لا مسحوب', () => {
    const r = engine.analyzeHemistich('مستفعلن مستفعلن مستفعلن');
    equal(r.meter.name, 'الرجز');
    equal(r.cards.map((c) => c.name).join(' '), 'مستفعلن مستفعلن مستفعلن');
  });

  it('يحصي الكلمات التي خالفت قراءةُ مثيلتها', () => {
    // القياس بالرسم لا بالصوامت: «مَفْعُولُنْ» و«مَفَاعِيلُنْ» صوامتهما
    // واحدة (م ف ع ل ن) وهما كلمتان مختلفتان — وقد أوقع ذلك خطأً حتى
    // كشفه اختبارٌ يشترط أن يطابق كل بحر صورته مطابقةً تامّة.
    const words = [{ text: 'مستفعلن' }, { text: 'مستفعلن' }];
    const units = [{ word: 0, c: 'م' }, { word: 1, c: 'م' }];
    const feet = [
      { ops: [{ edge: { weight: 'L', meta: { consumed: [0] } } }] },
      { ops: [{ edge: { weight: 'S', meta: { consumed: [1] } } }] },
    ];
    // الثانية آخر الشطر، وتخالف الأولى في مقطعها الوحيد — والفرق في
    // المقطع الأخير وحده مأذون فيه لأن الإشباع يقع هناك.
    equal(inconsistentWordReadings(feet, units, words), 0);
  });

  it('كلفةٌ لا منع: البحر المخالف يبقى مرشَّحًا وتنزل درجته', () => {
    const r = engine.analyze('مستفعلن مستفعلن مستفعلن', { repeats: [1] });
    const maskhub = r.alternatives.find((a) => a.name === 'المسحوب');
    if (maskhub) assert(maskhub.score < 1, 'القراءة المقلِّبة يجب أن تنزل عن التامّة');
  });
});

/* ═════════════════ نطق أسماء التفعيلات ═════════════════ */

describe('أسماء التفعيلات نطقها مقرَّر في البيانات', () => {
  it('يُفرض النطق على ما انفرد، ويُترك ما احتمل وجهين', () => {
    // المقياس مشتقّ من البيانات لا مكتوب: اسمٌ مجرّد له في البيانات
    // نطقٌ واحد يُفرض، وله نطقان يُترك حرًّا يحسمه الوزن — البند 26.
    // ولا تُثبَّت قائمةُ الملتبس، فهي تتغيّر بتصحيح البيانات: «فعول»
    // كانت ملتبسة حتى صُحّح رسم حذف فعولن.
    const strip = (s) => [...s].filter((c) => !/[ً-ْٰ]/.test(c)).join('');

    // اسم التفعيلة القائمة أولى من صورةٍ لغيرها: «فعلن» تفعيلةٌ نطقها
    // فَعْلُنْ، وهي أيضًا صورةُ «فاعلن» مخبونةً فَعِلُنْ. فمن كتبها
    // أراد التفعيلة، والصورة تُبلَغ من طريق أصلها.
    const forms = new Map();
    for (const t of DATA.tafaeel.tafaeel) {
      const p = strip(t.vocalized);
      if (!forms.has(p)) forms.set(p, new Set());
      forms.get(p).add(t.vocalized);
    }
    const claimed = new Set(forms.keys());
    for (const list of Object.values(DATA.variations.variations)) {
      for (const v of list) {
        const p = strip(v.result);
        if (claimed.has(p)) continue;
        if (!forms.has(p)) forms.set(p, new Set());
        forms.get(p).add(v.result);
      }
    }

    const map = engine.lexicon.tafilaVocalizations;
    assert(map, 'يجب أن تُشتقّ من البيانات');
    for (const [plain, set] of forms) {
      if (set.size === 1) {
        equal(map[plain], [...set][0], `«${plain}» انفرد بنطق فلم يُفرض`);
      } else {
        assert(!(plain in map), `«${plain}» احتمل ${set.size} نطقًا وفُرض عليه أحدها`);
      }
    }
    equal(map['مستفعلن'], 'مُسْتَفْعِلُنْ');
    equal(map['فاعلاتن'], 'فَاعِلَاتُنْ');
    // «فعلن» تفعيلةٌ قائمة نطقها فَعْلُنْ، فهي قاطعة رغم أن «فَعِلُنْ»
    // صورةٌ لـ«فاعلن» تتجرّد إلى الرسم نفسه.
    equal(map['فعلن'], 'فَعْلُنْ');
  });

  it('كل ما فيها مأخوذ من البيانات لا مكتوب في الكود', () => {
    const strip = (s) => [...s].filter((c) => !/[ً-ْٰ]/.test(c)).join('');
    const known = new Set();
    for (const t of DATA.tafaeel.tafaeel) known.add(t.vocalized);
    for (const list of Object.values(DATA.variations.variations)) {
      for (const v of list) known.add(v.result);
    }
    for (const [plain, vocalized] of Object.entries(engine.lexicon.tafilaVocalizations)) {
      assert(known.has(vocalized), `نطق غير موجود في البيانات: ${vocalized}`);
      equal(strip(vocalized), plain, `${plain} لا يوافق تجريدَ ${vocalized}`);
    }
  });

  it('تشكيل الشاعر أولى من الجدول', () => {
    // من كتب «مُسْتَفَعْلُنْ» بتشكيله فقد قصده، فلا يُبدَّل بالمقرَّر.
    const r = engine.analyze('مُسْتَفَعْلُنْ', { repeats: [1] });
    equal(r.internalPattern, 'LSLL', 'تشكيل المستخدم لم يُحترم');
  });
});
