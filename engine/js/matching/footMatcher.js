/**
 * مطابقة تفعيلة واحدة على مخطّط المقاطع.
 *
 * تُجري محاذاة بأقل كلفة بين مسارات المخطّط ابتداءً من موضع معيّن،
 * وبين نمط مقطعي واحد (صورة تفعيلة). العمليات ثلاث:
 *
 *   محاذاة  — مقطع من البيت يقابل مقطعًا من التفعيلة (كلفتها صفر إن تطابقا)
 *   زيادة   — مقطع في البيت لا يقابله شيء في التفعيلة
 *   نقص     — مقطع في التفعيلة لا يقابله شيء في البيت
 *
 * ترجع لكل موضع نهاية ممكن أقلَّ كلفة وصلت به، مع سجلّ العمليات
 * حتى يُعرف **أي مقطع** اختلّ لا أن التفعيلة «مشتبهة» فحسب.
 */

/**
 * @param {{edges: Array<Array<{from:number,to:number,weight:string,meta:object}>>, size:number}} dag
 * @param {number} from موضع البداية في الوحدات
 * @param {string[]} pattern نمط الصورة المطلوبة، مثل ['L','L','S','L']
 * @param {object} scorer
 * @returns {Map<number, {cost:number, ops:object[], syllables:object[]}>}
 */
export function matchFoot(dag, from, pattern, scorer, cache) {
  return matchFootBoth(dag, from, pattern, scorer, undefined, cache).ends;
}

/**
 * ذاكرة محاذاة لتحليل واحد.
 *
 * محاذاة التفعيلة لا تعتمد إلا على (موضع البداية، نمط الصورة). وترتيب
 * البحور يُعيد الطلب نفسه آلاف المرّات: «مستفعلن» سالمةً تقع في عشرات
 * البحور، وتُطلَب من كل موضع في كل واحد منها. فحفظ الجواب مرّة واحدة
 * يُسقط أكثر من تسعة أعشار العمل.
 *
 * الذاكرة **لتحليل واحد لا أكثر**: مفاتيحها مواضعُ مخطّطٍ بعينه، فلا
 * تُشارَك بين نصّين. وهي محض تسريع — النتائج هي هي.
 */
export function createAlignmentCache() {
  return new Map();
}

/**
 * أقل كلفة لمطابقة **بادئة** من التفعيلة تنتهي عند وحدة بعينها.
 *
 * هذا ما تحتاجه الكتابة اللحظية: من كتب «البا» لم يكتب تفعيلة ناقصة
 * ولا مكسورة، بل كتب أوّلها ولمّا يتمّها. فالفرق بين «ما لم يُكتب بعد»
 * و«ما كُتب خطأً» فرقٌ في المعنى لا في الحساب، ولا يجوز أن تُحاسَب
 * الأولى حساب الثانية.
 *
 * تشترك مع `matchFoot` في المحاذاة نفسها حرفيًا — تقرأ من جدولها
 * مواضع `p < P` بدل `p === P` وحدها — فلا يمكن أن يفترق الحسابان.
 *
 * @param {number} at موضع الوحدة التي يجب أن تنتهي عندها البادئة
 *                    (آخر ما كُتب عادةً)
 * @returns {Map<number, {cost:number, ops:object[], syllables:object[]}>}
 *          مفتاحها عدد مقاطع التفعيلة التي تحقّقت
 */
export function matchFootPrefix(dag, from, pattern, scorer, at, cache) {
  return matchFootBoth(dag, from, pattern, scorer, at, cache).prefixes;
}

/**
 * المخرجان معًا من محاذاة واحدة: مواضع نهاية التفعيلة التامّة، وبادئاتها
 * المنتهية عند `at`.
 *
 * الكتابة اللحظية تحتاجهما في كل تفعيلة وعلى كل صورة، واستدعاؤهما
 * منفصلين كان يُجري المحاذاة نفسها مرّتين — وهي أسخن حلقة في المحرك.
 * الجدول واحد أصلًا، وإنما يُقرأ منه مرّة `p === P` ومرّة `p < P`،
 * فلا وجه لبنائه مرّتين.
 */
