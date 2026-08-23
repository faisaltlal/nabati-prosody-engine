import Foundation

/// نماذج البيانات وتحميلها.
///
/// المصدر الوحيد للحقيقة هو `data/*.json`. الملفات الموجودة تحت
/// `Resources/` نسخٌ مولَّدة منها بـ `tools/bundle-data.js`، ويتحقّق CI من
/// تطابقها. لا تحرّرها هنا.

// MARK: - التفعيلات

public struct Tafila: Codable, Sendable {
    public let id: String
    public let plain: String
    public let vocalized: String
    public let syllables: [String]
    public let khalilLetters: String?
    public let status: String?
}

struct TafaeelFile: Codable { let tafaeel: [Tafila] }

// MARK: - الزحافات والعلل

public struct Variation: Codable, Sendable {
    public let id: String
    public let name: String
    public let result: String?
    public let syllables: [String]
    public let kind: String
    public let scope: String
    public let severity: Int?
    /// صورة مسجَّلة ومعطَّلة: قاعدة وردت في المادة ولم تثبت في النبطي
    /// بعد. تبقى في البيانات ولا تدخل المطابقة، وتُعلَن في
    /// `openQuestions()` كي لا تُنسى.
    public let enabled: Bool?
}

struct VariationsFile: Codable { let variations: [String: [Variation]] }

// MARK: - البحور

/// صيغة واحدة من صيغتَي البحر: صدر أو عجز.
public struct MeterForm: Codable, Sendable {
    public let role: String?
    public let feet: [String]
    public let sourceQuote: String?
}

public struct MeterDef: Codable, Sendable {
    public let id: String
    public let name: String
    public let aliases: [String]?
    public let enabled: Bool?
    public let forms: [MeterForm]?
    public let expectedSyllableCount: Int?
    public let status: String?
    public let note: String?
}

public struct NotInSource: Codable, Sendable {
    public let name: String
    public let reason: String
    public let status: String
}

struct MetersFile: Codable {
    let meters: [MeterDef]
    let notInSource: [NotInSource]?
}

// MARK: - معاملات الدرجة

public struct ScoringConfig: Codable, Sendable {
    public struct Position: Codable, Sendable {
        public let first: Double
        public let hashw: Double
        public let arudDarb: Double
    }
    public struct Weights: Codable, Sendable {
        public let substitution: Double
        public let insertion: Double
        public let deletion: Double
        public let overlongMismatch: Double
        public let variationKind: [String: Double]
        public let severityMultiplier: [String: Double]
        public let scopeViolation: Double
        public let position: Position
        public let unconsumedSyllable: Double
        public let unfilledFoot: Double
    }
    public struct Normalizer: Codable, Sendable {
        public let perSyllableCost: Double
        public let floor: Double
    }
    public struct Uncertainty: Codable, Sendable {
        public let assumedVocalizationPenalty: Double
        public let ambiguityPenalty: Double
        public let tieDelta: Double
    }
    public struct Thresholds: Codable, Sendable {
        public let sound: Double
        public let acceptable: Double
        public let broken: Double
        public let maxBrokenFootRatio: Double
    }
    public struct BrokenFoot: Codable, Sendable { public let minCostToReport: Double }
    public struct Ranking: Codable, Sendable {
        public let maxAlternatives: Int
        public let minScoreToList: Double
    }

    public let weights: Weights
    public let normalizer: Normalizer
    public let uncertainty: Uncertainty
    public let thresholds: Thresholds
    public let brokenFoot: BrokenFoot
    public let ranking: Ranking
}

// MARK: - الترميز الرقمي

public struct EncodingScheme: Codable, Sendable {
    public let id: String
    public let name: String
    public let status: String
    public let level: String?
    public let map: [String: String]?
    public let separator: String?
    public let enabled: Bool?
}

struct EncodingsFile: Codable {
    let defaultScheme: String
    let schemes: [EncodingScheme]
}

// MARK: - المعجم

public struct Lexicon: Codable, Sendable {
    public struct WordMap: Codable, Sendable { public let words: [String: String] }
    public struct WordList: Codable, Sendable { public let words: [String]? }
    public struct SilentRule: Codable, Sendable {
        public let id: String
        public let action: String
        public let words: [String]?
    }
    public struct SilentLetters: Codable, Sendable { public let rules: [SilentRule] }
    public struct TaMarbuta: Codable, Sendable {
        public let midLine: String
        public let lineEnd: String
    }
    /// ظواهر اللهجة النبطية — `rules` فارغة عمدًا، والبند 26 يمنع
    /// اختراعها. تُعلَن ضمن `openQuestions()` كما تُعلَن في جافاسكربت.
    public struct NabatiDialect: Codable, Sendable {
        public let note: String?
        public let status: String?
        public let knownGaps: [String]?
    }

