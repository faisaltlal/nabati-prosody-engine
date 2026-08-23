/**
 * SyllableParser — بناء المقاطع.
 *
 * لا نُخرج سلسلة مقاطع واحدة، بل **مخطّطًا موجّهًا** (DAG) عقده مواضع
 * الوحدات وحوافه المقاطع الممكنة. السبب:
 *
 *   نصّ مشكول  → للمخطّط مسار واحد، فالتقطيع قاطع.
 *   نصّ مجرّد   → للمخطّط مسارات، وكلها قراءات مشروعة لغويًا.
 *
 * وهكذا يعمل النوعان بمسار كود واحد: المطابقة تسأل «هل في المخطّط
 * مسار يوافق هذا الوزن؟» بدل أن نخمّن تشكيلًا ثم نقيس عليه.
 *
 * بنية المقطع العربي (لا رابع لها):
 *   CV    صامت + حركة قصيرة            → قصير (S)
 *   CVV   صامت + حركة طويلة            → طويل (L)
 *   CVC   صامت + قصيرة + ساكن          → طويل (L)
 *   CVVC  صامت + طويلة + ساكن          → مفرط (X) — آخر الشطر فقط
 */

/** @typedef {{from:number,to:number,weight:'S'|'L'|'X',meta:object}} Edge */

const SHORT = 'S';
const LONG = 'L';
const OVERLONG = 'X';

function nucleusOptions(unit) {
  const v = unit.vowel;

  // ساكنٌ يليه همزةٌ تسقط في الوصل: له قراءتان — يبقى ساكنًا فتُنطق
  // الهمزة، أو يبتلعها فيأخذ حركتها. تُعرضان معًا ويحسم الوزن.
  const absorbing = unit.absorbsNextIfShort
    ? [{ kind: 'short', quality: null, assumed: true, absorbsNext: true }]
    : [];

  if (v.known) {
    if (v.length === 'none') return absorbing;
    if (v.length === 'long') return [{ kind: 'long', quality: v.quality }, ...absorbing];
    return [{ kind: 'short', quality: v.quality }, ...absorbing];
  }
  const out = [...absorbing];
  if (v.options.includes('short')) out.push({ kind: 'short', quality: null, assumed: true });
  if (v.options.includes('long')) {
    out.push({ kind: 'long', quality: v.longQuality || null, assumed: true, suppressesNext: true });
  }
  return out;
}

/** هل تصلح هذه الوحدة ساكنًا يغلق المقطع؟ */
function canBeCoda(unit) {
  const v = unit.vowel;
  if (v.known) return v.length === 'none';
  return v.options.includes('none');
}

/**
 * هل يجوز أن يغلق هذا الساكن مقطعًا فاتحته في كلمة أخرى؟
 *
 * الأصل أن الساكن يبقى في كلمته، لأن كل كلمة عربية تبدأ بمتحرك.
 * الاستثناء الوحيد: كلمة سقطت همزة وصلها فبدأت بساكن — وهذا هو
 * الوصل نفسه: «في البيت» تُنطق فِلْ‑بَيْت، فلام «أل» تغلق مقطع «في».
 * وهذا الساكن لا يكون إلا معلومَ السكون، لأننا لا نُسقط همزة وصل
 * إلا حين نتيقّن منها.
 */
function codaAllowed(onset, coda, isWordInitial) {
  if (coda.word === onset.word) return true;
  return isWordInitial && coda.vowel.known && coda.vowel.length === 'none';
}

import { relaxWrittenSukun } from '../phonology/phonemizer.js';

/**
 * @param {object[]} units
 * @param {{ ishbaa?: boolean }} [options]
 * @returns {{ edges: Edge[][], size:number, assumedVocalization:boolean }}
 */
