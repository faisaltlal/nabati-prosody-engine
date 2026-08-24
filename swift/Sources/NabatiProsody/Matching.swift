import Foundation

/// السجلّ والمطابقة والدرجة.
///
/// إضافة بحر جديد لا تمسّ هذا الملف: البحور والصور والمعاملات كلها بيانات.

// MARK: - السجلّ

public struct Foot: Sendable {
    public let index: Int
    public let tafilaId: String
    public let plain: String
    public let salim: [SyllableWeight]
    public let variants: [Variation]
}

/// صيغة مبنيّة: تفعيلاتها ونمطها.
public struct BuiltForm: Sendable {
    public let role: String?
    public let sourceQuote: String?
    public let feet: [Foot]
    public let pattern: [SyllableWeight]
    public let tafaeelNames: [String]
}

public struct Meter: Sendable {
    public let id: String
    public let name: String
    public let aliases: [String]
    public let enabled: Bool
    public let status: String?
    public let sourceQuote: String?
    public let note: String?
    /// forms[0] صدر و forms[1] عجز — والعجز هو الصدر مع تذييل.
    public let forms: [BuiltForm]
    /// الصدر هو الصيغة المرجعية.
    public var feet: [Foot] { forms.first?.feet ?? [] }
    public var pattern: [SyllableWeight] { forms.first?.pattern ?? [] }
    public var tafaeelNames: [String] { forms.first?.tafaeelNames ?? [] }
}

public struct IntegrityProblem: Sendable {
    public let kind: String
    public let detail: String
}

public struct MeterRegistry: Sendable {
    public let meters: [Meter]
    public let enabled: [Meter]
    public let problems: [IntegrityProblem]
    public let notInSource: [NotInSource]
    private let byId: [String: Meter]

    public init(data: EngineData) {
        var problems: [IntegrityProblem] = []
        let tafilaById = Dictionary(uniqueKeysWithValues: data.tafaeel.map { ($0.id, $0) })

        func weights(_ raw: [String]) -> [SyllableWeight] {
            raw.compactMap { SyllableWeight(rawValue: $0) }
        }

        func variantsOf(_ id: String) -> [Variation] {
            // الصور المعطَّلة لا تدخل المطابقة — انظر Variation.enabled.
            if let v = data.variations[id] { return v.filter { $0.enabled != false } }
            problems.append(.init(kind: "missing_variations", detail: id))
            guard let t = tafilaById[id] else { return [] }
            return [Variation(id: "salim", name: "سالم", result: t.vocalized,
                              syllables: t.syllables, kind: "salim", scope: "any", severity: 1,
                              enabled: true)]
        }

        var built: [Meter] = []
        for m in data.meters {
            var forms: [BuiltForm] = []
            for form in m.forms ?? [] {
                var feet: [Foot] = []
                var pattern: [SyllableWeight] = []
                var names: [String] = []
                for (i, fid) in form.feet.enumerated() {
                    guard let t = tafilaById[fid] else {
                        problems.append(.init(kind: "unknown_tafila", detail: "\(m.id) → \(fid)"))
                        continue
                    }
                    feet.append(Foot(index: i, tafilaId: t.id, plain: t.plain,
                                     salim: weights(t.syllables), variants: variantsOf(t.id)))
                    pattern.append(contentsOf: weights(t.syllables))
                    names.append(t.plain)
                }
                forms.append(BuiltForm(role: form.role, sourceQuote: form.sourceQuote,
                                       feet: feet, pattern: pattern, tafaeelNames: names))
            }
            let sadrCount = forms.first?.pattern.count ?? 0
            if let declared = m.expectedSyllableCount, declared != sadrCount {
                problems.append(.init(kind: "syllable_count_mismatch",
                                      detail: "\(m.id): declared \(declared), derived \(sadrCount)"))
            }
            built.append(Meter(
                id: m.id, name: m.name, aliases: m.aliases ?? [],
                enabled: (m.enabled ?? true) && sadrCount > 0,
                status: m.status,
                sourceQuote: forms.compactMap { $0.sourceQuote }.joined(separator: "  /  "),
                note: m.note, forms: forms
            ))
        }

        // النمط المقطعي لكل تفعيلة يجب أن يوافق نمطها الحرفي الخليلي.
        for t in data.tafaeel {
            guard let declared = t.khalilLetters else { continue }
            let derived = t.syllables.map { $0 == "S" ? "1" : ($0 == "X" ? "100" : "10") }.joined()
            if derived != declared {
                problems.append(.init(kind: "tafila_pattern_mismatch",
                                      detail: "\(t.id): \(derived) ≠ \(declared)"))
            }
        }

        self.meters = built
        self.enabled = built.filter { $0.enabled }
        self.problems = problems
        self.notInSource = data.notInSource
        self.byId = Dictionary(uniqueKeysWithValues: built.map { ($0.id, $0) })
    }

