import XCTest
@testable import NabatiProsody

/// اختبارات حزمة Swift.
///
/// تُقرأ الحالات من نفس `golden_cases.json` الذي تقرؤه اختبارات
/// جافاسكربت، فأي انحراف بين التنفيذين يظهر هنا فشلًا لا يُخطَأ فيه.
final class EngineTests: XCTestCase {

    private func makeEngine() throws -> ProsodyEngine { try ProsodyEngine() }

    // MARK: البيانات

    func testDataLoads() throws {
        let engine = try makeEngine()
        XCTAssertEqual(engine.registry.meters.count, engine.data.meters.count)
        XCTAssertEqual(engine.registry.enabled.count, engine.data.meters.count,
                       "كل بحور المصدر مفعَّلة")
        XCTAssertGreaterThan(engine.registry.meters.count, 30)
    }

    func testNoIntegrityProblems() throws {
        let engine = try makeEngine()
        XCTAssertTrue(
            engine.registry.problems.isEmpty,
            "تعارض في البيانات: \(engine.registry.problems.map(\.detail))"
        )
    }

    func testEveryMeterHasAtLeastOneForm() throws {
        let engine = try makeEngine()
        for m in engine.registry.enabled {
            XCTAssertFalse(m.forms.isEmpty, "\(m.name) بلا صيغ")
            for f in m.forms {
                XCTAssertFalse(f.feet.isEmpty, "\(m.name) (\(f.role ?? "?")) بلا تفعيلات")
            }
        }
    }

    func testFindByName() throws {
        let engine = try makeEngine()
        XCTAssertEqual(engine.registry.find("المسحوب")?.id, "al_maskhub")
        XCTAssertEqual(engine.registry.find("al_ramal")?.name, "الرمل")
    }

    // MARK: الأصوات — نفس حالات جافاسكربت

    func testGoldenPhonology() throws {
        let engine = try makeEngine()
        for c in engine.data.goldenPhonology {
            let got = engine.syllabify(c.input).free.syllables.map { $0.weight.rawValue }
            XCTAssertEqual(got, c.expectSyllables, "\(c.id) — «\(c.input)» — \(c.why)")
        }
    }

    func testShaddaSplitsIntoTwoUnits() throws {
        let engine = try makeEngine()
        let units = engine.syllabify("مَدَّ").units
        XCTAssertEqual(units.count, 3, "م + د ساكنة + د متحركة")
        XCTAssertTrue(units[1].vowel.isSilent, "الأول من المشدّد ساكن")
    }

    func testTanweenBecomesNoon() throws {
        let engine = try makeEngine()
        let units = engine.syllabify("كِتَابٌ").units
        XCTAssertEqual(units.last?.consonant, Ar.noon)
        XCTAssertEqual(units.last?.vowel.isSilent, true)
    }

    func testSunLetterDropsLam() throws {
        let engine = try makeEngine()
        let units = engine.syllabify("الشَّمْسُ").units
        XCTAssertFalse(units.contains { $0.consonant == Ar.lam }, "اللام الشمسية لا تُنطق")
    }

    // MARK: المطابقة

    /// كل صيغة — صدرًا كانت أو عجزًا — تطابق نفسها مطابقة تامة.
    func testEveryFormMatchesItself() throws {
        let engine = try makeEngine()
        for meter in engine.registry.enabled {
            for (i, form) in meter.forms.enumerated() {
                let r = try engine.matchPattern(form.pattern, meter: meter.id, form: i)
                XCTAssertEqual(r.score, 1.0, accuracy: 1e-9,
                               "\(meter.name) (\(form.role ?? "?")) لا يطابق نفسه")
                XCTAssertTrue(r.brokenFeet.isEmpty, "\(meter.name) (\(form.role ?? "?")) فيه كسر")
                XCTAssertEqual(r.verdict, "sound", meter.name)
            }
        }
    }

    /// بيت شطراه على صيغتين مختلفتين يظل بحرًا واحدًا.
    /// الصدر والعجز صورتان للبحر الواحد، فيختار كل شطر صيغته باستقلال.
    func testBaytMixesFormsAndStaysOneMeter() throws {
        let engine = try makeEngine()
        var tested = 0
        for meter in engine.registry.enabled where meter.forms.count >= 2 {
            let sadr = meter.forms[0], ajz = meter.forms[1]
            // بحورٌ صدرها وعجزها سواء في المصدر لا فرق فيها يُفحص.
            if sadr.pattern == ajz.pattern { continue }
            let r = try engine.matchPattern(sadr.pattern + ajz.pattern,
                                            meter: meter.id, forms: [0, 1])
            XCTAssertEqual(r.score, 1.0, accuracy: 1e-9,
                           "\(meter.name) صدرًا فعجزًا لا يطابق نفسه")
            XCTAssertEqual(r.formRoles.map { $0 ?? "?" }, [sadr.role ?? "?", ajz.role ?? "?"],
                           "\(meter.name) لم يُنسب كل شطر إلى صيغته")
            tested += 1
        }
        XCTAssertGreaterThan(tested, 0, "لا بحر بصيغتين مختلفتين — الفحص بلا معنى")
    }

    /// توليفات الصيغ: بحر بصيغتين في بيت من شطرين يعطي أربع توليفات.
    func testFormCombinationsCoverEveryHemistichIndependently() {
        XCTAssertEqual(MeterMatcher.formCombinations(formCount: 2, repeatCount: 1),
                       [[0], [1]])
        XCTAssertEqual(MeterMatcher.formCombinations(formCount: 2, repeatCount: 2),
                       [[0, 0], [0, 1], [1, 0], [1, 1]])
        XCTAssertEqual(MeterMatcher.formCombinations(formCount: 1, repeatCount: 2), [[0, 0]])
        XCTAssertEqual(MeterMatcher.formCombinations(formCount: 0, repeatCount: 2), [])
    }

