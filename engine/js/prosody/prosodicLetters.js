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
 * علامةُ مدٍّ محايدة، تُوضع مكان حرف المدّ حين تُجهل الحركة.
 *
 * إشباع آخر الشطر يُولّد مدًّا: ألفًا من الفتحة، وياءً من الكسرة،
 * وواوًا من الضمة. فإن كان الرويّ غير مشكول فالحركة مجهولة — ولا يجوز
 * أن يُخترع لها حرف. «تساهلته» كانت تخرج «تساهلتها» بألفٍ لا يعلمها
 * أحد، و«ومنزل» تخرج «ومنزلا» وصوابها «ومنزلي». فالمجهول تُوضع له
 * علامةُ الإطالة ويُعلَن أنه مزيد.
 */
export const NEUTRAL_MADD = '\u0640';

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
      const known = MADD[s.quality];
      out.push({
        ch: known || NEUTRAL_MADD, moving: false, syllable: si, role: 'madd',
        quality: s.quality, ishbaa: !!s.ishbaa,
        // حرفٌ في النطق لا في الرسم: مدُّ الإشباع. يُعلَن مزيدًا كي لا
        // يُحسَب على الشاعر حرفًا كتبه.
        added: !!s.ishbaa,
        assumed: !!s.assumed || !known,
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
  return groupLettersByFeet(letters, counts).map((g) => g.map((l) => l.ch).join(''));
}

/**
 * كسابقتها، غير أنها تُرجع الحروف أنفسها لا نصًّا.
 *
 * تلزم طبقةَ العرض لتميّز الحرف المزيد للإشباع مما كتبه الشاعر —
 * والنصّ وحده لا يميّزهما.
 */
export function groupLettersByFeet(letters, counts) {
  const out = [];
  let syllable = 0;
  for (const count of counts) {
    const from = syllable;
    const to = syllable + count;
    out.push(letters.filter((l) => l.syllable >= from && l.syllable < to));
    syllable = to;
  }
  return out;
}
