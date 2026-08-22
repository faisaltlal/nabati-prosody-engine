/**
 * الكتابة العروضية حرفًا حرفًا.
 *
 * العروض يزن المنطوق لا المرسوم، والفرق بينهما كبير: اللام الشمسية لا
 * تُنطق، والمشدَّد حرفان، والتنوين نون، وحركة آخر الشطر تُشبَع فتصير
 * مدًّا يُكتب ولا يُرسم. فالحرف العروضي غير الحرف الإملائي.
 *
 * وكل حرف هنا إمّا متحرك وإمّا ساكن، فيقابله رمز واحد — ولذلك يصطفّ
 * النصّ مع رمزه حرفًا برمز: «ياماذكر» تحت `/0/0//0` تمامًا.
 *
 * الاشتقاق من صورة المقطع لا من نواته: المقطع المُشبَع آخر الشطر يبقى
 * مرسومًا `CV` وحركته قصيرة، ومع ذلك يتولّد عنه مدٌّ ساكن. والاعتماد
 * على النواة وحدها يُسقطه.
 */

/** حرف المدّ المقابل لكل حركة. */
export const MADD = { a: 'ا', i: 'ي', u: 'و' };

/**
 * @param {object[]} syllables مقاطع كما يخرجها `edgeToSyllable`
 * @param {object[]} [units] الوحدات الصوتية — منها يُعرف رسم الحرف الأصلي
 * @returns {Array<{ch:string, moving:boolean, role:string, syllable:number}>}
 */
export function prosodicLetters(syllables, units) {
  const out = [];
  const unitAt = (i) => (units && i !== undefined ? units[i] : undefined);

  syllables.forEach((s, si) => {
    const consumed = s.units || [];
    const shape = s.shape || (s.weight === 'S' ? 'CV' : s.weight === 'X' ? 'CVVC' : 'CVC');
    const hasMadd = shape === 'CVV' || shape === 'CVVC' || (!!s.ishbaa && !s.coda);
    const hasCoda = !!s.coda && (shape === 'CVC' || shape === 'CVVC');

    out.push({
      ch: s.onset, moving: true, syllable: si, role: 'onset',
      assumed: !!s.assumed, unit: unitAt(consumed[0]),
    });
    if (hasMadd) {
      out.push({
        ch: MADD[s.quality] || 'ا', moving: false, syllable: si, role: 'madd',
        quality: s.quality, ishbaa: !!s.ishbaa, assumed: !!s.assumed,
      });
    }
    if (hasCoda) {
      out.push({
        ch: s.coda, moving: false, syllable: si, role: 'coda',
        assumed: !!s.assumed, unit: unitAt(consumed[1]),
      });
    }
  });
  return out;
}

/**
 * يقسم حروف الشطر على تفعيلاته.
 *
 * التفعيلة لا تقف عند حدّ الكلمة — «ياماذكر» أولُها كلمتان وآخرها بعضُ
 * ثالثة. فعرضُ كلماتِ التفعيلة يُكرّر الكلمة الواحدة في تفعيلتين
 * ويُوهم أنها فيهما معًا. أمّا حروفها فتقع في واحدة لا غير، وتصطفّ مع
 * رمزها.
 *
 * @param {Array} letters ناتج `prosodicLetters`
 * @param {number[]} counts عدد مقاطع كل تفعيلة بالترتيب
 * @returns {string[]} نصّ كل تفعيلة
 */
export function splitLettersByFeet(letters, counts) {
  const out = [];
  let syllable = 0;
  for (const count of counts) {
    const from = syllable;
    const to = syllable + count;
    out.push(
      letters.filter((l) => l.syllable >= from && l.syllable < to).map((l) => l.ch).join('')
    );
    syllable = to;
  }
  return out;
}
