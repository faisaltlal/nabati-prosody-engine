/**
 * اختبارات طبقتَي الأصوات والمقاطع — القواعد الإلزامية في البند 19.
 */
import { describe, it, assert, equal } from './harness.js';
import { createEngine } from '../engine/js/index.js';
import { DATA } from '../engine/js/data.generated.js';
import { enumeratePaths } from '../engine/js/prosody/syllableDag.js';

const engine = createEngine(DATA);
const pattern = (text) =>
  engine.stages.syllabify(text).free.syllables.map((s) => s.weight).join('');
const units = (text) => engine.stages.phonemize(text).units;

describe('الأصوات — القواعد الإلزامية', () => {
  it('الشدة: ساكن ثم متحرك', () => {
    const u = units('مَدَّ');
    equal(u.map((x) => x.c), ['م', 'د', 'د']);
    equal(u[1].vowel.length, 'none', 'الأول من المشدّد ساكن');
    equal(u[2].vowel.length, 'short', 'الثاني متحرك');
  });

  it('التنوين نون ساكنة', () => {
    const u = units('كِتَابٌ');
    equal(u[u.length - 1].c, 'ن');
    equal(u[u.length - 1].vowel.length, 'none');
    equal(pattern('كِتَابٌ'), 'SLL', 'كِتَابُنْ = فَعُولُنْ');
  });

  it('اللام الشمسية: اللام لا تُنطق والحرف بعدها مشدّد', () => {
    const u = units('الشَّمْسُ');
    assert(!u.some((x) => x.c === 'ل'), 'لا لام في النطق');
    equal(u.filter((x) => x.c === 'ش').length, 2, 'الشين مشدّدة = صوتان');
  });

  it('اللام القمرية: اللام تُنطق ساكنة', () => {
    const u = units('الْقَمَرْ');
    const lam = u.find((x) => x.c === 'ل');
    assert(lam, 'اللام منطوقة');
    equal(lam.vowel.length, 'none');
    equal(pattern('الْقَمَرْ'), 'LSL', 'أَلْ قَ مَرْ = فَاعِلُنْ');
  });

  it('حروف المدّ تُطيل المقطع', () => {
    equal(pattern('قَالُوا'), 'LL');
    equal(pattern('قَالَ'), 'LL', 'الفتحة الأخيرة تُشبَع');
  });

  it('اللين ليس مدًّا: بَيْت مقطع مغلق لا ممدود', () => {
    const u = units('بَيْتٌ');
    const yaa = u.find((x) => x.c === 'ي');
    assert(yaa && yaa.vowel.length === 'none', 'الياء صامت ساكن لا حرف مدّ');
    equal(pattern('بَيْتٌ'), 'LL');
  });

  it('الحذف الصوتي: ألف التفريق لا تُحتسب', () => {
    equal(pattern('كَتَبُوا'), 'SSL', 'ثلاثة مقاطع لا أربعة');
    const u = units('كَتَبُوا');
    equal(u.length, 3, 'ثلاث وحدات: ك ت ب');
  });

  it('همزة الوصل تُنطق في أول الشطر وتسقط في وصله', () => {
    const start = units('الْبَيْتُ');
    equal(start[0].c, 'ء', 'أول الشطر: الهمزة منطوقة');
    const mid = units('فِي الْبَيْتِ');
    assert(!mid.some((x, i) => i > 0 && x.c === 'ء'), 'موصولة: الهمزة ساقطة');
  });

  it('وصل الهمزة: ألف مجرّدة في الدرج تحتمل السقوط', () => {
    // الألف المجرّدة رسمُ همزة الوصل، وهمزة القطع تُرسم بالرأس (أ/إ).
    // غير أن الرسم النبطي يُغفل الرأس كثيرًا، فلا يُقطع بأحد الوجهين:
    // تُعرض القراءتان على الوزن وهو الذي يحسم.
    const u = units('لَا انْتَ');
    equal(u[1].c, 'ء', 'الألف الابتدائية همزة لا مدّ');
    assert(u[1].elidable, 'همزة موسَّطة رُسمت ألفًا مجرّدة: وصلها مطروح');
    assert(!units('انْتَ')[0].elidable, 'أول الشطر لا وصل فيه — لا شيء قبلها');

    const reads = new Set(
      enumeratePaths(engine.stages.syllabify('لَا انْتَ').dag)
        .paths.map((p) => p.map((e) => e.weight).join(''))
    );
    assert(reads.has('LLL'), 'الفصيحة باقية: لَا أَنْ تَا');
    assert(reads.has('LL'), 'والموصولة مطروحة: لَنْ تَا — المدّ يقصر لالتقاء الساكنين');
  });

  it('أل التعريف تُعرف ولو سبقها حرف موصول', () => {
    // «بالطيب» بِطْطِيب لا بَالطيب: الألف همزةُ وصلٍ ساقطة، واللام
    // مدغمةٌ في الشمسيّ. وكانت تُقرأ ألفَ مدٍّ فتضيع اللام الشمسية.
    equal(units('بالطيب').map((x) => x.c).join(''), 'بططيب', 'بِطْ‑طِيب');
    equal(units('والقمر').map((x) => x.c).join(''), 'ولقمر', 'وَلْ‑قَمَر — قمريّة');
    equal(units('فالليل').map((x) => x.c).join(''), 'فلليل', 'فَلْ‑لَيْل — شمسيّة');
    equal(units('وبالبيت').map((x) => x.c).join(''), 'وبلبيت', 'عاطفة ثم جارّة');
    // «لل» رسمٌ خاصّ: ألف الوصل ساقطة من الرسم نفسه.
    equal(units('للبيت').map((x) => x.c).join(''), 'للبيت', 'لِلْ‑بَيْت');
    // حركات الحروف الموصولة مقرَّرة: العاطفة مفتوحة والجارّة مكسورة.
    equal(units('بالطيب')[0].vowel.quality, 'i');
    equal(units('والقمر')[0].vowel.quality, 'a');

    // وما ليس منها لا يُتوهَّم: الشرط البنيوي وحده يُخرج «والد».
    equal(units('والد').map((x) => x.c).join(''), 'ولد', 'وَالِد — لا وَلْد');
    assert(!units('والد').some((x) => x.source === 'proclitic'));
    // وما فاته الشرط تُخرجه قائمةُ الاستثناءات في البيانات.
    for (const word of DATA.lexicon.article.exceptions) {
      assert(
        !units(word).some((x) => x.source === 'proclitic'),
        `${word} مستثناة فلا تُقرأ «أل»`
      );
    }
    // ولا تُقاس «لل» على غيرها: «بلاد» ليست باءَ جرٍّ ثم لامَ تعريف.
    assert(!units('بلاد').some((x) => x.source === 'proclitic'));
  });

  it('الوصل: التقاء الساكنين يقصر حرف المدّ', () => {
    equal(pattern('فِي الْبَيْتِ'), 'LLL', 'فِلْ بَيْ تِي — لا فِي لْ بَيْت');
  });

  it('يعالج الكلمات كنطق متصل لا كلمة كلمة', () => {
    // اللام تغلق مقطع الكلمة السابقة، وهذا لا يقع إلا بتحليل متصل.
    const syl = engine.stages.syllabify('فِي الْبَيْتِ').free.syllables;
    equal(syl[0].coda, 'ل', 'لام «أل» أغلقت مقطع «في»');
  });

  it('ألف تُنطق ولا تُكتب', () => {
    equal(pattern('هذا'), 'LL', 'هَاذَا');
    equal(pattern('ذلك'), 'LSL', 'ذَالِكَ');
  });

  it('نهاية الشطر: الإشباع يجعل المقطع الأخير طويلًا', () => {
    const syl = engine.stages.syllabify('كَتَبَ').free.syllables;
    equal(syl[syl.length - 1].weight, 'L');
    assert(syl[syl.length - 1].ishbaa, 'مسجَّل أنه إشباع لا قراءة أصلية');
  });

  it('المقطع المفرط لا يقع إلا في آخر الشطر', () => {
    assert(pattern('كِتَابْ').includes('X'), 'آخر الشطر يقبل المفرط');
    assert(!pattern('فِي الْبَيْتِ').includes('X'), 'وسط الشطر لا يقبله');
  });

  it('التاء المربوطة: تاء في الوصل وهاء في الوقف', () => {
    const pause = units('مَدْرَسَة');
    equal(pause[pause.length - 1].c, 'ه', 'الوقف');
    const conn = units('مَدْرَسَةُ الْحَيّ');
    assert(conn.some((x) => x.c === 'ت'), 'الوصل');
  });
});

describe('المقاطع — بنية المخطّط', () => {
  it('النصّ المشكول يعطي تقطيعًا قاطعًا', () => {
    const r = engine.stages.syllabify('مُسْتَفْعِلُنْ');
    assert(r.free.certain, 'قراءة واحدة لا غير');
    equal(r.free.syllables.map((s) => s.weight).join(''), 'LLSL');
  });

  it('النصّ المجرّد يفتح أكثر من قراءة ويُعلن ذلك', () => {
    const r = engine.stages.syllabify('مستفعلن');
    assert(r.dag.assumedVocalization, 'مسجَّل أن التشكيل مفترض');
    assert(r.free.pathCount > 1, 'أكثر من مسار');
  });

  it('كل مقطع يبدأ بصامت واحد — لا مقطع بلا فاتحة', () => {
    const syl = engine.stages.syllabify('الْقَمَرْ').free.syllables;
    assert(syl.every((s) => s.onset), 'لكل مقطع صامت فاتح');
  });

  it('لا يفترض أن كل حرف مقطع', () => {
    const r = engine.stages.syllabify('مُسْتَفْعِلُنْ');
    equal(r.free.syllables.length, 4, 'سبعة حروف = أربعة مقاطع');
  });
});