    public func find(_ nameOrId: String) -> Meter? {
        if let m = byId[nameOrId] { return m }
        let needle = PureText.trim(nameOrId)
        return meters.first { $0.name == needle || $0.aliases.contains(needle) }
    }
}

// MARK: - الدرجة

public struct Scorer: Sendable {
    public let config: ScoringConfig

    public init(config: ScoringConfig) { self.config = config }

    public func substitutionCost(_ actual: SyllableWeight, _ expected: SyllableWeight) -> Double {
        if actual == expected { return 0 }
        let pair = Set([actual, expected])
        if pair == Set([SyllableWeight.L, .X]) { return config.weights.overlongMismatch }
        return config.weights.substitution
    }

    public func variationCost(_ v: Variation, isArudDarb: Bool) -> Double {
        let base = config.weights.variationKind[v.kind] ?? config.weights.variationKind["zihaf"] ?? 0
        let sev = config.weights.severityMultiplier[String(v.severity ?? 1)] ?? 1
        var cost = base * sev
        if v.scope == "arud_darb" && !isArudDarb { cost += config.weights.scopeViolation }
        return cost
    }

    public func positionMultiplier(isFirst: Bool, isArudDarb: Bool) -> Double {
        if isArudDarb { return config.weights.position.arudDarb }
        if isFirst { return config.weights.position.first }
        return config.weights.position.hashw
    }

    public func finalize(cost: Double, meterSyllables: Int, assumedVocalization: Bool)
        -> (score: Double, confidence: Double, normalizer: Double) {
        let n = max(Double(meterSyllables), config.normalizer.floor)
        let normalizer = n * config.normalizer.perSyllableCost
        let score = min(1, max(0, 1 - cost / normalizer))
        var confidence = score
        if assumedVocalization { confidence *= 1 - config.uncertainty.assumedVocalizationPenalty }
        return (round6(score), round6(confidence), round6(normalizer))
    }

    /// الحالات A/B/C/D. تفعيلة لم توافق أي صورة مأذون فيها كسرٌ بالتعريف،
    /// مهما ارتفعت الدرجة؛ والزحاف ليس منها لأن كلفته ليست كلفة محاذاة.
    public func classify(score: Double, brokenFeet: Int, totalFeet: Int) -> String {
        let t = config.thresholds
        if totalFeet > 0 && Double(brokenFeet) / Double(totalFeet) > t.maxBrokenFootRatio {
            return "unrecognized"
        }
        let byScore: String = score >= t.sound ? "sound"
            : score >= t.acceptable ? "acceptable"
            : score >= t.broken ? "broken" : "unrecognized"
        if brokenFeet > 0 && (byScore == "sound" || byScore == "acceptable") { return "broken" }
        return byScore
    }
}

func round6(_ x: Double) -> Double { (x * 1_000_000).rounded() / 1_000_000 }

// MARK: - مطابقة تفعيلة

public struct AlignOp: Sendable {
    public let op: String          // match | substitute | insert | delete
    public let expected: SyllableWeight?
    public let actual: SyllableWeight?
    /// المقطع الفعلي من المخطّط. يُحمَل هنا لأن التحليل يعيد بناء تقطيع
    /// البيت من القراءة التي اختارها البحر الفائز، لا من تقطيع حرّ —
    /// والنصّ غير المشكول لا تقطيع حرّ له أصلًا.
    public let edge: SyllableEdge?
}

