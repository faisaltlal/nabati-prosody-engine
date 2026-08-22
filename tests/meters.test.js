/**
 * قاعدة الأوزان: تناسق البيانات نفسها.
 * تُشتق الاختبارات من meters.json، فإضافة بحر جديد تدخل هذه الفحوص
 * تلقائيًا دون كتابة اختبار جديد.
 */
import { describe, it, assert, equal, atLeast } from './harness.js';
import { createEngine } from '../engine/js/index.js';
import { lettersFromSyllables } from '../engine/js/meters/registry.js';
import { DATA } from '../engine/js/data.generated.js';

const engine = createEngine(DATA);

describe('قاعدة الأوزان — التناسق', () => {
  it('لا مشكلات تناسق في البيانات', () => {
    equal(engine.integrity(), [], 'أي مشكلة هنا تعني تعارض البيانات مع نفسها');
  });

  it('نمط كل تفعيلة المقطعي يوافق نمطها الحرفي الخليلي', () => {
    for (const t of DATA.tafaeel.tafaeel) {
      equal(lettersFromSyllables(t.syllables), t.khalilLetters, `التفعيلة ${t.plain}`);
    }
  });

  it('كل بحور المصدر مسجَّلة ومفعَّلة', () => {
    equal(engine.listMeters().length, DATA.meters.meters.length);
    equal(engine.registry.enabled.length, DATA.meters.meters.length);
  });

  it('كل صيغة لها تفعيلات ونمط غير فارغ', () => {
    for (const m of engine.registry.enabled) {
      assert(m.forms.length >= 1, `${m.name} بلا صيغ`);
      for (const f of m.forms) {
        assert(f.feet.length > 0, `${m.name} (${f.role}) بلا تفعيلات`);
        assert(f.pattern.length > 0, `${m.name} (${f.role}) بلا نمط`);
      }
    }
  });

  it('عدد المقاطع المعلَن يوافق المشتقّ من التفعيلات', () => {
    for (const m of DATA.meters.meters) {
      const built = engine.registry.byId.get(m.id);
      equal(built.pattern.length, m.expectedSyllableCount, m.name);
    }
  });

  it('العجز — حيث وُجد — لا يقصر عن الصدر', () => {
    // العجز في هذه القاعدة هو الصدر مع تذييل، فطوله مساوٍ أو أزيد.
    for (const m of engine.registry.enabled) {
      if (m.forms.length < 2) continue;
      const [sadr, ajz] = m.forms;
      assert(
        ajz.pattern.length >= sadr.pattern.length - 1,
        `${m.name}: الصدر ${sadr.pattern.length} والعجز ${ajz.pattern.length}`
      );
    }
  });

  it('كل صيغة تطابق نمطها هي مطابقة تامة', () => {
    for (const meter of engine.registry.enabled) {
      meter.forms.forEach((form, fi) => {
        const r = engine.stages.matchPattern(form.pattern, meter, { form: fi });
        equal(r.score, 1, `${meter.name} (${form.role}) لا يطابق نفسه`);
        equal(r.brokenFeet.length, 0, `${meter.name} (${form.role}) فيه كسر في مطابقة ذاته`);
        equal(r.verdict, 'sound');
      });
    }
  });

  it('كل صيغة يتصدّر ترتيبَها بحرُها', () => {
    for (const meter of engine.registry.enabled) {
      for (const form of meter.forms) {
        const ranked = engine.stages.rankPattern(form.pattern);
        const top = ranked.filter((r) => r.score >= ranked[0].score - 1e-9).map((r) => r.meterId);
        assert(top.includes(meter.id), `${meter.name} (${form.role}) تصدّره ${ranked[0].name}`);
      }
    }
  });

  it('التفعيلة المذيَّلة تزيد مقطعًا مفرطًا على أصلها', () => {
    const byId = new Map(DATA.tafaeel.tafaeel.map((t) => [t.id, t]));
    for (const t of DATA.tafaeel.tafaeel) {
      if (t.family !== 'mudhayyal' || !t.baseOf) continue;
      const base = byId.get(t.baseOf);
      assert(base, `أصل ${t.plain} مفقود`);
      equal(t.syllables[t.syllables.length - 1], 'X', `${t.plain} لا تنتهي بمقطع مفرط`);
      equal(t.syllables.length, base.syllables.length, `${t.plain} تخالف ${base.plain} في عدد المقاطع`);
    }
  });

  it('المقطع المفرط لا يقع إلا في آخر التفعيلة', () => {
    for (const t of DATA.tafaeel.tafaeel) {
      const i = t.syllables.indexOf('X');
      if (i === -1) continue;
      equal(i, t.syllables.length - 1, `${t.plain}`);
    }
  });

  it('لا اسمان متطابقان في القاعدة', () => {
    // «البسيط» ورد ثلاث مرات في المصدر بتفعيلات مختلفة، فسُمّي كلٌّ
    // باسم مميِّز (البسيط، البسيط - طرق 1، البسيط - طرق 2). اسمان
    // متطابقان لبحرين مختلفين يجعل النتيجة ملتبسة على القارئ، ويكسر
    // البحث بالاسم. فيُمنع مرورهما بصمت.
    const seen = new Map();
    for (const m of engine.registry.meters) {
      if (seen.has(m.name)) {
        assert(false, `الاسم «${m.name}» يحمله ${seen.get(m.name)} و${m.id}`);
      }
      seen.set(m.name, m.id);
    }
  });

  it('كل اسم بديل يوصل إلى بحره', () => {
    // دمج مدخلين لا يجوز أن يُضيّع الاسم القديم: من بحث عن «غير مصنف - 4»
    // يجب أن يجد «البسيط - طرق 2».
    for (const raw of DATA.meters.meters) {
      for (const alias of raw.aliases || []) {
        const found = engine.registry.find(alias);
        assert(found, `الاسم البديل «${alias}» لا يوصل إلى شيء`);
        equal(found.id, raw.id, `«${alias}» يوصل إلى ${found.id} لا ${raw.id}`);
      }
    }
  });

  it('البحور ذات الصيغة الواحدة موثَّق سببها', () => {
    for (const m of engine.registry.enabled) {
      if (m.forms.length === 1) {
        assert(m.note, `${m.name} صيغة واحدة بلا تعليل`);
      }
    }
  });

  it('لا بحران متطابقان إلا بإعلان صريح', () => {
    // تطابق بحرين تطابقًا تامًّا ليس خطأً بالضرورة — قد يكون البحر
    // نفسه باسمين. لكن مروره بصمت خطأ: يُربك الترتيب ويُخفي أن أحد
    // الاسمين زائد. فيُشترط أن يُعلن كل طرف عن الآخر.
    const byPattern = new Map();
    for (const m of engine.registry.enabled) {
      const key = m.forms.map((f) => f.pattern.join('')).join('|');
      if (!byPattern.has(key)) byPattern.set(key, []);
      byPattern.get(key).push(m);
    }
    for (const [, group] of byPattern) {
      if (group.length < 2) continue;
      const raw = new Map(DATA.meters.meters.map((m) => [m.id, m]));
      for (const m of group) {
        const decl = raw.get(m.id).duplicateOf;
        assert(
          decl && group.some((o) => o.id === decl),
          `${m.name} يطابق ${group.filter((o) => o.id !== m.id).map((o) => o.name).join('، ')} بلا إعلان duplicateOf`
        );
      }
    }
  });

  // ============================================================
  // الصدر والعجز صورتان للبحر الواحد لا بحران.
  // الهدف المعلَن: من كتب شطرًا على صورة الصدر أو على صورة العجز
  // ظهر له البحر نفسه باسمه ونسبة مطابقته. هذه الفحوص تحرس ذلك
  // نصًّا لا نمطًا: تُبنى الأشطر من التفعيلات المشكولة ثم تُحلَّل
  // من مدخل المحرك العامّ كما يفعل المستخدم.
  // ============================================================

  /** يبني شطرًا مشكولًا من تفعيلات صيغة ما. */
  function hemistichText(form) {
    const byId = new Map(DATA.tafaeel.tafaeel.map((t) => [t.id, t]));
    return form.feet.map((f) => byId.get(f.tafilaId).vocalized).join(' ');
  }

  it('كل صيغة — صدرًا كانت أو عجزًا — تُظهر بحرها ودرجته', () => {
    for (const m of engine.registry.enabled) {
      for (const form of m.forms) {
        const r = engine.analyze(hemistichText(form));
        assert(r.bestMeter, `${m.name} (${form.role}) لم يُعرَف أصلًا`);

        // المطلوب أن يكون البحر في صدارة الترتيب، لا أن ينفرد بها:
        // بعض البحور تتطابق أنماطها فعلًا (شطر بحر طويل قد يساوي بيتًا
        // كاملًا من بحر مجزوء)، والمحرك يُعلن التعادل بدل أن يخفيه.
        const top = [r.bestMeter, ...(r.ambiguity ? r.ambiguity.tiedWith : [])];
        const hit = top.find((x) => x.id === m.id);
        assert(hit,
          `${m.name} (${form.role}) لم يتصدّر — تصدّره ${r.bestMeter.name}`);
        equal(hit.score, 1,
          `${m.name} (${form.role}) لم يطابق صورته مطابقة تامّة`);

        // نسبة الصيغة لا تُفحص إلا حين ينفرد البحر بالصدارة، لأن
        // بيانات الصيغة لا تُرجَع إلا للبحر الأول. والمطلوب أن تكون
        // الصيغة المُرجَعة صيغةً نمطها هو هذا النمط — لا أن تحمل الاسم
        // نفسه: بحرٌ صدره وعجزه سواء في المصدر لا يميّزه المحرك بينهما،
        // وادّعاء التمييز هنا ادّعاءُ ما ليس في البيانات.
        if (r.bestMeter.id === m.id) {
          const key = form.pattern.join('');
          const roles = m.forms.filter((f) => f.pattern.join('') === key).map((f) => f.role);
          assert(roles.includes(r.bestMeter.formRole),
            `${m.name} أُرجِع بصيغة ${r.bestMeter.formRole} ونمطها ليس نمط ${form.role}`);
        }
      }
    }
  });

  it('بيت شطراه على صيغتين مختلفتين يظل بحرًا واحدًا', () => {
    // لكل بحر له صدر وعجز: صدرٌ ثم عجز — وهي الصورة الطبيعية للبيت.
    let tested = 0;
    for (const m of engine.registry.enabled) {
      if (m.forms.length < 2) continue;
      const [sadr, ajz] = m.forms;
      // بحور صدرها وعجزها سواء في المصدر (لا تذييل) لا فرق فيها يُفحص.
      if (sadr.pattern.join('') === ajz.pattern.join('')) continue;
      const r = engine.analyze(`${hemistichText(sadr)} ... ${hemistichText(ajz)}`);
      assert(r.bestMeter, `${m.name} بيتًا كاملًا لم يُعرَف`);
      equal(r.bestMeter.id, m.id, `${m.name} بيتًا كاملًا ظهر ${r.bestMeter.name}`);
      equal(r.bestMeter.score, 1, `${m.name} بيتًا كاملًا لم يطابق تمامًا`);
      equal(r.bestMeter.formRoles.join('+'), `${sadr.role}+${ajz.role}`,
        `${m.name} لم يُنسب كل شطر إلى صيغته`);
      tested++;
    }
    assert(tested > 0, 'لا بحر بصيغتين في القاعدة — الفحص بلا معنى');
  });

  it('كل تفعيلة يستعملها بحر لها صور مسجَّلة', () => {
    const used = new Set();
    for (const m of engine.registry.enabled) {
      for (const f of m.forms) for (const foot of f.feet) used.add(foot.tafilaId);
    }
    for (const id of used) {
      const list = DATA.variations.variations[id];
      assert(list && list.length >= 1, `التفعيلة ${id} بلا صور`);
      equal(list[0].id, 'salim', `أول صورة لـ ${id} يجب أن تكون السالمة`);
    }
  });
});

