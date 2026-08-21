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
        "id": "failun_short",
        "plain": "فعلن",
        "vocalized": "فَعِلُنْ",
        "syllables": [
          "S",
          "S",
          "L"
        ],
        "khalilLetters": "1110",
        "family": "base",
        "note": "الرسم «فعلن» يحتمل فَعِلُنْ وفَعْلُنْ — التمييز صورةٌ في variations لا تفعيلتان."
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
        "vocalized": "فَعِلَانْ",
        "syllables": [
          "S",
          "S",
          "X"
        ],
        "khalilLetters": "11100",
        "family": "mudhayyal",
        "baseOf": "failun_short"
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
          "result": "فَعُولْ",
          "syllables": [
            "S",
            "L"
          ],
          "kind": "illa",
          "scope": "arud_darb",
          "severity": 1
        },
        {
          "id": "tadhyil",
          "name": "التذييل",
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
          "severity": 1
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
          "id": "tadhyil",
          "name": "التذييل",
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
          "result": "مُتَفْعِلُنْ",
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
          "severity": 1
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
          "id": "tadhyil",
          "name": "التذييل",
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
          "id": "tadhyil",
          "name": "التذييل",
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
      "failun_short": [
        {
          "id": "salim",
          "name": "سالم",
          "result": "فَعِلُنْ",
          "syllables": [
            "S",
            "S",
            "L"
          ],
          "kind": "salim",
          "scope": "any",
          "severity": 1
        },
        {
          "id": "faalun_reading",
          "name": "قراءة فَعْلُنْ",
          "result": "فَعْلُنْ",
          "syllables": [
            "L",
            "L"
          ],
          "kind": "ambiguous_reading",
          "scope": "any",
          "severity": 1
        },
        {
          "id": "tadhyil",
          "name": "التذييل",
          "result": "فَعِلَانْ",
          "syllables": [
            "S",
            "S",
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
          "result": "فَعِلَانْ",
          "syllables": [
            "S",
            "S",
            "X"
          ],
          "kind": "salim",
          "scope": "any",
          "severity": 1
        }
      ]
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
              "failun_short"
            ],
            "sourceQuote": "مفعولن مفاعيلن فعلن"
          },
          {
            "role": "ajz",
            "feet": [
              "mafulun",
              "mafailun",
              "failun_short"
            ],
            "sourceQuote": "مفعولن مفاعيلن فعلن"
          }
        ],
        "expectedSyllableCount": 10,
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
              "failun_short"
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
        "expectedSyllableCount": 11,
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
              "failun_short"
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
        "expectedSyllableCount": 14,
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
              "failun_short"
            ],
            "sourceQuote": "فاعلاتن فاعلن فاعلاتن فعلن"
          },
          {
            "role": "ajz",
            "feet": [
              "failatun",
              "failun",
              "failatun",
              "failun_short"
            ],
            "sourceQuote": "فاعلاتن فاعلن فاعلاتن فعلن"
          }
        ],
        "expectedSyllableCount": 14,
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
      "unfilledFoot": 1.5
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
      "minScoreToList": 0.35
    },
    "rationale": {
      "insertion_gt_substitution": "زيادة مقطع أو نقصه يغيّر بنية الشطر أكثر مما يغيّره تبدّل كمّية مقطع واحد، فكلفته أعلى.",
      "arudDarb_gt_hashw": "الخلل في العروض والضرب أشدّ إخلالًا بالسمع من مثله في الحشو، والعرف العروضي يشدّد فيهما.",
      "zihaf_not_free": "الزحاف مسموح لا مُستحبّ؛ تكلفته الصغيرة تجعل القراءة السالمة تتقدّم على المزاحَفة عند تساوي كل شيء آخر، دون أن تُسقط المزاحَفة.",
      "overlong_cheap": "التمييز بين المقطع الطويل والمفرط في آخر الشطر مسألة اصطلاح تدوين غالبًا، فلا يُعامَل معاملة الخطأ الكامل.",
      "normalizer_floor": "يمنع البحور القصيرة جدًا من تضخيم أثر خطأ واحد.",
      "ambiguity_penalty": "نصّ غير مشكول يقبل قراءات كثيرة، فقد يتساوى بحران في القمة. الدرجة تبقى كما هي — لأنها تصف المطابقة فعلًا — لكن الثقة تنخفض، لأن الثقة تصف يقيننا بالإجابة لا جودة المطابقة. الفرق بين الرقمين مقصود.",
      "tie_delta": "الفارق الذي يُعدّ دونه البحران متساويين. مشتق من كلفة زحاف واحد تقريبًا لا من التجربة — يُعاير حين تتوفر أمثلة مرجعية.",
      "max_broken_foot_ratio": "الدرجة وحدها لا تكفي للحكم. بيت اختلّت فيه كل تفعيلاته قد ينال درجة متوسطة لأن كل تفعيلة اختلّت بمقطع واحد فقط، فيبدو «قريبًا من البحر» وهو ليس كذلك: القرب من وزن معناه أن أكثره صحيح. فإذا تجاوزت نسبة التفعيلات المختلّة هذا الحدّ رُدَّ الحكم إلى «لا وزن مقنع» مهما كانت الدرجة. الدرجة تصف المسافة، والحكم يصف ما يصحّ أن يُقال للمستخدم."
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
        "تسكين أواخر الكلمات في النبطي أكثر منه في الفصيح — يؤثر مباشرة في المقاطع، ويحتاج أمثلة مقطَّعة",
        "الكشكشة والكسكسة — لا أثر وزني متوقَّع لكنها غير محسومة",
        "حذف همزة القطع في أول الكلمة في النطق العامي"
      ]
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
    "verses": [],
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