struct FootMatch {
    let cost: Double
    let ops: [AlignOp]
    let actual: [SyllableWeight]
}

enum FootMatcher {
    /// خطوة رجوع مصغَّرة: أعداد فقط، بلا نصوص ولا مراجع.
    ///
    /// هذه أسخن حلقة في المحرك — تُستدعى ملايين المرات عند ترتيب البحور
    /// كلها. تخزين `AlignOp` هنا (وفيه نصوص) كان يُحدث تخصيصًا وعدَّ
    /// مراجع عند كل تحسين، فأبطأ اختبارات Swift إبطاءً شديدًا. صارت
    /// العمليات تُبنى بعد انتهاء الحساب، للمسار الفائز وحده.
    private struct Back {
        var prev: Int32 = -1
        var op: UInt8 = 0     // 0 لا شيء، 1 مطابقة، 2 إبدال، 3 زيادة، 4 نقص
        var node: Int32 = -1  // موضع الحافة: dag.edges[node][slot]
        var slot: Int32 = -1
    }

    /// كلفة الرخصة الكامنة في الحافة نفسها — لا في مطابقتها للنمط.
    ///
    /// الحرف المرسوم أولى بأن يُقرأ على أصله: الإعراض عن حرف مدٍّ رسمه
    /// الشاعر — بقصره لسكونٍ مفترض أو بقراءته صامتًا — رخصةٌ تُكلَّف،
    /// لا أصلٌ يُساوي غيره. وهي كلفة لا منع.
    @inline(__always)
    static func licenceCost(_ e: SyllableEdge, _ w: ScoringConfig.Weights) -> Double {
        let cost = w.writtenMaddIgnored ?? 0
        if e.shortenedForAssumedSukun { return cost }
        if e.maddAsConsonant && e.nucleusAssumed { return cost }
        // وجهُها الآخر: زيادةُ حرفٍ لا رسم له ولا حركةَ تحته معلومة.
        // ولا تُحتسب على حركةٍ شكّلها الشاعر.
        if e.ishbaa && e.nucleusAssumed { return w.assumedIshbaa ?? 0 }
        return 0
    }

    /// محاذاة بأقل كلفة بين مسارات المخطّط ونمط صورة واحدة.
    static func match(dag: SyllableDag, from: Int, pattern: [SyllableWeight], scorer: Scorer) -> [Int: FootMatch] {
        let n = dag.size
        guard from <= n else { return [:] }
        let P = pattern.count
        let w = scorer.config.weights
        let stride = P + 1
        @inline(__always) func key(_ u: Int, _ p: Int) -> Int { u * stride + p }

        // مصفوفتان مسطَّحتان بدل قاموسين: لا تجزئة ولا تخصيص في الحلقة.
        var dist = [Double](repeating: .infinity, count: (n + 1) * stride)
        var back = [Back](repeating: Back(), count: (n + 1) * stride)
        dist[key(from, 0)] = 0

        // الحواف تتقدّم بموضع الوحدات، والنقص بموضع النمط، فترتيب
        // (u تصاعديًا ثم p تصاعديًا) كافٍ بلا طابور أولوية.
        for u in from...n {
            let edges = dag.edges[u]
            for p in 0...P {
                let k = key(u, p)
                let c = dist[k]
                if c == .infinity { continue }

                if p < P {
                    let nk = key(u, p + 1)
                    let nc = c + w.deletion
                    if nc < dist[nk] - 1e-12 {
                        dist[nk] = nc
                        back[nk] = Back(prev: Int32(k), op: 4, node: -1, slot: -1)
                    }
                }

                for (slot, e) in edges.enumerated() {
                    // كلفة الحافة نفسها تدخل الحساب هنا لا بعده، فتختار
                    // المحاذاة القراءة الأقلّ رخصةً من تلقاء نفسها.
                    let lic = licenceCost(e, w)
                    if p < P {
                        let sc = scorer.substitutionCost(e.weight, pattern[p])
                        let nk = key(e.to, p + 1)
                        let nc = c + sc + lic
                        if nc < dist[nk] - 1e-12 {
                            dist[nk] = nc
                            back[nk] = Back(prev: Int32(k), op: sc == 0 ? 1 : 2,
                                            node: Int32(u), slot: Int32(slot))
                        }
                    }
                    let nk = key(e.to, p)
                    let nc = c + w.insertion + lic
                    if nc < dist[nk] - 1e-12 {
                        dist[nk] = nc
                        back[nk] = Back(prev: Int32(k), op: 3, node: Int32(u), slot: Int32(slot))
                    }
                }
            }
        }

        var results: [Int: FootMatch] = [:]
        let start = key(from, 0)
        for u in from...n {
            let k = key(u, P)
            let c = dist[k]
            if c == .infinity { continue }

            var ops: [AlignOp] = []
            var cur = k
            while cur != start {
                let b = back[cur]
                if b.prev < 0 { break }
                let edge: SyllableEdge? = b.node >= 0
                    ? dag.edges[Int(b.node)][Int(b.slot)] : nil
                // موضع النمط قبل الانتقال هو الذي يحدّد المقطع المتوقَّع.
                let prevP = Int(b.prev) % stride
                let expected: SyllableWeight? = (b.op == 3 || prevP >= P) ? nil : pattern[prevP]
                let name: String
                switch b.op {
                case 1: name = "match"
                case 2: name = "substitute"
                case 3: name = "insert"
                default: name = "delete"
                }
                ops.append(AlignOp(op: name, expected: expected,
                                   actual: edge?.weight, edge: edge))
                cur = Int(b.prev)
            }
            ops.reverse()
            let actual = ops.compactMap { $0.actual }
            results[u] = FootMatch(cost: c, ops: ops, actual: actual)
        }
        return results
    }

