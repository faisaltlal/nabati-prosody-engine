#!/usr/bin/env node
/**
 * يولّد الجداول المشتقّة من البيانات داخل التوثيق:
 *   • جدول البحور في docs/METERS.md
 *   • جدول التفعيلات المتاحة في docs/ADDING-A-METER.md
 *
 * السبب: الجدول كان يُحرَّر يدويًا فيتأخّر عن البيانات عند كل تعديل،
 * والبند 30 يشترط أن تكون إضافة بحر تعديلًا في البيانات وحدها. فلا
 * يجوز أن يفرض التوثيق عملًا يدويًا إضافيًا.
 *
 * يُستبدل ما بين علامتَي GENERATED وحدهما — بقيّة الملف مكتوبة بيد.
 * فحص `--check` يفشل إن تأخّر الجدول، ويُشغَّل في CI.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createEngine } from '../engine/js/index.js';
import { DATA } from '../engine/js/data.generated.js';

const here = dirname(fileURLToPath(import.meta.url));
const docs = join(here, '..', 'docs');

const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const ar = (n) => String(n).replace(/\d/g, (d) => AR_DIGITS[+d]);

const engine = createEngine(DATA);
const meters = engine.registry.enabled;
const raw = new Map(DATA.meters.meters.map((m) => [m.id, m]));

/** أسماء تفعيلات صيغة ما كما تُقرأ. */
const quote = (form) => form.tafaeelNames.join(' ');

function table() {
  const rows = meters.map((m) => {
    const [sadr, ajz] = [m.forms[0], m.forms[1]];
    const flag = raw.get(m.id).status === 'NEEDS_VALIDATION' ? ' ⚠️' : '';
    const alias = raw.get(m.id).aliases?.length
      ? `<br><small>ويُسمّى: ${raw.get(m.id).aliases.join('، ')}</small>` : '';
    return `| ${m.name}${flag}${alias} | \`${quote(sadr)}\` | ${ajz ? `\`${quote(ajz)}\`` : '—'} | \`${sadr.pattern.join('')}\` | ${sadr.pattern.length} |`;
  });
  return [
    '| البحر | الصدر | العجز | نمط الصدر | مقاطع |',
    '|---|---|---|---|---|',
    ...rows,
  ].join('\n');
}

function summary() {
  const total = meters.length;
  const formCount = meters.reduce((n, m) => n + m.forms.length, 0);
  const oneForm = meters.filter((m) => m.forms.length === 1);
  const sameBoth = meters.filter(
    (m) => m.forms.length >= 2 && m.forms[0].pattern.join('') === m.forms[1].pattern.join('')
  );
  const lengths = [...new Set(meters.map((m) => m.forms[0].pattern.length))].sort((a, b) => a - b);

  const lines = [
    `**${ar(total)} بحرًا، كلها مفعَّلة، بـ${ar(formCount)} صيغة.**`,
    '',
    `أطوال الأشطر بين ${ar(lengths[0])} و${ar(lengths[lengths.length - 1])} مقطعًا.`,
    '',
  ];
  if (oneForm.length) {
    lines.push(
      `**${ar(oneForm.length)} بصيغة واحدة** — لأن المصدر أعطاها سطرًا واحدًا فلم يُخترع لها عجز:`,
      oneForm.map((m) => m.name).join('، ') + '.',
      ''
    );
  }
  if (sameBoth.length) {
    lines.push(
      `**${ar(sameBoth.length)} صدرها وعجزها متطابقان** في المصدر — لا تذييل فيها، فلا يميّز المحرك بين شطريها ولا يدّعي ذلك:`,
      sameBoth.map((m) => m.name).join('، ') + '.',
      ''
    );
  }
  return lines.join('\n').trimEnd();
}

/** جدول التفعيلات المتاحة، مقسومًا على الأصلية وصور العجز. */
const FAMILY = {
  base: 'أصلية',
  mudhayyal: 'مذيَّلة — صورة عجز',
  maqsur: 'مقصورة — صورة عجز',
};
function tafaeelTable() {
  const rows = DATA.tafaeel.tafaeel.map((t) => {
    const base = t.baseOf ? ` — من \`${t.baseOf}\`` : '';
    return `| \`${t.id}\` | ${t.plain} | ${t.vocalized} | \`${t.syllables.join('')}\` | ${FAMILY[t.family] || FAMILY.base}${base} |`;
  });
  return [
    `${ar(DATA.tafaeel.tafaeel.length)} تفعيلة متاحة الآن:`,
    '',
    '| المعرّف | التفعيلة | مشكولةً | النمط | النوع |',
    '|---|---|---|---|---|',
    ...rows,
  ].join('\n');
}

/** يستبدل ما بين علامتَي GENERATED في ملف، ويعيد هل تغيّر. */
function apply(file, key, body) {
  const target = join(docs, file);
  const open = `<!-- GENERATED:${key} — لا تحرّر يدويًا -->`;
  const close = `<!-- /GENERATED:${key} -->`;
  const current = readFileSync(target, 'utf8');
  const a = current.indexOf(open);
  const b = current.indexOf(close);
  if (a === -1 || b === -1) {
    console.error(`✗ علامتا GENERATED:${key} مفقودتان في docs/${file}`);
    process.exit(1);
  }
  const next = current.slice(0, a) + `${open}\n\n${body}\n\n${close}`
    + current.slice(b + close.length);
  return { target, file, changed: next !== current, next };
}

const blocks = [
  apply('METERS.md', 'meters', `${summary()}\n\n### الجدول\n\n${table()}`),
  apply('ADDING-A-METER.md', 'tafaeel', tafaeelTable()),
];

if (process.argv.includes('--check')) {
  const stale = blocks.filter((b) => b.changed);
  if (stale.length) {
    console.error('✗ جداول التوثيق متأخّرة عن data/:');
    for (const b of stale) console.error('  • docs/' + b.file);
    console.error('  شغّل: node tools/build-meters-doc.js');
    process.exit(1);
  }
  console.log('✓ جداول التوثيق تطابق البيانات');
} else {
  for (const b of blocks) writeFileSync(b.target, b.next);
  console.log(`✓ التوثيق — ${ar(meters.length)} بحرًا، ${ar(DATA.tafaeel.tafaeel.length)} تفعيلة`);
}