export function buildSyllableDag(units, options = {}) {
  const ishbaa = options.ishbaa !== false;
  const n = units.length;
  const edges = Array.from({ length: n + 1 }, () => []);
  let assumed = false;

  const add = (from, to, weight, meta) => {
    edges[from].push({ from, to, weight, meta });
  };

  // أول وحدة في كل كلمة — يلزم لمعرفة الساكن الذي سقطت همزة وصله.
  const startsWord = units.map((u, k) => k === 0 || units[k - 1].word !== u.word);

  for (let i = 0; i < n; i++) {
    const onset = units[i];
    for (const nuc of nucleusOptions(onset)) {
      if (nuc.assumed) assumed = true;
      // الواو/الياء التي احتُسبت حرف مدّ لا تعود وحدةً مستقلة.
      // وكذلك الهمزة الساقطة في الوصل: إن تحرّك الساكن قبلها فقد أخذ
      // حركتها، فهي مستهلَكة معه ولا تعود وحدةً.
      const absorbsHamza = !!nuc.absorbsNext;
      const afterNucleus =
        (nuc.kind === 'long' && onset.suppressNextIfLong && nuc.suppressesNext) || absorbsHamza
          ? i + 2
          : i + 1;
      if (afterNucleus > n) continue;

      const base = {
        onsetIndex: i,
        onset: onset.c,
        nucleus: nuc.kind,
        quality: nuc.quality,
        assumed: !!nuc.assumed,
        consumed: absorbsHamza ? [i, i + 1] : [i],
        elidedHamza: absorbsHamza || undefined,
      };

      // مقطع مفتوح
      add(i, afterNucleus, nuc.kind === 'long' ? LONG : SHORT, { ...base, shape: nuc.kind === 'long' ? 'CVV' : 'CV' });

      // مقطع مغلق: ساكنٌ يغلقه. والساكن إمّا التالي مباشرة، وإمّا
      // التالي لهمزةٍ سقطت في الدرج (انظر «وصل الهمزة» أدناه).
      const addClosed = (codaIndex, coda, extra) => {
        const withCoda = {
          ...base,
          ...extra,
          coda: coda.c,
          consumed: [i, codaIndex],
          codaAssumed: !coda.vowel.known,
        };
        if (!coda.vowel.known) assumed = true;
        const to = codaIndex + 1;

        if (nuc.kind === 'short') {
          add(i, to, LONG, { ...withCoda, shape: 'CVC' });
        } else if (to === n) {
          // آخر الشطر: التقاء الساكنين جائز هنا، فيثبت المدّ ويبقى
          // المقطع مفرطًا. ولا تُضاف قراءة مقصورة، لأن القصر إنما هو
          // فرارٌ من التقاء ساكنين ممنوع — وهو هنا مأذون فيه.
          add(i, to, OVERLONG, { ...withCoda, shape: 'CVVC' });
        } else {
          // وسط الشطر: التقاء الساكنين ممنوع، فيسقط حرف المدّ حتمًا
          // ويقصر المقطع (في البيت ← فِلْ‑بَيْت). قاعدة مقرَّرة لا تخمين.
          add(i, to, LONG, {
            ...withCoda,
            shape: 'CVC',
            shortenedLongVowel: true,
            rule: withCoda.rule ? `${withCoda.rule} ثم التقاء الساكنين` : 'التقاء الساكنين',
          });
        }
      };

      const coda = units[afterNucleus];
      if (coda && canBeCoda(coda) && codaAllowed(onset, coda, startsWord[afterNucleus])) {
        addClosed(afterNucleus, coda);
      }

      // ---- وصل الهمزة ----
      //
      // الألف المجرّدة في أول الكلمة رسمُ همزة الوصل، وهمزة الوصل
      // تسقط في الدرج إجماعًا: «قال الحق» تُنطق قَـلَـلْـحَـقّ. وإذا
      // سقطت بقي ما بعدها ساكنًا لا يبتدأ به، فيلحق بالمقطع قبله
      // قفلًا له، ويقصر المدّ إن كان — «إلّا انت» ← إِلْـلَـنْـتَ.
      //
      // والرسم النبطي يُغفل رأس الهمزة كثيرًا، فلا يُقطع بأنها وصل.
      // ولذلك تُضاف هذه قراءةً ثانية لا بديلًا: القراءة الفصيحة
      // (الهمزة منطوقة) باقية في المخطّط، والوزن هو الذي يحسم.
      const bridge = coda;
      if (bridge && bridge.wordInitial && bridge.elidable) {
        const after = units[afterNucleus + 1];
        if (after && after.word === bridge.word && canBeCoda(after)) {
          addClosed(afterNucleus + 1, after, {
            elidedHamza: true,
            elidedIndex: afterNucleus,
            rule: 'وصل الهمزة',
          });
        }
      }
    }
  }

  // الإشباع: آخر الشطر لا يقع عليه متحرك، فتُشبَع حركة الروي فيصير
  // المقطع طويلًا. نضيفها قراءةً موازية بلا كلفة بدل أن نفرضها، لأن
  // بعض الأضرب تنتهي بمقطع قصير في التدوين المصدري.
  if (ishbaa) {
    const terminalShort = [];
    for (const group of edges) {
      for (const e of group) {
        if (e.to === n && e.weight === SHORT) terminalShort.push(e);
      }
    }
    for (const e of terminalShort) {
      add(e.from, n, LONG, { ...e.meta, ishbaa: true, rule: 'إشباع حركة الروي' });
    }
  }

  return { edges, size: n, assumedVocalization: assumed };
}