    /// أقل عدد مقاطع يستهلك ما بقي من الوحدات، لتسعير ذيل البيت.
    static func minSyllablesToEnd(_ dag: SyllableDag) -> [Double] {
        var best = [Double](repeating: .infinity, count: dag.size + 1)
        best[dag.size] = 0
        guard dag.size > 0 else { return best }
        for u in stride(from: dag.size - 1, through: 0, by: -1) {
            for e in dag.edges[u] where best[e.to] + 1 < best[u] {
                best[u] = best[e.to] + 1
            }
        }
        return best
    }
}

// MARK: - مطابقة البحر

public struct ChosenFoot: Sendable {
    public let footIndex: Int
    public let hemistich: Int
    public let tafila: String
    public let variantId: String
    public let variantName: String
    public let realized: String?
    public let variantKind: String
    public let expected: [SyllableWeight]
    public let actual: [SyllableWeight]
    public let unitSpan: Range<Int>
    public let alignCost: Double
    public let ops: [AlignOp]
}

public struct BrokenFoot: Sendable {
    public let footIndex: Int
    public let tafila: String
    public let expected: String
    public let actual: String
    public let cost: Double
    public let issues: [String]
}

public struct MeterMatch: Sendable {
    public let meterId: String
    public let name: String
    public let aliases: [String]
    public let status: String?
    public let repeatCount: Int
    /// صيغة كل شطر: فهرسها في `meter.forms`، مرتَّبةً بترتيب الأشطر.
    public let forms: [Int]
    /// دور صيغة الشطر الأول — صدر أو عجز.
    public let formRole: String?
    /// دور صيغة كل شطر على حدة ومرتَّبًا.
    public let formRoles: [String?]
    public let score: Double
    public let confidence: Double
    public let cost: Double
    public let normalizer: Double
    public let verdict: String
    public let feet: [ChosenFoot]
    public let brokenFeet: [BrokenFoot]
    public let leftoverSyllables: Double
    public let assumedVocalization: Bool
}

public enum MeterMatcher {
    private struct State { let cost: Double; let chosen: [ChosenFoot] }

