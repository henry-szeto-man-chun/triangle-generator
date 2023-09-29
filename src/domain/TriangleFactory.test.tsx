import exp from "constants";
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
    const sides = [NaN, NaN, NaN];

    describe('when given 2', () => {
        const angles = [30, NaN, 40];

        test('can apply', () => {
            expect(rule.isApplicable(angles, sides));
        })

        test('returns the 3rd angle', () => {
            const [newAngles, newSides] = rule.apply(angles, sides);
            expect(newAngles).toEqual([30, 110, 40]);
        })
    })

    test('cannot apply when given 1', () => {
        const angles = [NaN, NaN, 90]
        expect(rule.isApplicable(angles, sides)).toBeFalsy();
    })

    test('cannot apply when given 3', () => {
        const angles = [60, 60, 60];
        expect(rule.isApplicable(angles, sides)).toBeFalsy();
    })

    describe('when given angles which are too large', () => {
        const angles = [80, 100, NaN];

        test('can still apply', () => {
            expect(rule.isApplicable(angles, sides))
        })

        test('error thrown', () => {
            const f = () => {
                rule.apply(angles, sides)
            }

            expect(f).toThrow(TriangleDataError)
        })
    })

})

describe('cosine rule of side', () => {
    const rule = new CosineRuleOfSide()
    const angles = [NaN, NaN, NaN]

    describe('not enough sides given', () => {

        test('cannot apply to 1 length', () => {
            expect(rule.isApplicable(angles, [1, NaN, NaN])).toBeFalsy();
        })

        test('cannot apply to 2 sides', () => {
            expect(rule.isApplicable(angles, [1, 5, NaN])).toBeFalsy();
        })
    })

    describe('right angle triangle', () => {
        const sides = [3, 4, 5]

        test('can apply', () => {
            expect(rule.isApplicable(angles, sides));
        })

        test('return correct angles', () => {
            const [newAngles, newSides] = rule.apply(angles, sides)

            expect(newAngles[0]).toBeCloseTo(36.87);
            expect(newAngles[1]).toBeCloseTo(53.13)
            expect(newAngles[2]).toBeCloseTo(90);
        })
    })

    describe('equalateral triangle', () => {
        const sides = [2, 2, 2]

        test('can apply', () => {
            expect(rule.isApplicable(angles, sides));
        })

        test('all angles are 60 degrees', () => {
            const [newAngles, newSides] = rule.apply(angles, sides)

            expect(newAngles[0]).toBeCloseTo(60)
            expect(newAngles[1]).toBeCloseTo(60)
            expect(newAngles[2]).toBeCloseTo(60)
        })
    })

    describe('invalid sides', () => {
        const sides = [1, 3, 5]

        test('can apply', () => {
            expect(rule.isApplicable(angles, sides));
        })

        test('error thrown', () => {
            const f = () => rule.apply(angles, sides)

            expect(f).toThrow(TriangleDataError)
        })
    })
})

describe('cosine rule of angle', () => {
    const rule = new CosineRuleOfAngle()

    describe('given 2 sides and 1 angle without pair', () => {
        const angles = [30, NaN, NaN]
        const sides = [NaN, 2, 4]

        test('can apply', () => {
            expect(rule.isApplicable(angles, sides))
        })

        test('return missing side', () => {
            const [newAngles, newSides] = rule.apply(angles, sides)

            expect(newSides[0]).toBeCloseTo(2.48)
            expect(newSides[1]).toBe(2)
            expect(newSides[2]).toBe(4)
        })
    })
})

describe('sine rule', () => {
    const rule = new SineRule()

    describe('given 2 sides 1 angle with pair', () => {
        const angles = [36.87, NaN, NaN]
        const sides = [3, 4, NaN]

        test('can apply', () => {
            expect(rule.isApplicable(angles, sides))
        })

        test('return missing angle', () => {
            const [newAngles, newSides] = rule.apply(angles, sides)

            expect(newAngles[0]).toBeCloseTo(36.87)
            expect(newAngles[1]).toBeCloseTo(53.13)            
        })
    })

    describe('given 2 angles 1 side with pair', () => {
        const angles = [NaN, 90, 36.87]
        const sides = [NaN, 5, NaN]

        test('can apply', () => {
            expect(rule.isApplicable(angles, sides))
        })

        test('return missing length', () => {
            const [newAngles, newSides] = rule.apply(angles, sides)

            expect(newSides[1]).toBeCloseTo(5)
            expect(newSides[2]).toBeCloseTo(3)
        })
    })

    describe('given 3 angles 1 side', () => {
        const angles = [53.13, 90, 36.87]
        const sides = [4, NaN, NaN]

        test('can apply', () => {
            expect(rule.isApplicable(angles, sides))
        })

        test('return all missing sides', () => {
            const [newAngles, newSides] = rule.apply(angles, sides)

            expect(newSides[0]).toBeCloseTo(4)
            expect(newSides[1]).toBeCloseTo(5)
            expect(newSides[2]).toBeCloseTo(3)
        })
    })
})

describe('triangle factory create triangle', () => {
    const factory = new TriangleFactory()

    describe('from 3 sides', () => {
        const angles = [NaN, NaN, NaN]

        test('right triangle', () => {
            const sides = [5, 4, 3]

            const triangle = factory.createFromPartialAnglesAndLengths(angles, sides)
            expect(triangle.angles[0]).toBeCloseTo(90)
            expect(triangle.angles[1]).toBeCloseTo(53.13)
            expect(triangle.angles[2]).toBeCloseTo(36.87)
        })

        test('equalateral triangle', () => {
            const sides = [2.5, 2.5, 2.5]

            const triangle = factory.createFromPartialAnglesAndLengths(angles, sides)
            expect(triangle.angles[0]).toBeCloseTo(60)
            expect(triangle.angles[1]).toBeCloseTo(60)
            expect(triangle.angles[2]).toBeCloseTo(60)
        })
    })

    describe('from 2 sides 1 angle', () => {

        test('without pair', () => {
            const angles = [NaN, 90, NaN]
            const sides = [3, NaN, 4]

            const triangle = factory.createFromPartialAnglesAndLengths(angles, sides)
            expect(triangle.angles[0]).toBeCloseTo(36.87)
            expect(triangle.angles[2]).toBeCloseTo(53.13)
            expect(triangle.sides[1]).toBeCloseTo(5)
        })

        test('with pair', () => {
            const angles = [NaN, NaN, 90]
            const sides = [3, NaN, 5]

            const triangle = factory.createFromPartialAnglesAndLengths(angles, sides)
            expect(triangle.angles[0]).toBeCloseTo(36.87)
            expect(triangle.angles[1]).toBeCloseTo(53.13)
            expect(triangle.sides[1]).toBeCloseTo(4)
        })
    })

    describe('from 2 angles 1 side', () => {

        test('without pair', () => {
            const angles = [36.87, NaN, 90]
            const sides = [NaN, 4, NaN]

            const triangle = factory.createFromPartialAnglesAndLengths(angles, sides)
            expect(triangle.angles[1]).toBeCloseTo(53.13)
            expect(triangle.sides[0]).toBeCloseTo(3)
            expect(triangle.sides[2]).toBeCloseTo(5)
        })

        test('with pair', () => {
            const angles = [53.13, 90, NaN]
            const sides = [4, NaN, NaN]

            const triangle = factory.createFromPartialAnglesAndLengths(angles, sides)
            expect(triangle.angles[2]).toBeCloseTo(36.87)
            expect(triangle.sides[1]).toBeCloseTo(5)
            expect(triangle.sides[2]).toBeCloseTo(3)
        })
    })
})