    func testEveryFormTopsItsOwnPattern() throws {
        let engine = try makeEngine()
        for meter in engine.registry.enabled {
            for form in meter.forms {
                let ranked = engine.rankPattern(form.pattern)
                let top = ranked.filter { $0.score >= ranked[0].score - 1e-9 }.map(\.meterId)
                XCTAssertTrue(top.contains(meter.id),
                              "\(meter.name) (\(form.role ?? "?")) تصدّره \(ranked[0].name)")
            }
        }
    }

    func testZihafAcceptedCheaply() throws {
        let engine = try makeEngine()
        let r = try engine.matchPattern(pattern("SLSLLLSLLSLL"), meter: "المسحوب")
        XCTAssertGreaterThan(r.score, 0.9, "الخبن جائز")
        XCTAssertLessThan(r.score, 1.0, "وليس مجانًا")
        XCTAssertEqual(r.feet.first?.variantId, "khabn")
    }

    func testBrokenFootIsLocated() throws {
        let engine = try makeEngine()
        let r = try engine.matchPattern(pattern("LLSLLLSLLLLL"), meter: "المسحوب")
        XCTAssertFalse(r.brokenFeet.isEmpty)
        XCTAssertEqual(r.brokenFeet.first?.footIndex, 2, "الخلل في التفعيلة الثالثة")
        XCTAssertFalse(r.brokenFeet.first!.issues.isEmpty, "يجب بيان المقطع المختلف")
    }

    func testLengthSeparatesOverlappingMeters() throws {
        let engine = try makeEngine()
        XCTAssertEqual(engine.rankPattern(pattern("LLSLLLSL"))[0].meterId, "al_rajaz_majzu")
        XCTAssertEqual(engine.rankPattern(pattern("LLSLLLSLLLSLLLSL"))[0].meterId,
                       "al_rajaz_taweel_hada_1")
    }

    func testAllFeetBrokenIsNotCloseToAnything() throws {
        let engine = try makeEngine()
        let r = engine.rankPattern(pattern("SSSSSSSSSSSS"))
        XCTAssertEqual(r[0].verdict, "unrecognized",
                       "درجته \(r[0].score) على \(r[0].name) لكن كل تفعيلاته مختلّة")
    }

    func testScoreIsDeterministic() throws {
        let engine = try makeEngine()
        let a = try engine.matchPattern(pattern("LLSLLLSLLSLL"), meter: "المسحوب")
        let b = try engine.matchPattern(pattern("LLSLLLSLLSLL"), meter: "المسحوب")
        XCTAssertEqual(a.score, b.score)
        XCTAssertEqual(a.cost, b.cost)
    }

    func testScoreStaysInRange() throws {
        let engine = try makeEngine()
        for p in ["SSSSSSSSSSSS", "LLLLLLLLLLLL", "LLSLLLSLLSLL", "S"] {
            for m in engine.rankPattern(pattern(p)) {
                XCTAssertTrue(m.score >= 0 && m.score <= 1, "\(p) أعطى \(m.score)")
            }
        }
    }

    // MARK: التحليل الكامل

    func testAnalyzeVocalizedMaskhub() throws {
        let engine = try makeEngine()
        let r = engine.analyze("مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ فَاعِلَاتُنْ")
        XCTAssertEqual(r.bestMeter?.id, "al_maskhub")
        XCTAssertEqual(r.verdict, "sound")
        XCTAssertFalse(r.assumedVocalization, "المشكول لا يحتاج افتراضًا")
        XCTAssertEqual(r.internalPattern, "LLSLLLSLLSLL")
        XCTAssertEqual(r.tafaeel.count, 3)
    }

    func testNumericPatternIsDisplayOnly() throws {
        let engine = try makeEngine()
        let r = engine.analyze("مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ فَاعِلَاتُنْ")
        XCTAssertEqual(r.numericPatterns["binary_1_2"]?.value, "221222122122")
        XCTAssertNil(r.numericPatterns["nabati_app"]?.value, "ترميز التطبيق غير مثبت فلا يُخترع")
    }

    func testBrokenLineIsReportedAsBroken() throws {
        let engine = try makeEngine()
        let r = engine.analyze("مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ فَعُولُنْ")
        XCTAssertEqual(r.verdict, "broken")
        XCTAssertFalse(r.brokenFeet.isEmpty)
    }

    func testPoemFindsDominantMeter() throws {
        let engine = try makeEngine()
        let maskhub = "مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ فَاعِلَاتُنْ"
        let hajini = "فَاعِلَاتُنْ فَعُولُنْ فَاعِلَاتُنْ فَعُولُنْ"
        let r = engine.analyzePoem([maskhub, maskhub, maskhub, hajini].joined(separator: "\n"))
        XCTAssertEqual(r.lineCount, 4)
        XCTAssertEqual(r.dominantMeter?.id, "al_maskhub")
        XCTAssertEqual(r.dominantMeter?.lines, 3)
        XCTAssertEqual(r.outliers.count, 1)
    }

    func testOpenQuestionsAreDeclared() throws {
        let engine = try makeEngine()
        let q = engine.openQuestions()
        XCTAssertGreaterThanOrEqual(q.count, 2, "ما لم يُحسم يجب أن يبقى معلنًا")
        XCTAssertTrue(q.contains { $0.contains("encoding") }, "ترميز التطبيق غير مثبت")
    }

    // MARK: أدوات

    private func pattern(_ s: String) -> [SyllableWeight] {
        s.compactMap { SyllableWeight(rawValue: String($0)) }
    }
}