    /// الصدر والعجز صورتان للبحر الواحد لا بحران، فيختار كل شطر صيغته
    /// باستقلال: `forms[i]` فهرس صيغة الشطر i.
    public static func match(dag: SyllableDag, meter: Meter, scorer: Scorer,
                             forms: [Int]) -> MeterMatch? {
        struct ExpandedFoot {
            let foot: Foot
            let hemistich: Int
            let isFirst: Bool
            let isArudDarb: Bool
        }
        guard !meter.forms.isEmpty, !forms.isEmpty else { return nil }
        let repeatCount = forms.count
        var expanded: [ExpandedFoot] = []
        for (r, wanted) in forms.enumerated() {
            let idx = min(max(wanted, 0), meter.forms.count - 1)
            let feet = meter.forms[idx].feet
            for (i, f) in feet.enumerated() {
                expanded.append(ExpandedFoot(foot: f, hemistich: r, isFirst: i == 0,
                                             isArudDarb: i == feet.count - 1))
            }
        }
        guard !expanded.isEmpty else { return nil }

        let tail = FootMatcher.minSyllablesToEnd(dag)
        var states: [Int: State] = [0: State(cost: 0, chosen: [])]

        for (fi, ef) in expanded.enumerated() {
            var next: [Int: State] = [:]
            let posMult = scorer.positionMultiplier(isFirst: ef.isFirst, isArudDarb: ef.isArudDarb)
            for (u, state) in states {
                for variant in ef.foot.variants {
                    let vCost = scorer.variationCost(variant, isArudDarb: ef.isArudDarb)
                    let pattern = variant.syllables.compactMap { SyllableWeight(rawValue: $0) }
                    let ends = FootMatcher.match(dag: dag, from: u, pattern: pattern, scorer: scorer)
                    for (end, res) in ends {
                        var cost = state.cost + (vCost + res.cost) * posMult
                        if end == u { cost += scorer.config.weights.unfilledFoot }
                        if let prev = next[end], prev.cost <= cost + 1e-12 { continue }
                        let chosen = ChosenFoot(
                            footIndex: fi, hemistich: ef.hemistich, tafila: ef.foot.plain,
                            variantId: variant.id, variantName: variant.name,
                            realized: variant.result, variantKind: variant.kind,
                            expected: pattern, actual: res.actual,
                            unitSpan: u..<max(u, end), alignCost: res.cost, ops: res.ops
                        )
                        next[end] = State(cost: cost, chosen: state.chosen + [chosen])
                    }
                }
            }
            states = next
            if states.isEmpty { return nil }
        }

        var best: (total: Double, state: State, leftover: Double)?
        for (u, state) in states {
            let leftover = tail[u]
            guard leftover.isFinite else { continue }
            let total = state.cost + leftover * scorer.config.weights.unconsumedSyllable
            if best == nil || total < best!.total - 1e-12 {
                best = (total, state, leftover)
            }
        }
        guard let b = best else { return nil }

        let meterSyllables = expanded.reduce(0) { $0 + $1.foot.salim.count }
        let f = scorer.finalize(cost: b.total, meterSyllables: meterSyllables,
                                assumedVocalization: dag.assumedVocalization)

        let threshold = scorer.config.brokenFoot.minCostToReport
        let broken = b.state.chosen
            .filter { $0.alignCost >= threshold || $0.actual.isEmpty }
            .map { c in
                BrokenFoot(
                    footIndex: c.footIndex, tafila: c.tafila,
                    expected: c.expected.map { $0.rawValue }.joined(),
                    actual: c.actual.map { $0.rawValue }.joined().isEmpty ? "—" : c.actual.map { $0.rawValue }.joined(),
                    cost: round6(c.alignCost),
                    issues: describe(c.ops)
                )
            }

        return MeterMatch(
            meterId: meter.id, name: meter.name, aliases: meter.aliases, status: meter.status,
            repeatCount: repeatCount, forms: forms,
            formRole: meter.forms[min(max(forms[0], 0), meter.forms.count - 1)].role,
            formRoles: forms.map { meter.forms[min(max($0, 0), meter.forms.count - 1)].role },
            score: f.score, confidence: f.confidence,
            cost: round6(b.total), normalizer: f.normalizer,
            verdict: scorer.classify(score: f.score, brokenFeet: broken.count, totalFeet: b.state.chosen.count),
            feet: b.state.chosen, brokenFeet: broken,
            leftoverSyllables: b.leftover, assumedVocalization: dag.assumedVocalization
        )
    }