    public let unwrittenLongVowels: WordMap?
    public let knownVocalizations: WordMap?
    public let hamzatWasl: WordList?
    public let silentLetters: SilentLetters?
    public let sunLetters: [String]
    public let taMarbuta: TaMarbuta?
    public let nabatiDialect: NabatiDialect?
}

/// قواعد القافية. لا يقرأ التنفيذ في Swift منها إلا ما يلزم لإعلان
/// ما لم يُحسم — تحليل القافية نفسه منفَّذ في جافاسكربت وحده حتى الآن،
/// وهذا مسجَّل في OPEN-QUESTIONS.md. لكن **البند المعلَّق يجب أن
/// يُعلَن في التنفيذين معًا**، وإلا اختلفا فيما يعدّانه محسومًا.
public struct RhymeRules: Codable, Sendable {
    public struct NabatiSpecific: Codable, Sendable {
        public let status: String?
        public let note: String?
        public let knownGaps: [String]?
    }
    public let nabatiSpecific: NabatiSpecific?
}

// MARK: - الحالات المرجعية

public struct GoldenPhonologyCase: Codable, Sendable {
    public let id: String
    public let title: String
    public let input: String
    public let expectSyllables: [String]
    public let why: String
    public let source: String
}

/// حالة بيت كامل. الحقول المتوقَّعة كلها اختيارية: يُقاس ما نصّ عليه
/// المصدر ولا يُفترض ما سكت عنه — واسم البحر خاصّةً، فالأسماء تختلف
/// بين أطياف المجتمع والمقيس التفعيلات.
public struct GoldenVerseCase: Codable, Sendable {
    public let id: String
    public let title: String?
    public let input: String
    public let expectedMeter: String?
    public let expectedTafaeel: [String]?
    public let expectedConfidenceRange: [Double]?
    public let why: String
    public let source: String
}

struct GoldenFile: Codable {
    let phonology: [GoldenPhonologyCase]
    let verses: [GoldenVerseCase]
}

// MARK: - التجميع

public struct EngineData: Sendable {
    public let tafaeel: [Tafila]
    public let variations: [String: [Variation]]
    public let meters: [MeterDef]
    public let notInSource: [NotInSource]
    public let scoring: ScoringConfig
    public let encodings: [EncodingScheme]
    public let defaultScheme: String
    public let lexicon: Lexicon
    public let rhyme: RhymeRules
    public let goldenPhonology: [GoldenPhonologyCase]
    public let goldenVerses: [GoldenVerseCase]

    /// يحمّل البيانات من موارد الحزمة.
    ///
    /// نبني المسار بأنفسنا بدل `Bundle.url(forResource:withExtension:)`.
    /// السبب ليس ذوقًا: تلك الدالة تعبر جسر NSString في Foundation على
    /// لينكس، وتمرير نصّ حرفي إليها («json» و«Resources») أسقط اختبارات
    /// CI بـ «Constant strings cannot be deallocated». المسارات هنا
    /// نصوص مبنيّة بالاستيفاء لا حرفية، فلا تمرّ بذلك الجسر.
    public static func bundled() throws -> EngineData {
        let base = Bundle.module.resourcePath ?? Bundle.module.bundlePath
        let fm = FileManager.default

        func load<T: Decodable>(_ name: String, as type: T.Type) throws -> T {
            let file = name + ".json"
            for path in ["\(base)/Resources/\(file)", "\(base)/\(file)"] where fm.fileExists(atPath: path) {
                let data = try Data(contentsOf: URL(fileURLWithPath: path))
                return try JSONDecoder().decode(type, from: data)
            }
            throw EngineError.missingResource(name)
        }

        let t: TafaeelFile = try load("tafaeel", as: TafaeelFile.self)
        let v: VariationsFile = try load("variations", as: VariationsFile.self)
        let m: MetersFile = try load("meters", as: MetersFile.self)
        let s: ScoringConfig = try load("scoring", as: ScoringConfig.self)
        let e: EncodingsFile = try load("encodings", as: EncodingsFile.self)
        let l: Lexicon = try load("lexicon", as: Lexicon.self)
        let q: RhymeRules = try load("rhyme", as: RhymeRules.self)
        let g: GoldenFile = try load("golden_cases", as: GoldenFile.self)

        return EngineData(
            tafaeel: t.tafaeel,
            variations: v.variations,
            meters: m.meters,
            notInSource: m.notInSource ?? [],
            scoring: s,
            encodings: e.schemes,
            defaultScheme: e.defaultScheme,
            lexicon: l,
            rhyme: q,
            goldenPhonology: g.phonology,
            goldenVerses: g.verses
        )
    }
}

public enum EngineError: Error, CustomStringConvertible {
    case missingResource(String)
    case unknownMeter(String)
    case unknownScheme(String)

    public var description: String {
        switch self {
        case .missingResource(let n): return "ملف بيانات مفقود من الحزمة: \(n).json"
        case .unknownMeter(let n): return "بحر غير معروف: \(n)"
        case .unknownScheme(let n): return "ترميز غير معروف: \(n)"
        }
    }
}
