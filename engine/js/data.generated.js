// مولَّد آليًا من data/*.json — لا تحرّره يدويًا.
// أعِد التوليد بـ: node tools/bundle-data.js
export const DATA = {
  "tafaeel": {
    "description": "التفعيلات. كل تفعيلة معرَّفة بنمطها المقطعي (S=مقطع قصير CV، L=مقطع طويل CVC أو CVV، X=مقطع مفرط CVVC) وبنمطها الحرفي الخليلي (1=متحرك، 0=ساكن). النمطان مشتقّان من نطق التفعيلة نفسها، ومُتحقَّق من تطابقهما آليًا في tests/meters.test.js.",
    "legend": {
      "syllables": {
        "S": "مقطع قصير — صامت + حركة قصيرة (CV)",
        "L": "مقطع طويل — CVC أو CVV",
        "X": "مقطع مفرط الطول — CVVC، ولا يقع إلا في آخر الشطر"
      },
      "khalilLetters": {
        "0": "ساكن",
        "1": "متحرك"
      },
      "family": {
        "base": "تفعيلة أصلية",
        "mudhayyal": "تفعيلة مذيَّلة — زِيدَ عليها ساكن في آخر الشطر، وهي صورة العجز في هذه القاعدة",
        "maqsur": "تفعيلة محذوف آخرها"
      }
    },
    "tafaeel": [
      {
        "id": "faulun",
        "plain": "فعولن",
        "vocalized": "فَعُولُنْ",
        "syllables": [
          "S",
          "L",
          "L"
        ],
        "khalilLetters": "11010",
        "family": "base"
      },
      {
        "id": "failun",
        "plain": "فاعلن",
        "vocalized": "فَاعِلُنْ",
        "syllables": [
          "L",
          "S",
          "L"
        ],
        "khalilLetters": "10110",
        "family": "base"
      },
      {
        "id": "mafailun",
        "plain": "مفاعيلن",
        "vocalized": "مَفَاعِيلُنْ",
        "syllables": [
          "S",
          "L",
          "L",
          "L"
        ],
        "khalilLetters": "1101010",
        "family": "base"
      },
      {
        "id": "mustafilun",
        "plain": "مستفعلن",
        "vocalized": "مُسْتَفْعِلُنْ",
        "syllables": [
          "L",
          "L",
          "S",
          "L"
        ],
        "khalilLetters": "1010110",
        "family": "base"
      },
      {
        "id": "failatun",
        "plain": "فاعلاتن",
        "vocalized": "فَاعِلَاتُنْ",
        "syllables": [
          "L",
          "S",
          "L",
          "L"
        ],
        "khalilLetters": "1011010",
        "family": "base"
      },
      {
        "id": "mafulun",
        "plain": "مفعولن",
        "vocalized": "مَفْعُولُنْ",
        "syllables": [
          "L",
          "L",
          "L"
        ],
        "khalilLetters": "101010",
        "family": "base"
      },
      {
        "id": "faalun",
        "plain": "فعلن",
        "vocalized": "فَعْلُنْ",
        "syllables": [
          "L",
          "L"
        ],
        "khalilLetters": "1010",
        "family": "base",
        "note": "القراءة الثانية لرسم «فعلن»."
      },
      {
        "id": "faal",
        "plain": "فعل",
        "vocalized": "فَعَلْ",
        "syllables": [
          "S",
          "L"
        ],
        "khalilLetters": "110",
        "family": "maqsur"
      },
      {
        "id": "faa",
        "plain": "فع",
        "vocalized": "فَعْ",
        "syllables": [
          "L"
        ],
        "khalilLetters": "10",
        "family": "maqsur"
      },
      {
        "id": "maful",
        "plain": "مفعول",
        "vocalized": "مَفْعُولْ",
        "syllables": [
          "L",
          "X"
        ],
        "khalilLetters": "10100",
        "family": "maqsur"
      },
      {
        "id": "mustafilatun",
        "plain": "مستفعلاتن",
        "vocalized": "مُسْتَفْعِلَاتُنْ",
        "syllables": [
          "L",
          "L",
          "S",
          "L",
          "L"
        ],
        "khalilLetters": "101011010",
        "family": "base"
      },
      {
        "id": "failatan",
        "plain": "فاعلاتان",
        "vocalized": "فَاعِلَاتَانْ",
        "syllables": [
          "L",
          "S",
          "L",
          "X"
        ],
        "khalilLetters": "10110100",
        "family": "mudhayyal",
        "baseOf": "failatun"
      },
      {
        "id": "mustafilan",
        "plain": "مستفعلان",
        "vocalized": "مُسْتَفْعِلَانْ",
        "syllables": [
          "L",
          "L",
          "S",
          "X"
        ],
        "khalilLetters": "10101100",
        "family": "mudhayyal",
        "baseOf": "mustafilun"
      },
      {
        "id": "mafailan",
        "plain": "مفاعيلان",
        "vocalized": "مَفَاعِيلَانْ",
        "syllables": [
          "S",
          "L",
          "L",
          "X"
        ],
        "khalilLetters": "11010100",
        "family": "mudhayyal",
        "baseOf": "mafailun"
      },
      {
        "id": "faulan",
        "plain": "فعولان",
        "vocalized": "فَعُولَانْ",
        "syllables": [
          "S",
          "L",
          "X"
        ],
        "khalilLetters": "110100",
        "family": "mudhayyal",
        "baseOf": "faulun"
      },
      {
        "id": "failan",
        "plain": "فاعلان",
        "vocalized": "فَاعِلَانْ",
        "syllables": [
          "L",
          "S",
          "X"
        ],
        "khalilLetters": "101100",
        "family": "mudhayyal",
        "baseOf": "failun"
      },
      {
        "id": "mafulan",
        "plain": "مفعولان",
        "vocalized": "مَفْعُولَانْ",
        "syllables": [
          "L",
          "L",
          "X"
        ],
        "khalilLetters": "1010100",
        "family": "mudhayyal",
        "baseOf": "mafulun"
      },
      {
        "id": "failat",
        "plain": "فاعلات",
        "vocalized": "فَاعِلَاتْ",
        "syllables": [
          "L",
          "S",
          "X"
        ],
        "khalilLetters": "101100",
        "family": "maqsur",
        "note": "محذوفة من فاعلاتن لا مذيَّلة عنها: فاعلاتن أربعة مقاطع وهذه ثلاثة. تنتهي بمقطع مفرط لأنها صيغة عجز، ونمطها يطابق «فاعلان» — والاسمان مختلفان في المصدر فحُفظا كما وردا."
      },
      {
        "id": "failan_short",
        "plain": "فعلان",
        "vocalized": "فَعْلَانْ",
        "syllables": [
          "L",
          "X"
        ],
        "khalilLetters": "10100",
        "family": "mudhayyal",
        "baseOf": "faalun",
        "note": "تسبيغ «فعلن». ولمّا كانت «فعلن» فَعْلُنْ (/0/0) كانت مزيدتُها فَعْلَانْ (/0/00) لا فَعِلَانْ. ويشهد له عجز «الرجز - طرق 1»: صدره «… فعلن» وعجزه «… مفعول» — ومفعول تسبيغُ فَعْلُنْ."
      }
    ]
  },
  "variations": {
    "description": "الزحافات والعلل المسموحة لكل تفعيلة. الزحاف يدخل الحشو والعروض والضرب (scope=any)؛ العلة لا تدخل إلا العروض والضرب (scope=arud_darb). التكلفة الفعلية تأتي من scoring.json حسب kind و severity — لا أرقام مبعثرة هنا.",
    "legend": {
      "kind": {
        "salim": "التفعيلة تامة",
        "zihaf": "زحاف — تغيير في الأسباب، جائز في الحشو",
        "illa": "علة — لازمة في العروض والضرب وحدهما",
        "ambiguous_reading": "قراءتان مشروعتان لرسم واحد غير مشكول — ليست عيبًا"
      },
      "scope": {
        "any": "الحشو والعروض والضرب",
        "arud_darb": "العروض والضرب فقط"
      },
      "severity": {
        "1": "شائع",
        "2": "نادر أو ثقيل"
      }
    },
    "policy": "التفاعيل المذيَّلة والمقصورة لها الصورة السالمة وحدها: زحافاتها غير مسجَّلة في المادة المصدرية، واختراعها يخالف مبدأ عدم ابتكار ما لم يثبت. وهي أصلًا صور عجز، والعلة لا تجتمع مع علة.",
    "variations": {
      "faulun": [
        {
          "id": "salim",
          "name": "سالم",
          "result": "فَعُولُنْ",
          "syllables": [
            "S",
            "L",
            "L"
          ],
          "kind": "salim",
          "scope": "any",
          "severity": 1
        },
        {
          "id": "qabd",
          "name": "القبض",
          "result": "فَعُولُ",
          "syllables": [
            "S",
            "L",
            "S"
          ],
          "kind": "zihaf",
          "scope": "any",
          "severity": 1
        },
        {
          "id": "hadhf",
          "name": "الحذف",
          "result": "فَعَلْ",
          "syllables": [
            "S",
            "L"
          ],
          "kind": "illa",
          "scope": "arud_darb",
          "severity": 1,
          "beforeTransfer": "فَعُو",
          "note": "كانت مكتوبة «فَعُولْ» وهي أربعة أحرف ونمطها SX — وذلك القصرُ لا الحذف. والمصرَّح به SL، وهو ما تعمل عليه المطابقة. فصُحّح الرسم ليوافق النمط والاسم: الحذف يُسقط السبب الخفيف «لن» فيبقى «فَعُو»، ويُنقل إلى «فَعَلْ»."
        },
        {
          "id": "tasbeegh",
          "name": "التسبيغ",
          "result": "فَعُولَانْ",
          "syllables": [
            "S",
            "L",
            "X"
          ],
          "kind": "illa",
          "scope": "arud_darb",
          "severity": 1
        }
      ],
      "failun": [
        {
          "id": "salim",
          "name": "سالم",
          "result": "فَاعِلُنْ",
          "syllables": [
            "L",
            "S",
            "L"
          ],
          "kind": "salim",
          "scope": "any",
          "severity": 1
        },
        {
          "id": "khabn",
          "name": "الخبن",
          "result": "فَعِلُنْ",
          "syllables": [
            "S",
            "S",
            "L"
          ],
          "kind": "zihaf",
          "scope": "any",
          "severity": 1
        },
        {
          "id": "qat",
          "name": "القطع",
          "result": "فَعْلُنْ",
          "syllables": [
            "L",
            "L"
          ],
          "kind": "illa",
          "scope": "arud_darb",
          "severity": 1,
          "beforeTransfer": "فَاعِلْ"
        },
        {
          "id": "tadhyil",
          "name": "التذييل",
          "result": "فَاعِلَانْ",
          "syllables": [
            "L",
            "S",
            "X"
          ],
          "kind": "illa",
          "scope": "arud_darb",
          "severity": 1
        },
        {
          "id": "tarfeel",
          "name": "الترفيل",
          "result": "فَاعِلَاتُنْ",
          "syllables": [
            "L",
            "S",
            "L",
            "L"
          ],
          "kind": "illa",
          "scope": "arud_darb",
          "severity": 1,
          "enabled": false,
          "status": "NEEDS_VALIDATION",
          "validation": {
            "issue": "الترفيل علّة فصيحة مقرَّرة (زيادة سبب خفيف على ما آخره وتد مجموع)، ووردت في المادة التي قدّمها المستخدم. لكنه نبّه في الموضع نفسه أن علل الفصيح لا تُعامل في النبطي بالطريقة نفسها، فلم تُفعَّل.",
            "measured": "قيست قبل التعطيل: لا تغيّر شيئًا في القاعدة الحالية. ٧٢ نصًّا — صيغ البحور الأربع والستون مشكولةً ومجرّدة، وأبيات نبطية حقيقية — لم يختلف فيها بحرٌ ولا درجة. والسبب أنها مقصورة على العروض والضرب وتكلّف كلفة علّة، فلا تسبق مطابقةً تامّة.",
            "resolvedBy": [
              "بيت نبطي حقيقي وزنه على فاعلن مُرفَّلة، أي يقع في ضربه فاعلاتن حيث يطلب البحر فاعلن",
              "أو تصريح بأن الترفيل غير جارٍ في النبطي فتُحذف"
            ]
          }
        }
      ],
      "mafailun": [
        {
          "id": "salim",
          "name": "سالم",
          "result": "مَفَاعِيلُنْ",
          "syllables": [
            "S",
            "L",
            "L",
            "L"
          ],
          "kind": "salim",
          "scope": "any",
          "severity": 1
        },
        {
          "id": "qabd",
          "name": "القبض",
          "result": "مَفَاعِلُنْ",
          "syllables": [
            "S",
            "L",
            "S",
            "L"
          ],
          "kind": "zihaf",
          "scope": "any",
          "severity": 1
        },
        {
          "id": "kaff",
          "name": "الكف",
          "result": "مَفَاعِيلُ",
          "syllables": [
            "S",
            "L",
            "L",
            "S"
          ],
          "kind": "zihaf",
          "scope": "any",
          "severity": 1
        },
        {
          "id": "hadhf",
          "name": "الحذف",
          "result": "فَعُولُنْ",
          "syllables": [
            "S",
            "L",
            "L"
          ],
          "kind": "illa",
          "scope": "arud_darb",
          "severity": 1
        },
        {
          "id": "tasbeegh",
          "name": "التسبيغ",
          "result": "مَفَاعِيلَانْ",
          "syllables": [
            "S",
            "L",
            "L",
            "X"
          ],
          "kind": "illa",
          "scope": "arud_darb",
          "severity": 1
        }
      ],
      "mustafilun": [
        {
          "id": "salim",
          "name": "سالم",
          "result": "مُسْتَفْعِلُنْ",
          "syllables": [
            "L",
            "L",
            "S",
            "L"
          ],
          "kind": "salim",
          "scope": "any",
          "severity": 1
        },
        {
          "id": "khabn",
          "name": "الخبن",
          "result": "مَفَاعِلُنْ",
          "syllables": [
            "S",
            "L",
            "S",
            "L"
          ],
          "kind": "zihaf",
          "scope": "any",
          "severity": 1,
          "beforeTransfer": "مُتَفْعِلُنْ",
          "note": "الصورتان واحدة وزنًا (//0//0). و«مفاعلن» هي المعتمدة في النبطي وأشهر من «متفعلن»، بتقرير صاحب المادة. و«متفعلن» محفوظة صورةً قبل النقل لأنها أدلّ على الزحاف: الثاني الساكن هو سين «مستفعلن»."
        },
        {
          "id": "tayy",
          "name": "الطي",
          "result": "مُسْتَعِلُنْ",
          "syllables": [
            "L",
            "S",
            "S",
            "L"
          ],
          "kind": "zihaf",
          "scope": "any",
          "severity": 1
        },
        {
          "id": "khabl",
          "name": "الخبل",
          "result": "مُتَعِلُنْ",
          "syllables": [
            "S",
            "S",
            "S",
            "L"
          ],
          "kind": "zihaf",
          "scope": "any",
          "severity": 2
        },
        {
          "id": "qat",
          "name": "القطع",
          "result": "مَفْعُولُنْ",
          "syllables": [
            "L",
            "L",
            "L"
          ],
          "kind": "illa",
          "scope": "arud_darb",
          "severity": 1,
          "beforeTransfer": "مُسْتَفْعِلْ"
        },
        {
          "id": "tadhyil",
          "name": "التذييل",
          "result": "مُسْتَفْعِلَانْ",
          "syllables": [
            "L",
            "L",
            "S",
            "X"
          ],
          "kind": "illa",
          "scope": "arud_darb",
          "severity": 1
        }
      ],
      "failatun": [
        {
          "id": "salim",
          "name": "سالم",
          "result": "فَاعِلَاتُنْ",
          "syllables": [
            "L",
            "S",
            "L",
            "L"
          ],
          "kind": "salim",
          "scope": "any",
          "severity": 1
        },
        {
          "id": "khabn",
          "name": "الخبن",
          "result": "فَعِلَاتُنْ",
          "syllables": [
            "S",
            "S",
            "L",
            "L"
          ],
          "kind": "zihaf",
          "scope": "any",
          "severity": 1
        },
        {
          "id": "kaff",
          "name": "الكف",
          "result": "فَاعِلَاتُ",
          "syllables": [
            "L",
            "S",
            "L",
            "S"
          ],
          "kind": "zihaf",
          "scope": "any",
          "severity": 1
        },
        {
          "id": "shakl",
          "name": "الشكل",
          "result": "فَعِلَاتُ",
          "syllables": [
            "S",
            "S",
            "L",
            "S"
          ],
          "kind": "zihaf",
          "scope": "any",
          "severity": 2
        },
        {
          "id": "hadhf",
          "name": "الحذف",
          "result": "فَاعِلُنْ",
          "syllables": [
            "L",
            "S",
            "L"
          ],
          "kind": "illa",
          "scope": "arud_darb",
          "severity": 1
        },
        {
          "id": "tashith",
          "name": "التشعيث",
          "result": "مَفْعُولُنْ",
          "syllables": [
            "L",
            "L",
            "L"
          ],
          "kind": "illa",
          "scope": "arud_darb",
          "severity": 1
        },
        {
          "id": "tasbeegh",
          "name": "التسبيغ",
          "result": "فَاعِلَاتَانْ",
          "syllables": [
            "L",
            "S",
            "L",
            "X"
          ],
          "kind": "illa",
          "scope": "arud_darb",
          "severity": 1
        }
      ],
      "mafulun": [
        {
          "id": "salim",
          "name": "سالم",
          "result": "مَفْعُولُنْ",
          "syllables": [
            "L",
            "L",
            "L"
          ],
          "kind": "salim",
          "scope": "any",
          "severity": 1
        },
        {
          "id": "tasbeegh",
          "name": "التسبيغ",
          "result": "مَفْعُولَانْ",
          "syllables": [
            "L",
            "L",
            "X"
          ],
          "kind": "illa",
          "scope": "arud_darb",
          "severity": 1
        }
      ],
      "faalun": [
        {
          "id": "salim",
          "name": "سالم",
          "result": "فَعْلُنْ",
          "syllables": [
            "L",
            "L"
          ],
          "kind": "salim",
          "scope": "any",
          "severity": 1
        }
      ],
      "faal": [
        {
          "id": "salim",
          "name": "سالم",
          "result": "فَعَلْ",
          "syllables": [
            "S",
            "L"
          ],
          "kind": "salim",
          "scope": "any",
          "severity": 1
        }
      ],
      "faa": [
        {
          "id": "salim",
          "name": "سالم",
          "result": "فَعْ",
          "syllables": [
            "L"
          ],
          "kind": "salim",
          "scope": "any",
          "severity": 1
        }
      ],
      "maful": [
        {
          "id": "salim",
          "name": "سالم",
          "result": "مَفْعُولْ",
          "syllables": [
            "L",
            "X"
          ],
          "kind": "salim",
          "scope": "any",
          "severity": 1
        }
      ],
      "mustafilatun": [
        {
          "id": "salim",
          "name": "سالم",
          "result": "مُسْتَفْعِلَاتُنْ",
          "syllables": [
            "L",
            "L",
            "S",
            "L",
            "L"
          ],
          "kind": "salim",
          "scope": "any",
          "severity": 1
        }
      ],
      "failatan": [
        {
          "id": "salim",
          "name": "سالم",
          "result": "فَاعِلَاتَانْ",
          "syllables": [
            "L",
            "S",
            "L",
            "X"
          ],
          "kind": "salim",
          "scope": "any",
          "severity": 1
        }
      ],
      "mustafilan": [
        {
          "id": "salim",
          "name": "سالم",
          "result": "مُسْتَفْعِلَانْ",
          "syllables": [
            "L",
            "L",
            "S",
            "X"
          ],
          "kind": "salim",
          "scope": "any",
          "severity": 1
        }
      ],
      "mafailan": [
        {
          "id": "salim",
          "name": "سالم",
          "result": "مَفَاعِيلَانْ",
          "syllables": [
            "S",
            "L",
            "L",
            "X"
          ],
          "kind": "salim",
          "scope": "any",
          "severity": 1
        }
      ],
      "faulan": [
        {
          "id": "salim",
          "name": "سالم",
          "result": "فَعُولَانْ",
          "syllables": [
            "S",
            "L",
            "X"
          ],
          "kind": "salim",
          "scope": "any",
          "severity": 1
        }
      ],
      "failan": [
        {
          "id": "salim",
          "name": "سالم",
          "result": "فَاعِلَانْ",
          "syllables": [
            "L",
            "S",
            "X"
          ],
          "kind": "salim",
          "scope": "any",
          "severity": 1
        }
      ],
      "mafulan": [
        {
          "id": "salim",
          "name": "سالم",
          "result": "مَفْعُولَانْ",
          "syllables": [
            "L",
            "L",
            "X"
          ],
          "kind": "salim",
          "scope": "any",
          "severity": 1
        }
      ],
      "failat": [
        {
          "id": "salim",
          "name": "سالم",
          "result": "فَاعِلَاتْ",
          "syllables": [
            "L",
            "S",
            "X"
          ],
          "kind": "salim",
          "scope": "any",
          "severity": 1
        }
      ],
      "failan_short": [
        {
          "id": "salim",
          "name": "سالم",
          "result": "فَعْلَانْ",
          "syllables": [
            "L",
            "X"
          ],
          "kind": "salim",
          "scope": "any",
          "severity": 1
        }
      ]
    },
    "definitions": {
      "_note": "تعريف كل زحاف وعلّة، مصدرها كتب العروض. مفصولة عن `variations` لأنها خاصّة بالصورة لا بالتفعيلة، فلا تُكرَّر مع كل واحدة. تُعرض في سطر العلّة تحت التفعيلات.",
      "salim": {
        "category": "سالمة",
        "definition": "التفعيلة على أصلها، لم يدخلها زحاف ولا علّة"
      },
      "khabn": {
        "category": "الزحاف",
        "definition": "حذف الثاني الساكن"
      },
      "tayy": {
        "category": "الزحاف",
        "definition": "حذف الرابع الساكن"
      },
      "khabl": {
        "category": "الزحاف",
        "definition": "الخبن والطيّ معًا — حذف الثاني والرابع الساكنين"
      },
      "qabd": {
        "category": "الزحاف",
        "definition": "حذف الخامس الساكن"
      },
      "kaff": {
        "category": "الزحاف",
        "definition": "حذف السابع الساكن"
      },
      "shakl": {
        "category": "الزحاف",
        "definition": "الخبن والكفّ معًا — حذف الثاني والسابع الساكنين"
      },
      "qat": {
        "category": "علل النقص",
        "definition": "حذف ساكن الوتد المجموع وتسكين ما قبله"
      },
      "hadhf": {
        "category": "علل النقص",
        "definition": "حذف السبب الخفيف من آخر التفعيلة"
      },
      "batr": {
        "category": "علل النقص",
        "definition": "الحذف والقطع معًا"
      },
      "tashith": {
        "category": "علل النقص",
        "definition": "حذف أوّل الوتد المجموع"
      },
      "tadhyil": {
        "category": "علل الزيادة",
        "definition": "زيادة حرف ساكن على ما آخره وتد مجموع"
      },
      "tasbeegh": {
        "category": "علل الزيادة",
        "definition": "زيادة حرف ساكن على سبب خفيف"
      },
      "faalun_reading": {
        "category": "قراءة",
        "definition": "صورة تحتملها الكلمة نفسها بتشكيلين، لا زحاف فيها ولا علّة"
      },
      "tarfeel": {
        "category": "علل الزيادة",
        "definition": "زيادة سبب خفيف على ما آخره وتد مجموع"
      }
    }
  },
  "meters": {
    "description": "قاعدة أوزان الشعر النبطي، مستخرجة حرفيًا من القائمة التي قدّمها المستخدم. البحر له صيغتان: الصدر والعجز، والعجز غالبًا هو الصدر مع تذييل في آخر تفعيلة.",
    "conventions": {
      "forms": "forms[0] صدر و forms[1] عجز. الشطر الواحد يُطابَق على أي الصيغتين، والبيت الكامل على الصدر ثم العجز.",
      "patternDerivation": "النمط المقطعي لا يُخزَّن — يُشتق آليًا من التفعيلات في meters/registry.js.",
      "expectedSyllableCount": "عدد مقاطع الصدر. قيمة تحقّق: الاختبارات تفشل إن خالفها الاشتقاق."
    },
    "meters": [
      {
        "id": "al_maskhub",
        "name": "المسحوب",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 1,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "mustafilun",
              "mustafilun",
              "failatun"
            ],
            "sourceQuote": "مستفعلن مستفعلن فاعلاتن"
          },
          {
            "role": "ajz",
            "feet": [
              "mustafilun",
              "mustafilun",
              "failatan"
            ],
            "sourceQuote": "مستفعلن مستفعلن فاعلاتان"
          }
        ],
        "expectedSyllableCount": 12,
        "status": "OK"
      },
      {
        "id": "al_sakhri_taweel_shaybani",
        "name": "الصخري الطويل الشيباني",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 2,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "mafailun",
              "mafailun",
              "mafailun",
              "mafailun"
            ],
            "sourceQuote": "مفاعيلن مفاعيلن مفاعيلن مفاعيلن"
          },
          {
            "role": "ajz",
            "feet": [
              "mafailun",
              "mafailun",
              "mafailun",
              "mafailan"
            ],
            "sourceQuote": "مفاعيلن مفاعيلن مفاعيلن مفاعيلان"
          }
        ],
        "expectedSyllableCount": 16,
        "status": "OK"
      },
      {
        "id": "al_rajaz",
        "name": "الرجز",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 3,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "mustafilun",
              "mustafilun",
              "mustafilun"
            ],
            "sourceQuote": "مستفعلن مستفعلن مستفعلن"
          },
          {
            "role": "ajz",
            "feet": [
              "mustafilun",
              "mustafilun",
              "mustafilan"
            ],
            "sourceQuote": "مستفعلن مستفعلن مستفعلان"
          }
        ],
        "expectedSyllableCount": 12,
        "status": "OK"
      },
      {
        "id": "al_hajini_taweel_1",
        "name": "الهجيني الطويل - طرق 1",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 4,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "failatun",
              "failatun",
              "failatun",
              "failatun"
            ],
            "sourceQuote": "فاعلاتن فاعلاتن فاعلاتن فاعلاتن"
          },
          {
            "role": "ajz",
            "feet": [
              "failatun",
              "failatun",
              "failatun",
              "failatan"
            ],
            "sourceQuote": "فاعلاتن فاعلاتن فاعلاتن فاعلاتان"
          }
        ],
        "expectedSyllableCount": 16,
        "status": "OK"
      },
      {
        "id": "al_samri_taweel_1",
        "name": "السامري الطويل - طرق 1",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 5,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "mustafilun",
              "failatun",
              "mustafilun",
              "failatun"
            ],
            "sourceQuote": "مستفعلن فاعلاتن مستفعلن فاعلاتن"
          },
          {
            "role": "ajz",
            "feet": [
              "mustafilun",
              "failatun",
              "mustafilun",
              "failatan"
            ],
            "sourceQuote": "مستفعلن فاعلاتن مستفعلن فاعلاتان"
          }
        ],
        "expectedSyllableCount": 16,
        "status": "OK"
      },
      {
        "id": "al_rajaz_taweel_hada_1",
        "name": "الرجز الطويل الحدا - طرق 1",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 6,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "mustafilun",
              "mustafilun",
              "mustafilun",
              "mustafilun"
            ],
            "sourceQuote": "مستفعلن مستفعلن مستفعلن مستفعلن"
          },
          {
            "role": "ajz",
            "feet": [
              "mustafilun",
              "mustafilun",
              "mustafilun",
              "mustafilan"
            ],
            "sourceQuote": "مستفعلن مستفعلن مستفعلن مستفعلان"
          }
        ],
        "expectedSyllableCount": 16,
        "status": "OK"
      },
      {
        "id": "al_rajaz_qaseer_1",
        "name": "الرجز القصير - طرق 1",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 7,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "mustafilun",
              "mafulun"
            ],
            "sourceQuote": "مستفعلن مفعولن"
          },
          {
            "role": "ajz",
            "feet": [
              "mustafilun",
              "maful"
            ],
            "sourceQuote": "مستفعلن مفعول"
          }
        ],
        "expectedSyllableCount": 7,
        "status": "OK"
      },
      {
        "id": "al_rajaz_qaseer_4",
        "name": "الرجز القصير - طرق 4",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 8,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "mustafilun",
              "mafailun"
            ],
            "sourceQuote": "مستفعلن مفاعيلن"
          },
          {
            "role": "ajz",
            "feet": [
              "mustafilun",
              "mafailan"
            ],
            "sourceQuote": "مستفعلن مفاعيلان"
          }
        ],
        "expectedSyllableCount": 8,
        "status": "OK"
      },
      {
        "id": "al_taweel_al_mankus",
        "name": "الطويل المنكوس",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 9,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "faulun",
              "mafailun",
              "faulun",
              "mafailun"
            ],
            "sourceQuote": "فعولن مفاعيلن فعولن مفاعيلن"
          },
          {
            "role": "ajz",
            "feet": [
              "faulun",
              "mafailun",
              "faulun",
              "mafailan"
            ],
            "sourceQuote": "فعولن مفاعيلن فعولن مفاعيلان"
          }
        ],
        "expectedSyllableCount": 14,
        "status": "OK"
      },
      {
        "id": "al_hajini_2",
        "name": "الهجيني - طرق 2",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 10,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "failatun",
              "mafailun",
              "mafailun"
            ],
            "sourceQuote": "فاعلاتن مفاعيلن مفاعيلن"
          },
          {
            "role": "ajz",
            "feet": [
              "failatun",
              "mafailun",
              "mafailan"
            ],
            "sourceQuote": "فاعلاتن مفاعيلن مفاعيلان"
          }
        ],
        "expectedSyllableCount": 12,
        "status": "OK"
      },
      {
        "id": "al_ramal",
        "name": "الرمل",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 11,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "failatun",
              "failatun",
              "failatun"
            ],
            "sourceQuote": "فاعلاتن فاعلاتن فاعلاتن"
          },
          {
            "role": "ajz",
            "feet": [
              "failatun",
              "failatun",
              "failatan"
            ],
            "sourceQuote": "فاعلاتن فاعلاتن فاعلاتان"
          }
        ],
        "expectedSyllableCount": 12,
        "status": "OK"
      },
      {
        "id": "ghayr_musannaf_muhawara_3",
        "name": "غير مصنف محاورة - 3",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 12,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "mustafilun",
              "mustafilun",
              "failatun",
              "failatun"
            ],
            "sourceQuote": "مستفعلن مستفعلن فاعلاتن فاعلاتن"
          },
          {
            "role": "ajz",
            "feet": [
              "mustafilun",
              "mustafilun",
              "failatun",
              "failatan"
            ],
            "sourceQuote": "مستفعلن مستفعلن فاعلاتن فاعلاتان"
          }
        ],
        "expectedSyllableCount": 16,
        "status": "OK"
      },
      {
        "id": "al_sakhri_2",
        "name": "الصخري - طرق 2",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 13,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "mafulun",
              "mafailun",
              "faalun"
            ],
            "sourceQuote": "مفعولن مفاعيلن فعلن"
          },
          {
            "role": "ajz",
            "feet": [
              "mafulun",
              "mafailun",
              "faalun"
            ],
            "sourceQuote": "مفعولن مفاعيلن فعلن"
          }
        ],
        "expectedSyllableCount": 9,
        "status": "OK",
        "note": "الصدر والعجز متطابقان في المصدر — لا تذييل."
      },
      {
        "id": "al_wafir",
        "name": "الوافر",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 14,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "mafailun",
              "mafailun",
              "mafailun"
            ],
            "sourceQuote": "مفاعيلن مفاعيلن مفاعيلن"
          },
          {
            "role": "ajz",
            "feet": [
              "mafailun",
              "mafailun",
              "mafailan"
            ],
            "sourceQuote": "مفاعيلن مفاعيلن مفاعيلان"
          }
        ],
        "expectedSyllableCount": 12,
        "status": "OK"
      },
      {
        "id": "al_mumtad",
        "name": "الممتد",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 15,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "failatun",
              "failatun",
              "failun",
              "failun"
            ],
            "sourceQuote": "فاعلاتن فاعلاتن فاعلن فاعلن"
          },
          {
            "role": "ajz",
            "feet": [
              "failatun",
              "failatun",
              "failun",
              "failan"
            ],
            "sourceQuote": "فاعلاتن فاعلاتن فاعلن فاعلان"
          }
        ],
        "expectedSyllableCount": 14,
        "status": "OK",
        "note": "ورد مرتين متطابقين في القائمة، فأُدرج مرة واحدة."
      },
      {
        "id": "al_baseet",
        "name": "البسيط",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 16,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "mustafilun",
              "failun",
              "mustafilun",
              "failun"
            ],
            "sourceQuote": "مستفعلن فاعلن مستفعلن فاعلن"
          },
          {
            "role": "ajz",
            "feet": [
              "mustafilun",
              "failun",
              "mustafilun",
              "failan"
            ],
            "sourceQuote": "مستفعلن فاعلن مستفعلن فاعلان"
          }
        ],
        "expectedSyllableCount": 14,
        "note": "المصدر كتب «فاعل» في الموضع الثاني، وأكّد المستخدم أن المقصود «فاعلن». صُحّحت بناءً على تأكيده لا باجتهاد.",
        "status": "OK"
      },
      {
        "id": "al_hazaj",
        "name": "الهزج",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 17,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "mafailun",
              "mafailan"
            ],
            "sourceQuote": "مفاعيلن مفاعيلان"
          }
        ],
        "expectedSyllableCount": 8,
        "status": "OK",
        "note": "المصدر أعطى سطرًا واحدًا لا سطرين. نُفِّذ كما ورد صيغةً واحدة."
      },
      {
        "id": "al_ramal_majzu",
        "name": "الرمل المجزوء",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 18,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "failatun",
              "failatun"
            ],
            "sourceQuote": "فاعلاتن فاعلاتن"
          },
          {
            "role": "ajz",
            "feet": [
              "failatun",
              "failatan"
            ],
            "sourceQuote": "فاعلاتن فاعلاتان"
          }
        ],
        "expectedSyllableCount": 8,
        "status": "OK"
      },
      {
        "id": "al_mujtath_majzu",
        "name": "المجتث المجزوء",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 19,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "mustafilun",
              "failatun"
            ],
            "sourceQuote": "مستفعلن فاعلاتن"
          },
          {
            "role": "ajz",
            "feet": [
              "mustafilun",
              "failatan"
            ],
            "sourceQuote": "مستفعلن فاعلاتان"
          }
        ],
        "expectedSyllableCount": 8,
        "status": "OK"
      },
      {
        "id": "al_baseet_1",
        "name": "البسيط - طرق 1",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 20,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "mustafilun",
              "failun",
              "mustafilun"
            ],
            "sourceQuote": "مستفعلن فاعلن مستفعلن"
          },
          {
            "role": "ajz",
            "feet": [
              "mustafilun",
              "failun",
              "mustafilatun"
            ],
            "sourceQuote": "مستفعلن فاعلن مستفعلاتن"
          }
        ],
        "expectedSyllableCount": 11,
        "status": "OK"
      },
      {
        "id": "al_hajini_taweel_2",
        "name": "الهجيني الطويل - طرق 2",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 21,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "failatun",
              "faulun",
              "failatun",
              "faulun"
            ],
            "sourceQuote": "فاعلاتن فعولن فاعلاتن فعولن"
          },
          {
            "role": "ajz",
            "feet": [
              "failatun",
              "faulun",
              "failatun",
              "faulan"
            ],
            "sourceQuote": "فاعلاتن فعولن فاعلاتن فعولان"
          }
        ],
        "expectedSyllableCount": 14,
        "status": "OK"
      },
      {
        "id": "al_hajini_taweel_3",
        "name": "الهجيني الطويل - طرق 3",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 22,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "failatun",
              "failun",
              "failatun",
              "failun"
            ],
            "sourceQuote": "فاعلاتن فاعلن فاعلاتن فاعلن"
          },
          {
            "role": "ajz",
            "feet": [
              "failatun",
              "failun",
              "failatun",
              "failat"
            ],
            "sourceQuote": "فاعلاتن فاعلن فاعلاتن فاعلات"
          }
        ],
        "expectedSyllableCount": 14,
        "status": "OK"
      },
      {
        "id": "al_rajaz_taweel_2",
        "name": "الرجز الطويل - طرق 2",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 23,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "mustafilun",
              "mafulun",
              "mustafilun",
              "mafulun"
            ],
            "sourceQuote": "مستفعلن مفعولن مستفعلن مفعولن"
          },
          {
            "role": "ajz",
            "feet": [
              "mustafilun",
              "mafulun",
              "mustafilun",
              "mafulan"
            ],
            "sourceQuote": "مستفعلن مفعولن مستفعلن مفعولان"
          }
        ],
        "expectedSyllableCount": 14,
        "status": "OK"
      },
      {
        "id": "al_rajaz_qaseer_2",
        "name": "الرجز القصير - طرق 2",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 24,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "mustafilun",
              "mustafilun",
              "faal"
            ],
            "sourceQuote": "مستفعلن مستفعلن فعل"
          },
          {
            "role": "ajz",
            "feet": [
              "mustafilun",
              "mustafilun",
              "faa"
            ],
            "sourceQuote": "مستفعلن مستفعلن فع"
          }
        ],
        "expectedSyllableCount": 10,
        "status": "OK"
      },
      {
        "id": "al_rajaz_1",
        "name": "الرجز - طرق 1",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 25,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "mustafilun",
              "mustafilun",
              "faalun"
            ],
            "sourceQuote": "مستفعلن مستفعلن فعلن"
          },
          {
            "role": "ajz",
            "feet": [
              "mustafilun",
              "mustafilun",
              "maful"
            ],
            "sourceQuote": "مستفعلن مستفعلن مفعول"
          }
        ],
        "expectedSyllableCount": 10,
        "status": "OK"
      },
      {
        "id": "al_baseet_2",
        "name": "البسيط - طرق 2",
        "aliases": [
          "غير مصنف - 4"
        ],
        "enabled": true,
        "sourceIndex": 26,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "mustafilun",
              "failun",
              "mustafilun",
              "faalun"
            ],
            "sourceQuote": "مستفعلن فاعلن مستفعلن فعلن"
          },
          {
            "role": "ajz",
            "feet": [
              "mustafilun",
              "failun",
              "mustafilun",
              "failan_short"
            ],
            "sourceQuote": "مستفعلن فاعلن مستفعلن فعلان"
          }
        ],
        "expectedSyllableCount": 13,
        "status": "OK",
        "note": "دُمج من مدخلين وردا في القائمة بالوزن نفسه: «البسيط» (السطر الأخير) و«غير مصنف - 4» بعد تصحيحه. أكّد المستخدم أنهما واحد وأعطى سطر العجز. وصف «طرق 2» تسمية تمييز أضفتُها لأن «البسيط» و«البسيط - طرق 1» مأخوذان؛ الاسمان المصدريان محفوظان: «البسيط» في التسمية و«غير مصنف - 4» في aliases."
      },
      {
        "id": "al_hajini_taweel_4",
        "name": "الهجيني الطويل - طرق 4",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 27,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "failatun",
              "faulun",
              "failatun",
              "failun"
            ],
            "sourceQuote": "فاعلاتن فعولن فاعلاتن فاعلن"
          },
          {
            "role": "ajz",
            "feet": [
              "failatun",
              "faulun",
              "failatun",
              "failat"
            ],
            "sourceQuote": "فاعلاتن فعولن فاعلاتن فاعلات"
          }
        ],
        "expectedSyllableCount": 14,
        "status": "OK"
      },
      {
        "id": "al_madeed",
        "name": "المديد",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 28,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "failatun",
              "failun",
              "failatun"
            ],
            "sourceQuote": "فاعلاتن فاعلن فاعلاتن"
          }
        ],
        "expectedSyllableCount": 11,
        "status": "OK",
        "note": "المصدر أعطى سطرًا واحدًا لا سطرين."
      },
      {
        "id": "al_rajaz_majzu",
        "name": "الرجز المجزوء",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 29,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "mustafilun",
              "mustafilun"
            ],
            "sourceQuote": "مستفعلن مستفعلن"
          },
          {
            "role": "ajz",
            "feet": [
              "mustafilun",
              "mustafilan"
            ],
            "sourceQuote": "مستفعلن مستفعلان"
          }
        ],
        "expectedSyllableCount": 8,
        "status": "OK"
      },
      {
        "id": "al_hajini_taweel_5",
        "name": "الهجيني الطويل - طرق 5",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 30,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "failatun",
              "failun",
              "failatun",
              "faalun"
            ],
            "sourceQuote": "فاعلاتن فاعلن فاعلاتن فعلن"
          },
          {
            "role": "ajz",
            "feet": [
              "failatun",
              "failun",
              "failatun",
              "faalun"
            ],
            "sourceQuote": "فاعلاتن فاعلن فاعلاتن فعلن"
          }
        ],
        "expectedSyllableCount": 13,
        "status": "OK",
        "note": "الصدر والعجز متطابقان في المصدر — لا تذييل."
      },
      {
        "id": "al_rajaz_2",
        "name": "الرجز - طرق 2",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 31,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "mustafilun",
              "mustafilun",
              "mustafilun",
              "faa"
            ],
            "sourceQuote": "مستفعلن مستفعلن مستفعلن فع"
          },
          {
            "role": "ajz",
            "feet": [
              "mustafilun",
              "mustafilun",
              "mustafilun",
              "faa"
            ],
            "sourceQuote": "مستفعلن مستفعلن مستفعلن فع"
          }
        ],
        "expectedSyllableCount": 13,
        "status": "OK",
        "note": "الصدر والعجز متطابقان في المصدر — لا تذييل."
      },
      {
        "id": "al_rajaz_3",
        "name": "الرجز - طرق 3",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 32,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "mustafilun",
              "mustafilun",
              "mafulun"
            ],
            "sourceQuote": "مستفعلن مستفعلن مفعولن"
          },
          {
            "role": "ajz",
            "feet": [
              "mustafilun",
              "mustafilun",
              "mafulun"
            ],
            "sourceQuote": "مستفعلن مستفعلن مفعولن"
          }
        ],
        "expectedSyllableCount": 11,
        "status": "OK",
        "note": "الصدر والعجز متطابقان في المصدر — لا تذييل."
      },
      {
        "id": "al_hajini_taweel_6",
        "name": "الهجيني الطويل - طرق 6",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 33,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "failatun",
              "failatun",
              "failatun",
              "mustafilun"
            ],
            "sourceQuote": "فاعلاتن فاعلاتن فاعلاتن مستفعلن"
          },
          {
            "role": "ajz",
            "feet": [
              "failatun",
              "failatun",
              "failatun",
              "mustafilan"
            ],
            "sourceQuote": "فاعلاتن فاعلاتن فاعلاتن مستفعلان"
          }
        ],
        "expectedSyllableCount": 16,
        "status": "OK"
      },
      {
        "id": "hajini",
        "name": "هجيني",
        "aliases": [],
        "enabled": true,
        "sourceIndex": 34,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "mustafilun",
              "failun",
              "faalun"
            ],
            "sourceQuote": "مستفعلن فاعلن فعلن"
          },
          {
            "role": "ajz",
            "feet": [
              "mustafilun",
              "failun",
              "maful"
            ],
            "sourceQuote": "مستفعلن فاعلن مفعول"
          }
        ],
        "expectedSyllableCount": 9,
        "status": "OK",
        "note": "أقرّه صاحب القائمة بعد القائمة الأصلية، وسمّاه «هجيني». وشاهده شطر «صعيب مهما تساهلته»: يقطّعه التطبيق المرجعي مفاعلن فاعلن فاعل — وهي مستفعلن مخبونة، وفاعلن، وفعلن (قطع فاعلن). والعجز مستنبَط على قاعدة القائمة نفسها: العجز هو الصدر مع زيادة ساكن (فعلن ← مفعول)، ولم يَرِد نصًّا."
      },
      {
        "id": "al_madeed_2",
        "name": "المديد طرق آخر",
        "aliases": [
          "المديد النبطي - الثلاثي المزيد"
        ],
        "enabled": true,
        "sourceIndex": 35,
        "forms": [
          {
            "role": "sadr",
            "feet": [
              "failatun",
              "failatun",
              "mafailun"
            ],
            "sourceQuote": "فاعلاتن فاعلاتن مفاعيلن"
          },
          {
            "role": "ajz",
            "feet": [
              "failatun",
              "failatun",
              "mafailan"
            ],
            "sourceQuote": "فاعلاتن فاعلاتن مفاعيلان"
          }
        ],
        "expectedSyllableCount": 12,
        "status": "OK",
        "note": "سمّاه صاحب القائمة «المديد طرق آخر»، واسمه في التطبيق المرجعي «المديد النبطي — الثلاثي المزيد» وهو محفوظ اسمًا بديلًا. وشاهده شطر «العب المنكوس واحبّ روباعه»: يقطّعه المرجع ال|عبل|من ، كو|سوا|حب ، برو|با|عه = فاعلاتن فاعلاتن مفاعيلن. والعجز مستنبَط على قاعدة القائمة نفسها — العجز هو الصدر مع زيادة ساكن (مفاعيلن ← مفاعيلان) — ولم يَرِد نصًّا."
      }
    ],
    "notInSource": []
  },
  "scoring": {
    "version": 1,
    "description": "معاملات معادلة الدرجة. ملف مستقل عمدًا: تعديل أي رقم هنا يغيّر الترتيب دون إعادة بناء المحرك. المعادلة نفسها موثّقة في docs/SCORING.md ولا تقرأ أي رقم من خارج هذا الملف.",
    "weights": {
      "substitution": 1,
      "insertion": 1.2,
      "deletion": 1.2,
      "overlongMismatch": 0.3,
      "variationKind": {
        "salim": 0,
        "ambiguous_reading": 0.05,
        "zihaf": 0.12,
        "illa": 0.18
      },
      "severityMultiplier": {
        "1": 1,
        "2": 1.8
      },
      "scopeViolation": 0.5,
      "position": {
        "first": 1.1,
        "hashw": 1,
        "arudDarb": 1.35
      },
      "unconsumedSyllable": 1.2,
      "unfilledFoot": 1.5,
      "inconsistentWordReading": 0.25,
      "writtenMaddIgnored": 0.12,
      "assumedIshbaa": 0.12
    },
    "normalizer": {
      "mode": "meterSyllables",
      "perSyllableCost": 1,
      "floor": 4
    },
    "uncertainty": {
      "assumedVocalizationPenalty": 0.08,
      "unknownWordPenalty": 0,
      "ambiguityPenalty": 0.25,
      "tieDelta": 0.03
    },
    "thresholds": {
      "sound": 0.97,
      "acceptable": 0.85,
      "broken": 0.6,
      "maxBrokenFootRatio": 0.5
    },
    "brokenFoot": {
      "minCostToReport": 0.25
    },
    "ranking": {
      "maxAlternatives": 5,
      "minScoreToList": 0.35,
      "preferFinalSukun": true
    },
    "rationale": {
      "insertion_gt_substitution": "زيادة مقطع أو نقصه يغيّر بنية الشطر أكثر مما يغيّره تبدّل كمّية مقطع واحد، فكلفته أعلى.",
      "arudDarb_gt_hashw": "الخلل في العروض والضرب أشدّ إخلالًا بالسمع من مثله في الحشو، والعرف العروضي يشدّد فيهما.",
      "zihaf_not_free": "الزحاف مسموح لا مُستحبّ؛ تكلفته الصغيرة تجعل القراءة السالمة تتقدّم على المزاحَفة عند تساوي كل شيء آخر، دون أن تُسقط المزاحَفة.",
      "overlong_cheap": "التمييز بين المقطع الطويل والمفرط في آخر الشطر مسألة اصطلاح تدوين غالبًا، فلا يُعامَل معاملة الخطأ الكامل.",
      "normalizer_floor": "يمنع البحور القصيرة جدًا من تضخيم أثر خطأ واحد.",
      "ambiguity_penalty": "نصّ غير مشكول يقبل قراءات كثيرة، فقد يتساوى بحران في القمة. الدرجة تبقى كما هي — لأنها تصف المطابقة فعلًا — لكن الثقة تنخفض، لأن الثقة تصف يقيننا بالإجابة لا جودة المطابقة. الفرق بين الرقمين مقصود.",
      "tie_delta": "الفارق الذي يُعدّ دونه البحران متساويين. مشتق من كلفة زحاف واحد تقريبًا لا من التجربة — يُعاير حين تتوفر أمثلة مرجعية.",
      "max_broken_foot_ratio": "الدرجة وحدها لا تكفي للحكم. بيت اختلّت فيه كل تفعيلاته قد ينال درجة متوسطة لأن كل تفعيلة اختلّت بمقطع واحد فقط، فيبدو «قريبًا من البحر» وهو ليس كذلك: القرب من وزن معناه أن أكثره صحيح. فإذا تجاوزت نسبة التفعيلات المختلّة هذا الحدّ رُدَّ الحكم إلى «لا وزن مقنع» مهما كانت الدرجة. الدرجة تصف المسافة، والحكم يصف ما يصحّ أن يُقال للمستخدم.",
      "inconsistentWordReading": "كلفة كل كلمة تُقرأ خلافًا لمثيلتها في الشطر نفسه. الكلمة الواحدة لا تُنطق نطقين، فمن كتب «مستفعلن» ثلاثًا فقراءتها واحدة. وقيمتها ربعُ كلفة الإبدال: ترجّح عند التعادل — وهو كثير في النصّ غير المشكول — ولا تقلب بحرًا فاق نظيره بفارق حقيقي. والكلمة الأخيرة تُقاس بما قبل مقطعها الأخير وحده، لأن الإشباع وأحكام الوقف تخصّ آخر الشطر.",
      "written_madd_ignored": "الحرف المرسوم أولى بأن يُقرأ على أصله. والمخطّط يفترض حركاتٍ لم تُكتب وذاك أصل عمله، أمّا أن يُعرَض عن حرف مدٍّ رسمه الشاعر بيده — بقصره لسكونٍ مفترض («جحّاد» ← جِحْ‑حَدْ) أو بقراءته صامتًا بحركةٍ مفترضة («طيب» ← طِ‑يِبْ) — فرخصةٌ تُكلَّف. وقيمتها قيمةُ الزحاف: ترجّح القراءة المُبقية عند التساوي ولا تُسقط الأخرى. ولا تُحتسب حين يكون القصر مُلجَأً إليه — ساكنٌ معلوم بعده أو همزةُ وصلٍ ساقطة — فذاك حكمٌ لا اختيار. ولا يدخل فيها اللين («بَيْت»)، لأن الياء فيه قفلٌ للمقطع لا فاتحةٌ له.",
      "prefer_final_sukun": "عند التساوي التامّ في الدرجة تُرجَّح القراءة الأقلّ افتراضًا لحركةٍ على آخر الكلمة. وهذا ترجيحٌ لا كلفة: لا يمسّ درجةً ولا يُسقط قراءة، وإنما يحلّ محلّ ترتيب القائمة — وهو ترتيبٌ لا يدلّ على شيء. ومستنده أن النبطي يُسكّن الأواخر ولا إعراب فيه، فقراءة «الدهر جحّاد» دَ‑هَرْ‑جِحْ أولى من دَهْ‑رِ‑جِحْ. وهو مسجَّل NEEDS_VALIDATION في lexicon.nabatiDialect: مستنده تقطيعٌ مرجعيّ واحد، ويُثبته أو يُبطله عشرةُ أشطر مقطَّعة فيها كلمةٌ آخرها ساكنان.",
      "assumed_ishbaa": "إشباعُ حركةٍ مفترضة آخر الشطر رخصةٌ كسابقتها، وهو وجهُها الآخر: تلك تُعرض عن حرفٍ مرسوم، وهذا يزيد حرفًا لا رسم له ولا حركةَ تحته معلومة. والنبطي يُسكّن الأواخر، فقراءة «جلاده» جَ‑لَا‑دَهْ أولى من جَ‑لَا‑دَ‑هَا. ولا تُحتسب على حركةٍ شكّلها الشاعر: من كتب «كَتَبَ» فقد قرّر الحركة، وإشباعها حكمٌ عروضي لا افتراض. وهي كلفة لا منع: القراءة المُشبَعة تبقى مطروحة وتفوز إن لم يوافق البحرَ غيرُها — وبها تُقرأ القوافي المطلقة كلها. ومستندها مستندُ preferFinalSukun نفسه (NEEDS_VALIDATION)."
    }
  },
  "encodings": {
    "description": "ترميزات النمط الرقمي. البند 10 من المواصفة يمنع افتراض معنى الأرقام، لذلك لا يوجد تحويل مثبَّت في الكود إطلاقًا: التمثيل الداخلي حروف (S/L/X)، وكل ترميز رقمي مجرد عارض يُقرأ من هنا.",
    "internal": {
      "note": "التمثيل الداخلي الوحيد الذي يعمل عليه المطابق والمُقيِّم. لا يُعرَض للمستخدم ولا يُستبدل.",
      "symbols": {
        "S": "مقطع قصير — صامت + حركة قصيرة (CV)",
        "L": "مقطع طويل — CVC أو CVV",
        "X": "مقطع مفرط الطول — CVVC أو CVCC، لا يقع إلا في آخر الشطر"
      }
    },
    "defaultScheme": "binary_1_2",
    "schemes": [
      {
        "id": "binary_1_2",
        "name": "ثنائي (1 قصير / 2 طويل)",
        "status": "PROVISIONAL",
        "level": "syllable",
        "map": {
          "S": "1",
          "L": "2",
          "X": "3"
        },
        "separator": "",
        "note": "ترميز عرض افتراضي اخترته للوضوح فقط. ليس ادّعاءً بأنه ترميز تطبيق ميزان النبط — انظر nabati_app أدناه."
      },
      {
        "id": "khalil_arudi",
        "name": "الترميز الخليلي الحرفي (متحرك/ساكن)",
        "status": "STANDARD",
        "level": "letter",
        "map": {
          "moving": "1",
          "still": "0"
        },
        "separator": "",
        "note": "هذا ترميز عروضي كلاسيكي موثّق: كل حرف متحرك 1 وكل ساكن 0. يُشتق من الحروف لا من المقاطع، فهو مستقل عن الترميز المقطعي وصالح للتحقق المتقاطع."
      },
      {
        "id": "arudi_slash",
        "name": "الرمز التقليدي (/ و ه)",
        "status": "STANDARD",
        "level": "letter",
        "map": {
          "moving": "/",
          "still": "ه"
        },
        "separator": "",
        "note": "نفس المستوى الحرفي بعلامات كتب العروض."
      },
      {
        "id": "arudi_slash_zero",
        "name": "الرمز التقليدي (/ و 0)",
        "status": "STANDARD",
        "level": "letter",
        "map": {
          "moving": "/",
          "still": "0"
        },
        "separator": "",
        "note": "نفس المستوى الحرفي، بالساكن صفرًا بدل الهاء. هذه صورة الرمز التي تعرضها واجهة الكتابة اللحظية على بطاقات التفعيلات، مثل /0/0//0 لمستفعلن."
      },
      {
        "id": "nabati_app",
        "name": "ترميز تطبيق ميزان النبط",
        "status": "NEEDS_VALIDATION",
        "level": null,
        "map": null,
        "separator": null,
        "enabled": false,
        "note": "غير مُنفَّذ عمدًا. المواصفة تقول إن المادة المصدرية والتطبيق يستخدمان تمثيلًا رقميًا، وتمنع افتراض معناه.",
        "resolvedBy": [
          "٣ لقطات على الأقل من التطبيق، كل واحدة تُظهر بيتًا وناتجه الرقمي",
          "يُفضَّل أن تكون من بحور مختلفة الطول (مثلًا الحدا والمسحوب والرجز) حتى نميّز هل الرقم لكل مقطع أم لكل حرف أم لكل تفعيلة"
        ],
        "howToEnable": "املأ level (syllable أو letter) و map، واضبط enabled=true، وأضف حالة golden واحدة على الأقل تثبّت الاشتقاق. لا يلزم تعديل أي كود."
      }
    ]
  },
  "lexicon": {
    "description": "الاستثناءات التي لا يمكن اشتقاقها من الرسم: حروف تُكتب ولا تُنطق، وحروف تُنطق ولا تُكتب، وكلمات همزتها همزة وصل. كل مدخل قاعدة صوتية لا تخمين معنى.",
    "silentLetters": {
      "note": "حرف مكتوب غير منطوق — لا يُحتسب في الوزن (البند 5: الحذف الصوتي).",
      "rules": [
        {
          "id": "waw_al_jamaa",
          "name": "ألف التفريق بعد واو الجماعة",
          "pattern": "و+ا في آخر الفعل",
          "regex": "وا$",
          "appliesTo": "verbs",
          "action": "drop_final_alif",
          "examples": [
            "كتبوا",
            "قالوا",
            "راحوا",
            "جاؤوا"
          ],
          "status": "OK"
        },
        {
          "id": "amr_waw",
          "name": "واو عمرو",
          "words": [
            "عمرو"
          ],
          "action": "drop_final_waw",
          "status": "OK"
        }
      ]
    },
    "unwrittenLongVowels": {
      "note": "ألف تُنطق ولا تُكتب. تؤثر في الوزن لأنها تُطيل المقطع.",
      "words": {
        "هذا": "هَاذَا",
        "هذه": "هَاذِهِ",
        "هذان": "هَاذَانِ",
        "ذلك": "ذَالِكَ",
        "ذلكم": "ذَالِكُمْ",
        "أولئك": "أُلَائِكَ",
        "هؤلاء": "هَاؤُلَاءِ",
        "لكن": "لَاكِنْ",
        "لكنّ": "لَاكِنَّ",
        "الله": "اللَّاه",
        "اللهم": "اللَّاهُمَّ",
        "الرحمن": "الرَّحْمَان",
        "طه": "طَاهَا",
        "إله": "إِلَاه"
      },
      "status": "OK",
      "note2": "«لكن» المخففة تُنطق لَاكِنْ بألف. أضِف ما ينقص هنا دون كود."
    },
    "hamzatWasl": {
      "note": "همزة الوصل تسقط عند الوصل بما قبلها. أل التعريف تُعالَج بقاعدة مستقلة في المُصوِّت لا هنا.",
      "words": [
        "ابن",
        "ابنة",
        "ابنان",
        "اسم",
        "امرؤ",
        "امرأة",
        "اثنان",
        "اثنتان",
        "است",
        "ايم",
        "ايمن"
      ],
      "verbPrefixes": {
        "note": "أفعال الأمر والماضي الخماسي والسداسي ومصادرها تبدأ بهمزة وصل.",
        "detection": "TODO_HEURISTIC",
        "status": "NEEDS_VALIDATION",
        "why": "التمييز بين همزة الوصل وهمزة القطع في فعل غير مشكول يحتاج تحليلًا صرفيًا. المحرك حاليًا يعامل الألف الابتدائية غير المهموزة في غير الكلمات المذكورة أعلاه على أنها همزة قطع، ويسجّل ذلك في التتبّع."
      }
    },
    "article": {
      "note": "«أل» التعريف قد تسبقها حروفٌ تُرسم موصولةً بها، فتُخفيها عن كل كشفٍ يشترط أن تكون الألف أوّل الرسم. وحركة كل حرف منها مقرَّرة: العاطفة مفتوحة والجارّة مكسورة. وهمزة الوصل بعدها ساقطة قطعًا — «بالطيب» بِطْطِيب لا بَالطيب — لأنها في الدرج ولو كانت الكلمة أول الشطر.",
      "proclitics": {
        "و": "a",
        "ف": "a",
        "ب": "i",
        "ك": "i",
        "ل": "i"
      },
      "doubleLamNote": "«لل» رسمٌ خاصّ: لام الجرّ ثم لام التعريف، وألفُ الوصل ساقطة من الرسم — «للناس» لِلْنَاس. ولا يُقاس عليها غيرها، فتُشترط اللام مرّتين نصًّا كي لا تُتوهَّم «كلمة» كافًا ثم لامَ تعريف.",
      "exceptionsNote": "كلماتٌ رسمُها رسمُ «حرف + أل» وليست منه. الاشتراطُ البنيوي — حرفان على الأقل بعد اللام — يُخرج «والد» و«بالغ» و«فالح» بلا حاجة إلى ذكرها؛ وهذه ما بقي مما يفوته الشرط. أضِف إليها ما يظهر، فهي بيانات لا كود.",
      "exceptions": [
        "والدي",
        "والدين",
        "والدة",
        "والدتي",
        "والديه",
        "والدها",
        "بالغين",
        "بالغه",
        "بالغة",
        "فالحين",
        "والية",
        "بالية",
        "كالحين",
        "والين"
      ],
      "status": "OK"
    },
    "knownVocalizations": {
      "note": "كلمات وظيفية نطقها مستقرّ لا خلاف فيه. الفائدة عملية: النصّ النبطي يُكتب غير مشكول غالبًا، وكل حرف غير مشكول يضاعف احتمالات التقطيع. تثبيت هذه الكلمات وحدها يقلّص الاحتمالات تقليصًا كبيرًا دون أي تخمين — فهذه أنطاق مقرَّرة لا اجتهاد.",
      "scope": "أدوات وحروف معانٍ فقط. لا تُضَف هنا أسماء ولا أفعال: نطقها يتغيّر بالإعراب والسياق.",
      "words": {
        "من": "مِنْ",
        "عن": "عَنْ",
        "في": "فِي",
        "ما": "مَا",
        "لا": "لَا",
        "يا": "يَا",
        "هل": "هَلْ",
        "قد": "قَدْ",
        "بل": "بَلْ",
        "لم": "لَمْ",
        "لن": "لَنْ",
        "أن": "أَنْ",
        "إن": "إِنْ",
        "أو": "أَوْ",
        "ثم": "ثُمَّ",
        "كل": "كُلّ",
        "على": "عَلَى",
        "إلى": "إِلَى",
        "حتى": "حَتَّى",
        "الذي": "الَّذِي",
        "التي": "الَّتِي",
        "اللي": "اللِّي",
        "الا": "إِلَّا",
        "إلا": "إِلَّا",
        "عند": "عِنْدَ",
        "بين": "بَيْنَ",
        "فوق": "فَوْقَ",
        "تحت": "تَحْتَ",
        "غير": "غَيْر",
        "بعد": "بَعْد",
        "قبل": "قَبْل",
        "كان": "كَان",
        "يكون": "يَكُون"
      },
      "status": "OK",
      "howToExtend": "أضف مدخلًا: المفتاح الرسم المجرّد، والقيمة النطق مشكولًا. لا يلزم كود."
    },
    "sunLetters": [
      "ت",
      "ث",
      "د",
      "ذ",
      "ر",
      "ز",
      "س",
      "ش",
      "ص",
      "ض",
      "ط",
      "ظ",
      "ل",
      "ن"
    ],
    "taMarbuta": {
      "note": "التاء المربوطة تُنطق تاءً عند الوصل، وهاءً أو تُسكَّن عند الوقف.",
      "midLine": "t",
      "lineEnd": "h",
      "status": "OK"
    },
    "nabatiDialect": {
      "note": "ظواهر نطقية نبطية تؤثر في الوزن. فارغة عمدًا — البند 26 يمنع اختراع قواعد. تُملأ من أمثلة حقيقية.",
      "rules": [],
      "status": "NEEDS_VALIDATION",
      "knownGaps": [
        "إمالة الألف في بعض اللهجات — هل تغيّر كمّية المقطع؟ الأرجح لا، لكنها غير مؤكدة",
        "تسكين أواخر الكلمات في النبطي أكثر منه في الفصيح — **مأخوذٌ به ترجيحًا لا حكمًا**: عند تساوي بحرين تساويًا تامًّا تُقدَّم القراءة الأقلّ افتراضًا لحركةٍ على آخر الكلمة (`scoring.ranking.preferFinalSukun`)، فتُقرأ «بسّ الدهر جحّاد» دَ‑هَرْ‑جِحْ لا دَهْ‑رِ‑جِحْ. ولا يمسّ درجةً ولا يُسقط قراءة، وإنما يحلّ محلّ ترتيب القائمة. ويقوم عليه أيضًا `scoring.weights.assumedIshbaa`: إشباعُ حركةٍ مفترضة آخر الشطر رخصةٌ تُكلَّف، فتُقرأ «جلاده» جَ‑لَا‑دَهْ لا جَ‑لَا‑دَ‑هَا (golden: ishbaa_not_free). ومستندهما تقطيعان مرجعيّان (golden: article_after_proclitic و ishbaa_not_free) — NEEDS_VALIDATION. يحسمه: عشرة أشطر مقطَّعة فيها كلمةٌ آخرها ساكنان (دَهْر، بَحْر، شَمْس) في وسط الشطر.",
        "الكشكشة والكسكسة — لا أثر وزني متوقَّع لكنها غير محسومة",
        "حذف همزة القطع في أول الكلمة في النطق العامي — **مُعالَج** في موضعين: (أ) الألف داخل الكلمة بعد ساكن همزةٌ لا مدّ، وقد تسقط في الوصل فيأخذ الساكنُ قبلها حركتَها؛ أثبته «البارحه يوم الدجا غطّ الاطلال» — المسحوب بالإسقاط والرجز بغيره. (ب) الألف المجرّدة في أول الكلمة رسمُ همزة الوصل، فقد تسقط في الدرج فيلحق ما بعدها بالمقطع قبله قفلًا له ويقصر المدّ لالتقاء الساكنين؛ أثبته «لا إله الّا انت يا قضّاي حاجات البريّه» — فاعلاتن أربعًا بالوصل، ومكسور بغيره (golden: wasl_hamza_ramal). وفي الموضعين تُعرض القراءتان على الوزن وهو الذي يحسم، فلم تُفرض إحداهما.",
        "الفرق بين «حرف موصول + أل» وبين كلمةٍ رسمُها كرسمها («بالطيب» و«والدي») لا يُحسم من الرسم وحده. والمحرك يقدّم قراءة «أل» — وهي الغالبة — بشرطٍ بنيويّ (حرفان على الأقل بعد اللام) يُخرج أكثر الملتبس، وبقائمة استثناءات في lexicon.article.exceptions. وما يفوت القائمة يُقرأ «أل» خطأً. يحسمه: قائمة أوفى، أو تحليل صرفي — وكلاهما بيانات لا كود."
      ]
    }
  },
  "rhyme": {
    "description": "قواعد القافية. مصدرها علم القافية الخليلي المدوَّن، لا اجتهاد: حدودها وأنواعها وحروفها معرَّفة هنا بيانًا لا كودًا، فتعديلها تعديلُ هذا الملف وحده.",
    "bounds": {
      "rule": "القافية من آخر ساكن في الشطر إلى أول ساكن يسبقه، مع المتحرك الذي قبل ذلك الساكن.",
      "source": "تعريف الخليل بن أحمد، وهو التعريف الجاري في كتب العروض.",
      "note": "الحدّ يُحسب على الوحدات الصوتية لا على الرسم: الحرف المشدَّد وحدتان، والتنوين نون ساكنة، واللام الشمسية لا تُنطق."
    },
    "types": {
      "rule": "نوع القافية يُحدَّد بعدد المتحركات الواقعة بين ساكنَي القافية.",
      "byMovingCount": [
        {
          "count": 0,
          "id": "mutaradif",
          "name": "المترادف",
          "definition": "ساكنان متجاوران لا متحرك بينهما.",
          "feminine": "مترادفة"
        },
        {
          "count": 1,
          "id": "mutawatir",
          "name": "المتواتر",
          "definition": "متحرك واحد بين الساكنين.",
          "feminine": "متواترة"
        },
        {
          "count": 2,
          "id": "mutadarik",
          "name": "المتدارك",
          "definition": "متحركان بين الساكنين.",
          "feminine": "متداركة"
        },
        {
          "count": 3,
          "id": "mutarakib",
          "name": "المتراكب",
          "definition": "ثلاثة متحركات بين الساكنين.",
          "feminine": "متراكبة"
        },
        {
          "count": 4,
          "id": "mutakawis",
          "name": "المتكاوس",
          "definition": "أربعة متحركات بين الساكنين، وهو أقصى ما يقع.",
          "feminine": "متكاوسة"
        }
      ],
      "beyondMax": {
        "id": "unknown",
        "name": "خارج الأنواع الخمسة",
        "note": "أكثر من أربعة متحركات بين الساكنين لا يقع في القافية العربية. وقوعه هنا يعني غالبًا أن الشطر ناقص أو أن التشكيل غير كافٍ، فلا يُسمّى نوعًا مخترعًا.",
        "feminine": "خارج الأنواع الخمسة"
      }
    },
    "release": {
      "rule": "القافية المطلقة رويُّها متحرك، والمقيَّدة رويُّها ساكن.",
      "mutlaqa": {
        "id": "mutlaqa",
        "name": "مطلقة",
        "definition": "الرويّ متحرك، وتُشبَع حركته في الإنشاد فيتولَّد عنها حرف وصل."
      },
      "muqayyada": {
        "id": "muqayyada",
        "name": "مقيَّدة",
        "definition": "الرويّ ساكن، فلا وصل بعده."
      }
    },
    "rawi": {
      "rule": "الرويّ آخر حرف صحيح يُبنى عليه الشطر وتلتزمه القصيدة.",
      "limitation": "الرويّ إنما يثبت بالتزام الشاعر إياه في كل بيت، فلا يُقطَع به من شطر واحد — وما يُعرض ترجيحٌ لا حكم.",
      "excludedWhenFinal": {
        "note": "هذه الحروف إذا وقعت آخر الشطر كانت وصلًا لا رويًّا، فيُتجاوَز إلى ما قبلها.",
        "letters": [
          "ا",
          "و",
          "ي",
          "ه"
        ],
        "condition": "ساكنًا تابعًا لحركة قبله (وصلًا أو إشباعًا)، لا حرفًا أصليًّا في بنية الكلمة.",
        "note2": "تمييز الوصل من الأصلي يقينًا يحتاج صرفًا لا يملكه المحرك، فيُنبَّه على الاحتمال ولا يُستبعد الحرف."
      }
    },
    "ridf": {
      "rule": "الردف حرف مدّ أو لين ساكن يقع قبل الرويّ بلا فاصل.",
      "maddLetters": [
        "ا",
        "و",
        "ي"
      ],
      "note": "لا ردف إلا بمدّ أو لين ملاصق للرويّ؛ فإن فصل بينهما حرف فليس بردف.",
      "qualifier": "مردوفة"
    },
    "tasees": {
      "rule": "التأسيس ألف بينها وبين الرويّ حرف واحد متحرك يسمّى الدخيل.",
      "letter": "ا",
      "qualifier": "مؤسَّسة"
    },
    "nabatiSpecific": {
      "status": "NEEDS_VALIDATION",
      "note": "القواعد أعلاه قواعد القافية العربية المدوَّنة، وهي المطبَّقة هنا. ما يخصّ النبطي وحده لم يُنفَّذ لأن المادة المصدرية لم تُقدَّم — والبند 26 يمنع اختراعه.",
      "knownGaps": [
        "القصيدة النبطية كثيرًا ما تلتزم قافيتين: قافية للصدر وقافية للعجز. تمييزهما يحتاج القصيدة كاملة لا شطرًا واحدًا، والمحرك الآن يحلّل قافية كل شطر على حدة ولا يدّعي أكثر من ذلك.",
        "تسكين أواخر الكلمات في النطق النبطي قد يغيّر إطلاق القافية (مطلقة/مقيَّدة) عمّا يوحي به الرسم — يحتاج أبياتًا نبطية مقطَّعة للتحقّق.",
        "هل يُعتدّ في النبطي بالتأسيس والدخيل كما في الفصيح؟ لم تُقدَّم مادة تثبته أو تنفيه."
      ],
      "resolvedBy": [
        "قصيدة نبطية كاملة (٦ أبيات فأكثر) مع بيان رويّها",
        "أمثلة على قافية مقيَّدة وأخرى مطلقة من الشعر النبطي"
      ]
    },
    "classification": {
      "rule": "توصف القافية بإطلاقها أوّلًا، ثم بردفها أو تأسيسها إن وُجد: «مقيَّدة مردوفة»، «مطلقة مؤسَّسة».",
      "note": "هذا وصفها لا حدُّها. وحدُّها عدد المتحركات بين ساكنيها — انظر types."
    }
  },
  "goldenCases": {
    "description": "حالات مرجعية للمحرك نفسه، لا لواجهة أي تطبيق. كل حالة مستقلة وقابلة للتشغيل وحدها.",
    "conventions": {
      "syllables": "S قصير، L طويل، X مفرط الطول",
      "source": "hand_verified = قطّعتُها يدويًا بقواعد العروض قبل تشغيل المحرك | app = من تطبيق ميزان النبط | derived = مشتقّة من البيانات نفسها",
      "note": "أي حالة مصدرها app لم تُضَف بعد — لم يُقدَّم شيء منها. القسم pending يبيّن ما ينقص."
    },
    "phonology": [
      {
        "id": "shadda_splits",
        "title": "المشدّد ساكن + متحرك",
        "input": "مَدَّ",
        "expectSyllables": [
          "L",
          "L"
        ],
        "why": "مَدْ + دَ، والفتحة الأخيرة تُشبَع في آخر الشطر",
        "source": "hand_verified"
      },
      {
        "id": "tanween_is_noon",
        "title": "التنوين نون ساكنة",
        "input": "كِتَابٌ",
        "expectSyllables": [
          "S",
          "L",
          "L"
        ],
        "why": "كِ + تَا + بُنْ — وهي بعينها فَعُولُنْ",
        "source": "hand_verified"
      },
      {
        "id": "lam_shamsiyya",
        "title": "اللام الشمسية لا تُنطق والحرف بعدها مشدّد",
        "input": "الشَّمْسُ",
        "expectSyllables": [
          "L",
          "L",
          "L"
        ],
        "why": "أَشْ + شَمْ + سُ ← ثلاثة مقاطع، وإشباع الضمة يجعل الأخير طويلًا",
        "source": "hand_verified"
      },
      {
        "id": "lam_qamariyya",
        "title": "اللام القمرية تُنطق",
        "input": "الْقَمَرُ",
        "expectSyllables": [
          "L",
          "S",
          "S",
          "L"
        ],
        "why": "أَلْ + قَ + مَ + رُ ← الميم مفتوحة مقطعًا مفتوحًا، والراء تُشبَع",
        "source": "hand_verified"
      },
      {
        "id": "madd_letters",
        "title": "حروف المدّ تُطيل المقطع",
        "input": "قَالُوا",
        "expectSyllables": [
          "L",
          "L"
        ],
        "why": "قَا + لُو، وألف التفريق غير منطوقة",
        "source": "hand_verified"
      },
      {
        "id": "silent_alef_jamaa",
        "title": "ألف التفريق لا تُحتسب",
        "input": "كَتَبُوا",
        "expectSyllables": [
          "S",
          "S",
          "L"
        ],
        "why": "كَ + تَ + بُو — ثلاثة مقاطع لا أربعة",
        "source": "hand_verified"
      },
      {
        "id": "diphthong_bayt",
        "title": "اللين يغلق المقطع",
        "input": "بَيْتٌ",
        "expectSyllables": [
          "L",
          "L"
        ],
        "why": "بَيْ + تُنْ",
        "source": "hand_verified"
      },
      {
        "id": "wasl_shortens_madd",
        "title": "التقاء الساكنين يقصر حرف المدّ",
        "input": "فِي الْبَيْتِ",
        "expectSyllables": [
          "L",
          "L",
          "L"
        ],
        "why": "فِلْ + بَيْ + تِ ← ياء «في» تسقط عند التقاء الساكنين، والكسرة تُشبَع",
        "source": "hand_verified"
      },
      {
        "id": "hamzat_wasl_line_start",
        "title": "همزة الوصل تُنطق في أول الشطر",
        "input": "الْبَيْتُ",
        "expectSyllables": [
          "L",
          "L",
          "L"
        ],
        "why": "أَلْ + بَيْ + تُ ← وإشباع الضمة يجعل الأخير طويلًا",
        "source": "hand_verified"
      },
      {
        "id": "unwritten_alef",
        "title": "ألف تُنطق ولا تُكتب",
        "input": "هذا",
        "expectSyllables": [
          "L",
          "L"
        ],
        "why": "هَا + ذَا",
        "source": "hand_verified"
      },
      {
        "id": "lam_qamariyya_sukun",
        "title": "اللام القمرية مع سكون آخر الشطر = فاعلن",
        "input": "الْقَمَرْ",
        "expectSyllables": [
          "L",
          "S",
          "L"
        ],
        "why": "أَلْ + قَ + مَرْ — نمط فَاعِلُنْ بعينه",
        "source": "hand_verified"
      },
      {
        "id": "overlong_at_line_end",
        "title": "المقطع المفرط الطول لا يقع إلا في آخر الشطر",
        "input": "كِتَابْ",
        "expectSyllables": [
          "S",
          "X"
        ],
        "why": "كِ + تَابْ ← التقاء الساكنين جائز في آخر الشطر فيبقى المقطع مفرطًا (X). ووسط الشطر يقصر حتمًا إلى L، وهو ما تختبره حالة wasl_shortens_madd.",
        "source": "hand_verified"
      }
    ],
    "meterSelfCheck": {
      "description": "كل بحر يجب أن يطابق نمطه هو بدرجة تامة. تُشتق آليًا من meters.json فلا تحتاج صيانة عند إضافة بحر.",
      "requiredScore": 1
    },
    "verses": [
      {
        "id": "wasl_hamza_ramal",
        "title": "وصل الهمزة يفتح القراءة الصحيحة: فاعلاتن أربعًا",
        "input": "لا إله الّا انت يا قضّاي حاجات البريّه",
        "expectedTafaeel": [
          "فاعلاتن",
          "فاعلاتن",
          "فاعلاتن",
          "فاعلاتن"
        ],
        "expectedConfidenceRange": [
          1,
          1
        ],
        "why": "تقطيع التطبيق المرجعي حرفًا حرفًا: لا|إلا|هل ، لن|تيا|قض ، ضا|يحا|جا ، تل|بري|يه. ولا تُبلَغ هذه القراءة إلا بسقوط همزتي «الّا» و«انت» في الدرج، وقصر المدّ قبلهما لالتقاء الساكنين. وقبل إثبات الوصل كان المحرك يقرأ التفعيلة الثالثة LLLL فيكسر البيت.",
        "meterNote": "اسم البحر متروك عمدًا: أسماء البحور تختلف بين أطياف المجتمع، والمقيس هنا التفعيلات لا الاسم.",
        "source": "app"
      },
      {
        "id": "article_after_proclitic",
        "title": "«أل» بعد حرف موصول، والحرف المرسوم أولى بأن يُقرأ على أصله",
        "input": "ودّنا بالطيب بسّ الدهر جحّاد طيب",
        "expectedTafaeel": [
          "فاعلاتن",
          "فاعلن",
          "فاعلاتن",
          "فاعلات"
        ],
        "expectedConfidenceRange": [
          1,
          1
        ],
        "why": "تقطيع التطبيق المرجعي حرفًا حرفًا: ود|دنا|بط ، طي|ببس ، سد|دهر|جح ، حا|دطي|ب. ويجتمع فيه ثلاثة: «بالطيب» بِطْطِيب لا بَالطيب، وألف «جحّاد» باقية لا مقصورة، وياء «طيب» مدٌّ لا صامت. وكان المحرك قبلها يقرأ فاعلاتن فاعلاتن فاعلن فاعلن على «حدطيب».",
        "meterNote": "اسم البحر متروك عمدًا — والمصدر يسمّي التفعيلة الأخيرة «فاعلان» وهي في هذه القاعدة «فاعلات»، والوزن واحد (/0//0 0).",
        "source": "app"
      },
      {
        "id": "hajini_three_feet",
        "title": "بحر «هجيني»: مستفعلن فاعلن فعلن",
        "input": "صعيب مهما تساهلته",
        "expectedMeter": "hajini",
        "expectedTafaeel": [
          "مستفعلن",
          "فاعلن",
          "فعلن"
        ],
        "why": "تقطيع التطبيق المرجعي: صعي|بمه ، ما|تسا ، هل|ته — مفاعلن فاعلن فاعل، وهي مستفعلن مخبونة وفاعلن وفعلن. وقبل إقرار البحر لم يكن في القائمة شكلٌ من تسعة مقاطع يوافقه، فكان المحرك يقرأ «تساهلته» تَسَاهَلَتَهَا ويلزمه الخبل.",
        "source": "app"
      },
      {
        "id": "madeed_turuq_akhar",
        "title": "بحر «المديد طرق آخر»: فاعلاتن فاعلاتن مفاعيلن",
        "input": "العب المنكوس واحبّ روباعه",
        "expectedMeter": "al_madeed_2",
        "expectedTafaeel": [
          "فاعلاتن",
          "فاعلاتن",
          "مفاعيلن"
        ],
        "expectedConfidenceRange": [
          1,
          1
        ],
        "why": "تقطيع التطبيق المرجعي: ال|عبل|من ، كو|سوا|حب ، برو|با|عه. وقبل إقرار البحر لم يكن في القائمة شكلٌ من اثني عشر مقطعًا يوافقه، فكان المحرك يقرأ «المنكوس» مَنْكَوَسْ — بالواو صامتًا لا مدًّا — ليبلغ «الهجيني - طرق 2».",
        "source": "app"
      },
      {
        "id": "ishbaa_not_free",
        "title": "الإشباع المفترض رخصة: «جلاده» جَ‑لَا‑دَهْ لا جَ‑لَا‑دَ‑هَا",
        "input": "حياتي كلّها صبْرو جلاده",
        "expectedTafaeel": [
          "مفاعيلن",
          "مفاعيلن",
          "مفاعيلن"
        ],
        "why": "تقطيع التطبيق المرجعي: حيا|تي|كل ، لها|صب|رو ، جلا|ده = مفاعيلن مفاعيلن فعولن (حذف مفاعيلن). وكان المحرك يقرأ الضرب مقبوضًا (مفاعلن) — وذاك يوجب حركةً مفترضة على هاء «جلاده» ثم إشباعها، فيزيد حرفًا لا رسم له. والزحاف أرخص من العلّة، فكان يسبقها؛ فلمّا كُلّفت الرخصةُ كلفتَها تقدّم الحذف.",
        "meterNote": "اسم البحر متروك عمدًا: هو «الصخري» في المصدر المرجعي و«الوافر» في هذه القائمة، والتفعيلات واحدة. والمقيس هنا الأصولُ الثلاثة؛ وصورة الضرب — فعولن بالحذف — تُقاس في اختبار الرخص.",
        "source": "app"
      }
    ],
    "pending": {
      "description": "ما ينقص لإكمال مجموعة الاختبار. كل بند هنا يمنع تثبيت قاعدة ما.",
      "items": [
        {
          "need": "٣ أبيات على الأقل لكل بحر من البحور الاثني عشر المفعَّلة، مع تقطيعها من تطبيق ميزان النبط",
          "unblocks": "حالات verses الحقيقية، ومعايرة أوزان scoring.json على سلوك مرجعي"
        },
        {
          "need": "بيت صخري واحد مقطَّع",
          "unblocks": "حسم تفعيلة «مفاعلاتن» بين ما ورد وبين مفاعلتن ومفاعيلن"
        },
        {
          "need": "بيت هلالي طويل + بيت مسحوب، مقطَّعان",
          "unblocks": "تفعيل الهلالي الطويل — معطَّل الآن"
        },
        {
          "need": "٣ لقطات تُظهر النمط الرقمي في التطبيق لبحور مختلفة الطول",
          "unblocks": "ترميز nabati_app في encodings.json"
        },
        {
          "need": "تفعيلات السامري",
          "unblocks": "إعادة البحر المفقود من القائمة القديمة"
        },
        {
          "need": "أبيات نبطية عامية فيها تسكين أواخر الكلمات",
          "unblocks": "قواعد اللهجة في lexicon.nabatiDialect — فارغة عمدًا"
        }
      ]
    }
  }
};
export default DATA;