/**
 * هل في المخطّط مسار كامل من أوله إلى آخره؟
 *
 * قد لا يكون: تشكيلٌ يجمع ساكنَين لا يقبل تقطيعًا أصلًا («ذكْرْتك»)،
 * لأن المقطع لا يبدأ بساكن. والمخطّط حينها فارغ من المسارات، فتخرج
 * الشاشة بيضاء بلا خبر — وهذا أسوأ ما يقع في واجهةٍ تُحلّل عند كل
 * ضغطة مفتاح.
 */
export function hasCompletePath(dag) {
  const n = dag.size;
  if (n === 0) return false;
  const reach = new Array(n + 1).fill(false);
  reach[n] = true;
  for (let u = n - 1; u >= 0; u--) {
    for (const e of dag.edges[u] || []) {
      if (reach[e.to]) { reach[u] = true; break; }
    }
  }
  return reach[0];
}

/**
 * يبني مخطّطًا **قابلًا للقراءة** دائمًا.
 *
 * إن كان التشكيل المكتوب لا يقبل تقطيعًا البتّة، أُرخيت سكوناتُ
 * الكاتب وأُعيد البناء، وأُعلن ذلك في `relaxed`. فلا تخرج الشاشة
 * بيضاء، ولا يُدَّعى في الوقت نفسه أن النصّ قُرئ كما كُتب.
 *
 * @returns {{dag:object, units:object[], relaxed:number, readable:boolean}}
 */
export function buildReadableDag(units, options = {}) {
  const dag = buildSyllableDag(units, options);
  if (hasCompletePath(dag)) return { dag, units, relaxed: 0, readable: true };

  const { units: relaxedUnits, relaxed } = relaxWrittenSukun(units);
  const retry = buildSyllableDag(relaxedUnits, options);
  if (hasCompletePath(retry)) {
    return { dag: retry, units: relaxedUnits, relaxed, readable: true };
  }
  // لا مسار حتى بعد الإرخاء — يُرجَع الأصل ويُعلَن أنه غير مقروء.
  return { dag, units, relaxed: 0, readable: false };
}

/** كل المسارات الكاملة عبر المخطّط، بسقف يمنع الانفجار. */
export function enumeratePaths(dag, limit = 2000) {
  const results = [];
  let truncated = false;

  const walk = (node, acc) => {
    if (results.length >= limit) { truncated = true; return; }
    if (node === dag.size) { results.push([...acc]); return; }
    for (const e of dag.edges[node]) {
      acc.push(e);
      walk(e.to, acc);
      acc.pop();
      if (results.length >= limit) { truncated = true; return; }
    }
  };

  walk(0, []);
  return { paths: results, truncated };
}

/**
 * التقطيع الحرّ: يُستعمل حين يكفي النصّ نفسه لتحديد المقاطع، أي حين
 * لا يوجد في المخطّط إلا قراءة واحدة (بعد طيّ فروق الإشباع).
 */
export function freeSyllabify(dag) {
  const { paths, truncated } = enumeratePaths(dag, 64);
  if (truncated || paths.length === 0) {
    return { certain: false, syllables: [], pathCount: truncated ? '64+' : 0 };
  }
  // نطوي الفروق التي لا تغيّر النمط، فإن بقي نمط واحد فالتقطيع قاطع.
  const patterns = new Set(paths.map((p) => p.map((e) => e.weight).join('')));
  const preferred = paths.slice().sort((a, b) => {
    const ish = (p) => (p[p.length - 1]?.meta.ishbaa ? 0 : 1);
    return ish(a) - ish(b) || a.length - b.length;
  })[0];
  return {
    certain: patterns.size === 1,
    variants: patterns.size,
    syllables: preferred.map(edgeToSyllable),
    pathCount: paths.length,
  };
}

export function edgeToSyllable(e) {
  return {
    weight: e.weight,
    shape: e.meta.shape,
    onset: e.meta.onset,
    nucleus: e.meta.nucleus,
    // حركة النواة: منها يُعرف حرف المدّ — ألفٌ من الفتحة وياءٌ من
    // الكسرة وواوٌ من الضمة. تحليل القافية لا يقوم بدونها.
    quality: e.meta.quality,
    coda: e.meta.coda || null,
    assumed: !!e.meta.assumed || !!e.meta.codaAssumed,
    rule: e.meta.rule || null,
    ishbaa: !!e.meta.ishbaa,
    units: e.meta.consumed,
  };
}

export { SHORT, LONG, OVERLONG };