export function matchFootBoth(dag, from, pattern, scorer, at, cache) {
  let cacheKey;
  if (cache) {
    cacheKey = `${from}|${pattern.join('')}|${at === undefined ? '' : at}`;
    const hit = cache.get(cacheKey);
    if (hit) return hit;
  }

  const { dist, back, n, P } = runAlignment(dag, from, pattern, scorer);
  const key = (u, p) => u * (P + 1) + p;

  const ends = new Map();
  for (let u = from; u <= n; u++) {
    const c = dist.get(key(u, P));
    if (c === undefined) continue;
    ends.set(u, { cost: c, ...reconstruct(back, u, P, P, from) });
  }

  const prefixes = new Map();
  if (at !== undefined) {
    for (let p = 0; p < P; p++) {
      const c = dist.get(key(at, p));
      if (c === undefined) continue;
      prefixes.set(p, { cost: c, ...reconstruct(back, at, p, P, from) });
    }
  }
  const out = { ends, prefixes };
  if (cache) cache.set(cacheKey, out);
  return out;
}

function runAlignment(dag, from, pattern, scorer) {
  const n = dag.size;
  const P = pattern.length;
  const w = scorer.weights;
  const key = (u, p) => u * (P + 1) + p;

  const dist = new Map();
  const back = new Map();

  const relax = (u, p, cost, bp) => {
    const k = key(u, p);
    const cur = dist.get(k);
    if (cur === undefined || cost < cur - 1e-12) {
      dist.set(k, cost);
      back.set(k, bp);
    }
  };

  relax(from, 0, 0, null);

  // الحواف تتقدّم دائمًا بموضع الوحدات، والنقص يتقدّم بموضع النمط،
  // فترتيب (u تصاعديًا ثم p تصاعديًا) يكفي — لا حاجة لطابور أولوية.
  for (let u = from; u <= n; u++) {
    for (let p = 0; p <= P; p++) {
      const k = key(u, p);
      const c = dist.get(k);
      if (c === undefined) continue;

      if (p < P) {
        relax(u, p + 1, c + w.deletion, { op: 'delete', prev: [u, p], expected: pattern[p] });
      }

      const edges = dag.edges[u] || [];
      for (const e of edges) {
        if (p < P) {
          const sc = scorer.substitutionCost(e.weight, pattern[p]);
          relax(e.to, p + 1, c + sc, {
            op: sc === 0 ? 'match' : 'substitute',
            prev: [u, p], edge: e, expected: pattern[p], cost: sc,
          });
        }
        relax(e.to, p, c + w.insertion, { op: 'insert', prev: [u, p], edge: e });
      }
    }
  }

  return { dist, back, n, P };
}

function reconstruct(back, endU, endP, P, from) {
  const ops = [];
  let u = endU;
  let p = endP;
  while (!(u === from && p === 0)) {
    const bp = back.get(u * (P + 1) + p);
    if (!bp) break;
    ops.push(bp);
    [u, p] = bp.prev;
  }
  ops.reverse();
  const syllables = ops.filter((o) => o.edge).map((o) => o.edge);
  return { ops, syllables };
}

/**
 * أقل عدد مقاطع يلزم لاستهلاك ما بقي من الوحدات ابتداءً من كل موضع.
 * تُستعمل لتسعير ذيل البيت الذي لم تستوعبه تفعيلات البحر.
 */
export function minSyllablesToEnd(dag) {
  const n = dag.size;
  const best = new Array(n + 1).fill(Infinity);
  best[n] = 0;
  for (let u = n - 1; u >= 0; u--) {
    for (const e of dag.edges[u] || []) {
      if (best[e.to] + 1 < best[u]) best[u] = best[e.to] + 1;
    }
  }
  return best;
}
