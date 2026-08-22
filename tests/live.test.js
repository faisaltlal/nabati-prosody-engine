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
import { phonemize } from '../engine/js/phonology/phonemizer.js';
import { buildSyllableDag } from '../engine/js/prosody/syllableDag.js';
import { rankMeters } from '../engine/js/matching/meterMatcher.js';
import { rankMetersPartial } from '../engine/js/matching/partialMatcher.js';
import { createAlignmentCache } from '../engine/js/matching/footMatcher.js';

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
