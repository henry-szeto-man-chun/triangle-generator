import {
    TriangleFactory,
    SumOfInteriorAnglesRule,
    CosineRuleOfAngle,
    CosineRuleOfSide,
    SineRule
} from "./TriangleFactory";

describe('interior angles', () => {
    const rule = new SumOfInteriorAnglesRule();

    describe('when given 2', () => {
        const angles = [30, 40, NaN];
        const lengths = [NaN, NaN, NaN];

        test('can apply', () => {
            expect(rule.canApply(angles, lengths));
        })

        test('are given 2', () => {
            const [newAngles, newLengths] = rule.applyRule(angles, lengths);
            expect(newAngles[0] == 30);
            expect(newAngles[1] == 40);
            expect(newAngles[2] == 110);
        })
    })

})