    private static func describe(_ ops: [AlignOp]) -> [String] {
        var out: [String] = []
        var pos = 0
        for o in ops {
            switch o.op {
            case "match": pos += 1
            case "substitute":
                out.append("المقطع \(pos + 1): البحر يطلب \(o.expected?.rawValue ?? "?") والبيت أعطى \(o.actual?.rawValue ?? "?")")
                pos += 1
            case "insert":
                out.append("مقطع \(o.actual?.rawValue ?? "?") زائد لا موضع له في التفعيلة")
            case "delete":
                out.append("المقطع \(pos + 1): البحر يطلب \(o.expected?.rawValue ?? "?") ولا مقابل له في البيت")
                pos += 1
            default: break
            }
        }
        return out
    }

    /// ترتيب لا إجابة واحدة.
    public static func rank(dag: SyllableDag, registry: MeterRegistry, scorer: Scorer,
                            repeats: [Int] = [1], units: [PhonUnit] = []) -> [MeterMatch] {
        var out: [MeterMatch] = []
        for meter in registry.enabled {
            var bestForMeter: MeterMatch?
            for r in repeats {
                // كل شطر يختار صدرًا أو عجزًا باستقلال، فتُجرَّب كل التوليفات.
                for combo in formCombinations(formCount: meter.forms.count, repeatCount: r) {
                    guard let m = match(dag: dag, meter: meter, scorer: scorer,
                                        forms: combo) else { continue }
                    if bestForMeter == nil || m.score > bestForMeter!.score { bestForMeter = m }
                }
            }
            if let b = bestForMeter { out.append(b) }
        }

        // ترتيب المصدر: صاحب القائمة قدّم المسحوب على سائر البحور،
        // واتّباعه أولى من اتّباع الهجاء.
        var order: [String: Int] = [:]
        for (k, m) in registry.meters.enumerated() { order[m.id] = k }

        let preferSukun = scorer.config.ranking.preferFinalSukun ?? true
        let finals = Dictionary(uniqueKeysWithValues: out.map {
            ($0.meterId, preferSukun ? assumedFinalVowels($0.feet, units) : 0)
        })

        out.sort { a, b in
            if a.score != b.score { return a.score > b.score }
            let fa = finals[a.meterId] ?? 0, fb = finals[b.meterId] ?? 0
            if fa != fb { return fa < fb }
            let oa = order[a.meterId] ?? Int.max, ob = order[b.meterId] ?? Int.max
            if oa != ob { return oa < ob }
            return a.meterId < b.meterId
        }
        return out
    }

    /// كم حركةً مفترضة وقعت على آخر كلمة؟ ترجيحٌ عند التساوي التامّ،
    /// مستنده أن النبطي يُسكّن الأواخر ولا إعراب فيه. لا كلفة ولا منع.
    static func assumedFinalVowels(_ feet: [ChosenFoot], _ units: [PhonUnit]) -> Int {
        guard !units.isEmpty, !feet.isEmpty else { return 0 }
        let last = units.count - 1
        var n = 0
        for foot in feet {
            for op in foot.ops {
                guard let e = op.edge, e.coda == nil, e.nucleusAssumed else { continue }
                let i = e.onsetIndex
                guard i >= 0, i < units.count, units[i].wordFinal, i != last else { continue }
                n += 1
            }
        }
        return n
    }

    /// كل توليفات الصيغ الممكنة لعدد أشطر معلوم.
    /// بحرٌ بصيغتين في بيت من شطرين يعطي أربع توليفات، والوزن يحسم أيّها.
    static func formCombinations(formCount: Int, repeatCount: Int) -> [[Int]] {
        guard formCount > 0, repeatCount > 0 else { return [] }
        var out: [[Int]] = [[]]
        for _ in 0..<repeatCount {
            var next: [[Int]] = []
            for prefix in out {
                for f in 0..<formCount { next.append(prefix + [f]) }
            }
            out = next
        }
        return out
    }
}
