/**
 * اتّساق قراءة الكلمة داخل الشطر الواحد.
 *
 * الكلمة الواحدة لا تُنطق في الشطر الواحد نطقين. من كتب «مستفعلن
 * مستفعلن مستفعلن» فقد كتب كلمةً واحدة ثلاثًا، فقراءتها الثالثة
 * `مُسْ‑تَ‑فَعْ‑لُنْ` وقراءتاها الأوليان `مُسْ‑تَفْ‑عِ‑لُنْ` قراءةٌ لا
 * يقولها أحد — وإن كان كل واحد منهما مشروعًا وحده.
 *
 * ولهذا وزنٌ عملي: النصّ غير المشكول يحتمل قراءات كثيرة، فيتعادل عليه
 * بحور كثيرة تعادلًا تامًّا. وحين تتساوى الدرجات لا يبقى ما يرجّح إلا
 * ترتيبُ القائمة، وهو ترجيحٌ لا يدلّ على شيء. أمّا اتّساق القراءة
 * فدلالةٌ حقيقية: البحر الذي يقرأ الكلمة المكرّرة قراءةً واحدة أولى
 * من الذي يقلّبها.
 *
 * وهي **كلفة لا منع**: البيت الذي يوجب اختلاف القراءة يبقى مرشَّحًا،
 * وإنما ينزل عن نظيره المتّسق. فإن لم يوافق النصَّ إلا بحرٌ يقلّب
 * الكلمة، ظهر ذلك البحر ونزلت درجته وبان السبب.
 *
 * والكلمة الأخيرة لها حكم خاصّ لا استثناء تامّ: آخر الشطر يقع عليه
 * الإشباع وتجري عليه أحكام الوقف، فيجوز أن يختلف **مقطعها الأخير**
 * عن نظيره في الحشو. أمّا ما قبله فيلزمه الاتّساق كسائر الكلمات.
 */

/**
 * كم كلمةً قُرئت خلافًا لأخواتها المماثلة لها؟
 *
 * المقياس **الرسمُ** لا الصوامت: «مَفْعُولُنْ» و«مَفَاعِيلُنْ» صوامتهما
 * واحدة (م ف ع ل ن) لأن حروف المدّ تندمج في الحركات، وهما كلمتان
 * مختلفتان لا مثيلتان. فالمقارنة بالمكتوب بحركاته.
 *
 * @param {object[]} feet التفعيلات المختارة، لكل واحدة `ops`
 * @param {object[]} units الوحدات الصوتية
 * @param {object[]} words الكلمات كما كُتبت
 * @returns {number} عدد الكلمات الشاذّة عن قراءة مثيلاتها
 */
export function inconsistentWordReadings(feet, units, words) {
  if (!units || !units.length || !feet || !feet.length) return 0;
  if (!words || !words.length) return 0;

  // قراءة كل كلمة: تسلسل أوزان مقاطعها. والمقطع يُنسب إلى كلمة فاتحته،
  // لأن التفعيلة قد تتجاوز حدّ الكلمة والمقطع لا يتجاوزه إلا بساكن.
  const readings = new Map();
  for (const foot of feet) {
    for (const op of foot.ops || []) {
      if (!op.edge) continue;
      const consumed = op.edge.meta && op.edge.meta.consumed;
      const first = consumed && consumed.length ? consumed[0] : undefined;
      const unit = first === undefined ? undefined : units[first];
      if (!unit) continue;
      if (!readings.has(unit.word)) readings.set(unit.word, '');
      readings.set(unit.word, readings.get(unit.word) + op.edge.weight);
    }
  }
  if (readings.size < 2) return 0;

  const lastWord = units[units.length - 1].word;

  // تُجمع الكلمات المتماثلة رسمًا، ويُنظر أتّفقت قراءاتها أم اختلفت.
  const groups = new Map();
  for (const [wordIndex, reading] of readings) {
    const key = words[wordIndex] && words[wordIndex].text;
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({ reading, isLast: wordIndex === lastWord });
  }

  let odd = 0;
  for (const list of groups.values()) {
    if (list.length < 2) continue;

    // القراءة السائدة تُؤخذ من كلمات الحشو، فهي التي لا عارض لها.
    const inner = list.filter((x) => !x.isLast);
    const counts = new Map();
    for (const x of inner) counts.set(x.reading, (counts.get(x.reading) || 0) + 1);
    let majority = null;
    let commonest = 0;
    for (const [r, n] of counts) if (n > commonest) { commonest = n; majority = r; }
    if (majority === null) continue; // كلها في آخر الشطر: لا سائد يُقاس عليه

    odd += inner.length - commonest;

    // آخر الشطر يُقاس بما قبل مقطعه الأخير وحده.
    for (const x of list) {
      if (!x.isLast) continue;
      const sameButFinal =
        x.reading.length === majority.length &&
        x.reading.slice(0, -1) === majority.slice(0, -1);
      if (x.reading !== majority && !sameButFinal) odd += 1;
    }
  }
  return odd;
}
