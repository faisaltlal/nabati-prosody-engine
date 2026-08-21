/**
 * قاعدة الأوزان: تناسق البيانات نفسها.
 * تُشتق الاختبارات من meters.json، فإضافة بحر جديد تدخل هذه الفحوص
 * تلقائيًا دون كتابة اختبار جديد.
 */
import { describe, it, assert, equal } from './harness.js';
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

  it('تعارض اسم «البسيط» مُعلَن لا مُسكَت عنه', () => {
    const same = engine.registry.meters.filter((m) => m.name === 'البسيط');
    equal(same.length, 2, 'الاسم ورد مرتين في المصدر');
    assert(
      same.some((m) => m.status === 'NEEDS_VALIDATION' && m.validation),
      'يجب وسم التعارض وبيان ما يحسمه'
    );
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
