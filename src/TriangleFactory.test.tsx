import {
    TriangleFactory,
    SumOfInteriorAnglesRule,
    CosineRuleOfAngle,
    CosineRuleOfSide,
    SineRule,
    TriangleDataError
} from "./TriangleFactory";

describe('interior angles', () => {
    const rule = new SumOfInteriorAnglesRule();
    const lengths = [NaN, NaN, NaN];

    describe('when given 2', () => {
        const angles = [30, NaN, 40];

        test('can apply', () => {
            expect(rule.isApplicable(angles, lengths));
        })

        test('returns the 3rd angle', () => {
            const [newAngles, newLengths] = rule.apply(angles, lengths);
            expect(newAngles).toEqual([30, 110, 40]);
        })
    })

    test('cannot apply when given 1', () => {
        const angles = [NaN, NaN, 90]
        expect(rule.isApplicable(angles, lengths)).toBeFalsy();
    })

    test('cannot apply when given 3', () => {
        const angles = [60, 60, 60];
        expect(rule.isApplicable(angles, lengths)).toBeFalsy();
    })

    describe('when given angles which are too large', () => {
        const angles = [80, 100, NaN];

        test('can still apply', () => {
            expect(rule.isApplicable(angles, lengths))
        })

        test('throws error when applied', () => {
            const f = () => {
                rule.apply(angles, lengths)
            }

            expect(f).toThrow(TriangleDataError)
        })
    })

})

describe('cosine rule of side', () => {
    const rule = new CosineRuleOfSide()
    const angles = [NaN, NaN, NaN]

    describe('not enough lengths given', () => {

        test('cannot apply to 1 length', () => {
            expect(rule.isApplicable(angles, [1, NaN, NaN])).toBeFalsy();
        })

        test('cannot apply to 2 lengths', () => {
            expect(rule.isApplicable(angles, [1, 5, NaN])).toBeFalsy();
        })
    })

    describe('right angle triangle', () => {
        const lengths = [3, 4, 5]

        test('can apply', () => {
            expect(rule.isApplicable(angles, lengths));
        })

        test('return correct angles', () => {
            const [newAngles, newLengths] = rule.apply(angles, lengths)

            expect(newAngles[0]).toBeCloseTo(36.87);
            expect(newAngles[1]).toBeCloseTo(53.13)
            expect(newAngles[2]).toBeCloseTo(90);
        })
    })

    describe('equalateral triangle', () => {
        const lengths = [2, 2, 2]

        test('all angles are 60 degrees', () => {
            const [newAngles, newLengths] = rule.apply(angles, lengths)

            expect(newAngles[0]).toBeCloseTo(60)
            expect(newAngles[1]).toBeCloseTo(60)
            expect(newAngles[2]).toBeCloseTo(60)
        })
    })
})

describe('cosine rule of angle', () => {
    const rule = new CosineRuleOfAngle()

    describe('given 2 sides and 1 angle without pair', () => {
        const angles = [30, NaN, NaN]
        const lengths = [NaN, 2, 4]

        test('can apply', () => {
            expect(rule.isApplicable(angles, lengths))
        })

        test('return missing side', () => {
            const [newAngles, newLengths] = rule.apply(angles, lengths)

            expect(newLengths[0]).toBeCloseTo(2.48)
            expect(newLengths[1]).toBe(2)
            expect(newLengths[2]).toBe(4)
        })
    })
})

describe('sine rule', () => {
    const rule = new SineRule()

    describe('given 2 sides 1 angle with pair', () => {
        const angles = [36.87, NaN, NaN]
        const lengths = [3, 4, NaN]

        test('can apply', () => {
            expect(rule.isApplicable(angles, lengths))
        })

        test('return missing angle', () => {
            const [newAngles, newLengths] = rule.apply(angles, lengths)

            expect(newAngles[0]).toBeCloseTo(36.87)
            expect(newAngles[1]).toBeCloseTo(53.13)            
        })
    })

    describe('given 2 angles 1 side with pair', () => {
        const angles = [NaN, 90, 36.87]
        const lengths = [NaN, 5, NaN]

        test('can apply', () => {
            expect(rule.isApplicable(angles, lengths))
        })

        test('return missing length', () => {
            const [newAngles, newLengths] = rule.apply(angles, lengths)

            expect(newLengths[1]).toBeCloseTo(5)
            expect(newLengths[2]).toBeCloseTo(3)
        })
    })

    describe('given 3 angles 1 side', () => {
        const angles = [53.13, 90, 36.87]
        const lengths = [4, NaN, NaN]

        test('can apply', () => {
            expect(rule.isApplicable(angles, lengths))
        })

        test('return all missing lengths', () => {
            const [newAngles, newLengths] = rule.apply(angles, lengths)

            expect(newLengths[0]).toBeCloseTo(4)
            expect(newLengths[1]).toBeCloseTo(5)
            expect(newLengths[2]).toBeCloseTo(3)
        })
    })
})

describe('triangle factory create triangle', () => {
    const factory = new TriangleFactory()

    describe('from 3 sides', () => {
        const angles = [NaN, NaN, NaN]

        test('right triangle', () => {
            const lengths = [5, 4, 3]

            const triangle = factory.createFromPartialAnglesAndLengths(angles, lengths)
            expect(triangle.angles[0]).toBeCloseTo(90)
            expect(triangle.angles[1]).toBeCloseTo(53.13)
            expect(triangle.angles[2]).toBeCloseTo(36.87)
        })

        test('equalateral triangle', () => {
            const lengths = [2.5, 2.5, 2.5]

            const triangle = factory.createFromPartialAnglesAndLengths(angles, lengths)
            expect(triangle.angles[0]).toBeCloseTo(60)
            expect(triangle.angles[1]).toBeCloseTo(60)
            expect(triangle.angles[2]).toBeCloseTo(60)
        })
    })

    describe('from 2 sides 1 angle', () => {

        test('without pair', () => {
            const angles = [NaN, 90, NaN]
            const lengths = [3, NaN, 4]

            const triangle = factory.createFromPartialAnglesAndLengths(angles, lengths)
            expect(triangle.angles[0]).toBeCloseTo(36.87)
            expect(triangle.angles[2]).toBeCloseTo(53.13)
            expect(triangle.lengths[1]).toBeCloseTo(5)
        })

        test('with pair', () => {
            const angles = [NaN, NaN, 90]
            const lengths = [3, NaN, 5]

            const triangle = factory.createFromPartialAnglesAndLengths(angles, lengths)
            expect(triangle.angles[0]).toBeCloseTo(36.87)
            expect(triangle.angles[1]).toBeCloseTo(53.13)
            expect(triangle.lengths[1]).toBeCloseTo(4)
        })
    })

    describe('from 2 angles 1 side', () => {

        test('without pair', () => {
            const angles = [36.87, NaN, 90]
            const lengths = [NaN, 4, NaN]

            const triangle = factory.createFromPartialAnglesAndLengths(angles, lengths)
            expect(triangle.angles[1]).toBeCloseTo(53.13)
            expect(triangle.lengths[0]).toBeCloseTo(3)
            expect(triangle.lengths[2]).toBeCloseTo(5)
        })

        test('with pair', () => {
            const angles = [53.13, 90, NaN]
            const lengths = [4, NaN, NaN]

            const triangle = factory.createFromPartialAnglesAndLengths(angles, lengths)
            expect(triangle.angles[2]).toBeCloseTo(36.87)
            expect(triangle.lengths[1]).toBeCloseTo(5)
            expect(triangle.lengths[2]).toBeCloseTo(3)
        })
    })
})