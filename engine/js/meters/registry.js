/**
 * سجلّ الأوزان.
 *
 * كل ما يعرفه المحرك عن البحور يأتي من data/*.json عبر هذا الملف.
 * لا يوجد في الكود اسم بحر واحد ولا نمط واحد مكتوب يدويًا — وهذا ما
 * يجعل إضافة بحر تعديلًا في البيانات لا في الكود.
 *
 * للبحر صيغتان: **الصدر** و**العجز**. والعجز في هذه القاعدة هو الصدر
 * نفسه مع تذييل في آخر تفعيلة (فاعلاتن ← فاعلاتان). بعض البحور صيغة
 * واحدة، إما لأن المصدر سوّى بين شطريها وإما لأنه أعطى سطرًا واحدًا.
 */

export function buildRegistry({ tafaeel, variations, meters }) {
  const tafilaById = new Map(tafaeel.tafaeel.map((t) => [t.id, t]));
  const problems = [];

  /** الصور المسموحة لتفعيلة، مع صورتها السالمة أولًا. */
  function variantsOf(tafilaId) {
    const list = variations.variations[tafilaId];
    if (!list) {
      problems.push({ kind: 'missing_variations', tafilaId });
      const t = tafilaById.get(tafilaId);
      return t ? [{ id: 'salim', name: 'سالم', result: t.vocalized, syllables: t.syllables, kind: 'salim', scope: 'any', severity: 1 }] : [];
    }
    return list;
  }

  function buildForm(meterId, form) {
    const feet = [];
    const pattern = [];
    const names = [];
    form.feet.forEach((fid, i) => {
      const t = tafilaById.get(fid);
      if (!t) {
        problems.push({ kind: 'unknown_tafila', meter: meterId, tafilaId: fid });
        return;
      }
      feet.push({
        index: i,
        tafilaId: t.id,
        plain: t.plain,
        vocalized: t.vocalized,
        salim: t.syllables,
        variants: variantsOf(t.id),
      });
      pattern.push(...t.syllables);
      names.push(t.plain);
    });
    return {
      role: form.role,
      sourceQuote: form.sourceQuote,
      feet,
      pattern,
      tafaeelNames: names,
    };
  }

  const built = [];
  for (const m of meters.meters) {
    const forms = (m.forms || []).map((f) => buildForm(m.id, f));
    const sadr = forms[0];

    const entry = {
      id: m.id,
      name: m.name,
      aliases: m.aliases || [],
      enabled: m.enabled !== false && forms.length > 0 && sadr.pattern.length > 0,
      status: m.status,
      note: m.note,
      validation: m.validation,
      sourceIndex: m.sourceIndex,
      forms,
      // الصدر هو الصيغة المرجعية: النمط والطول والتفعيلات المعروضة منه.
      feet: sadr ? sadr.feet : [],
      pattern: sadr ? sadr.pattern : [],
      tafaeelNames: sadr ? sadr.tafaeelNames : [],
      sourceQuote: forms.map((f) => f.sourceQuote).filter(Boolean).join('  /  '),
    };

    if (m.expectedSyllableCount != null && entry.pattern.length !== m.expectedSyllableCount) {
      problems.push({
        kind: 'syllable_count_mismatch',
        meter: m.id,
        declared: m.expectedSyllableCount,
        derived: entry.pattern.length,
      });
    }

    built.push(entry);
  }

  // تحقّق: النمط المقطعي لكل تفعيلة يوافق نمطها الحرفي الخليلي.
  for (const t of tafaeel.tafaeel) {
    const derived = lettersFromSyllables(t.syllables);
    if (t.khalilLetters && derived !== t.khalilLetters) {
      problems.push({
        kind: 'tafila_pattern_mismatch',
        tafilaId: t.id,
        fromSyllables: derived,
        declared: t.khalilLetters,
      });
    }
  }

  const byId = new Map(built.map((m) => [m.id, m]));

  return {
    meters: built,
    enabled: built.filter((m) => m.enabled),
    byId,
    tafilaById,
    problems,
    notInSource: meters.notInSource || [],

    find(nameOrId) {
      if (byId.has(nameOrId)) return byId.get(nameOrId);
      const needle = String(nameOrId).trim();
      return built.find((m) => m.name === needle || m.aliases.includes(needle)) || null;
    },
  };
}

/**
 * من المقاطع إلى الحروف الخليلية (1 متحرك / 0 ساكن).
 * قصير = متحرك. طويل = متحرك فساكن. مفرط = متحرك فساكنان.
 */
export function lettersFromSyllables(syllables) {
  return syllables
    .map((s) => (s === 'S' ? '1' : s === 'X' ? '100' : '10'))
    .join('');
}