/* ═════════════════ مطابقة المادة المرجعية ═════════════════ */

describe('صور التفعيلات كما وردت في المادة المرجعية', () => {
  // جدولٌ قدّمه المستخدم لصور ستّ تفعيلات. مثبَّت هنا حرفًا بحرف كي
  // يبقى محروسًا: أي تغيير في `variations.json` يخالفه يظهر فشلًا لا
  // انحرافًا صامتًا.
  const REFERENCE = {
    faulun: [['qabd', 'فَعُولُ']],
    mafailun: [['qabd', 'مَفَاعِلُنْ'], ['kaff', 'مَفَاعِيلُ'], ['hadhf', 'فَعُولُنْ']],
    failatun: [['kaff', 'فَاعِلَاتُ'], ['khabn', 'فَعِلَاتُنْ']],
    // الخبن: قدّم صاحب المادة «متفعلن» أوّلًا ثم قرّر اعتماد «مفاعلن»
    // لأنها أشهر في النبطي. والصورتان واحدة وزنًا، فالمعتمدة هي
    // الظاهرة و«متفعلن» محفوظة صورةً قبل النقل.
    mustafilun: [['khabn', 'مَفَاعِلُنْ'], ['tayy', 'مُسْتَعِلُنْ'], ['khabl', 'مُتَعِلُنْ']],
    failun: [['khabn', 'فَعِلُنْ'], ['tadhyil', 'فَاعِلَانْ']],
  };

  it('كل صورة في المادة موجودة في البيانات بالصيغة نفسها', () => {
    for (const [tafilaId, expected] of Object.entries(REFERENCE)) {
      const list = DATA.variations.variations[tafilaId];
      assert(list, `تفعيلة مفقودة: ${tafilaId}`);
      for (const [id, result] of expected) {
        const v = list.find((x) => x.id === id);
        assert(v, `${tafilaId}: صورة مفقودة ${id}`);
        equal(v.result, result, `${tafilaId}/${id}`);
      }
    }
  });

  it('الصورة قبل النقل محفوظة، ولا تفارق المنقولة وزنًا', () => {
    // بعض الصور لها اسمان: صورةٌ تنتج عن التغيير مباشرةً، وتفعيلةٌ
    // معروفة تُنقل إليها. «مستفعلن» مخبونةً «مُتَفْعِلُنْ» وتُنقل إلى
    // «مَفَاعِلُنْ»، ومقطوعةً «مُسْتَفْعِلْ» وتُنقل إلى «مَفْعُولُنْ».
    // فالمنقولة هي المعتمدة، والأولى أدلّ على التغيير فحُفظت.
    for (const [tafilaId, id, before, after] of [
      ['mustafilun', 'khabn', 'مُتَفْعِلُنْ', 'مَفَاعِلُنْ'],
      ['mustafilun', 'qat', 'مُسْتَفْعِلْ', 'مَفْعُولُنْ'],
      ['failun', 'qat', 'فَاعِلْ', 'فَعْلُنْ'],
    ]) {
      const v = DATA.variations.variations[tafilaId].find((x) => x.id === id);
      equal(v.beforeTransfer, before, `${tafilaId}/${id}: الصورة قبل النقل`);
      equal(v.result, after, `${tafilaId}/${id}: الصورة بعد النقل`);
    }
  });

  it('كل صورة لها اسمان لا تفارق إحداهما الأخرى وزنًا', () => {
    // مشتقّ من البيانات: النقل تسميةٌ لا تغييرُ وزن. فلو نُقلت صورةٌ
    // إلى تفعيلة تخالفها في الحروف لاختلّ العرض والوزن معًا.
    const letters = (s) => [...s].filter((c) => !/[ً-ْٰ]/.test(c)).length;
    let seen = 0;
    for (const [tafilaId, list] of Object.entries(DATA.variations.variations)) {
      for (const v of list) {
        if (!v.beforeTransfer) continue;
        seen++;
        equal(letters(v.beforeTransfer), letters(v.result),
          `${tafilaId}/${v.id}: ${v.beforeTransfer} و${v.result} تختلفان في عدد الحروف`);
        // وعددُ حروفهما يوافق مقاطعَهما بالاشتقاق نفسه الذي يعتمده
        // الترميز الحرفي: قصير حرف، وطويل حرفان، ومفرط ثلاثة.
        equal(letters(v.result), lettersFromSyllables(v.syllables).length,
          `${tafilaId}/${v.id}: عدد حروف ${v.result} لا يوافق مقاطعها`);
      }
    }
    atLeast(seen, 3, 'يجب أن تُفحص كل صورة لها اسمان');
  });

  it('الصورة المعطَّلة لا تدخل المطابقة وتبقى مُعلَنة', () => {
    // الترفيل وارد في المادة، ونبّه المستخدم أن علل الفصيح لا تُعامل
    // في النبطي بالطريقة نفسها — فسُجّل ولم يُفعَّل.
    const raw = DATA.variations.variations.failun.find((v) => v.id === 'tarfeel');
    assert(raw, 'الترفيل يجب أن يبقى مسجَّلًا في البيانات');
    equal(raw.enabled, false, 'ولا يُفعَّل حتى يثبت');
    assert(raw.validation && raw.validation.resolvedBy, 'ويُبيَّن ما يحسمه');

    const built = engine.registry.tafilaById.get('failun');
    assert(built, 'فاعلن مبنيّة');
    const inMatcher = engine.registry.enabled
      .flatMap((m) => m.forms).flatMap((f) => f.feet)
      .filter((f) => f.tafilaId === 'failun')
      .flatMap((f) => f.variants);
    assert(!inMatcher.some((v) => v.id === 'tarfeel'), 'الصورة المعطَّلة دخلت المطابقة');
    assert(engine.openQuestions().some((q) => q.area === 'variation'), 'ولم تُعلن');
  });

  it('كل صورة معطَّلة مقيسٌ أثرُها لا مظنون', () => {
    // التعطيل قرارٌ، والقرار يحتاج دليلًا. فيُشترط أن يُسجَّل مع كل
    // صورة معطَّلة ما قِيس من أثرها.
    for (const [tafilaId, list] of Object.entries(DATA.variations.variations)) {
      for (const v of list) {
        if (v.enabled !== false) continue;
        assert(v.validation, `${tafilaId}/${v.id}: بلا بيان`);
        assert(v.validation.issue, `${tafilaId}/${v.id}: بلا سبب`);
        assert(v.validation.measured, `${tafilaId}/${v.id}: بلا قياس لأثرها`);
      }
    }
  });
});
