import Triangle from "./Triangle";

class TriangleFactory {
    private rules: TriangleRule[] = [
        new SumOfInteriorAnglesRule(),
        new CosineRuleOfSide(),
        new CosineRuleOfAngle(),
        new SineRule()
    ];

    createTriangleFromPartialAnglesAndLengths(angles: number[], lengths: number[]) {
        let applicableRules = this.rules.filter(x => x.canApply(angles, lengths))
        while (!this.isComplete(angles, lengths) && applicableRules.length > 0) {
            [angles, lengths] = applicableRules[0].applyRule(angles, lengths)
        }

        if (this.isComplete(angles, lengths)) return new Triangle(angles, lengths)
    }

    private isComplete(angles: number[], lengths: number[]) {
        return (
            angles.filter(x => isNumber(x)).length === 3 &&
            lengths.filter(x => isNumber(x)).length === 3
        )
    }
}

interface TriangleRule {
    canApply(angles: number[], lengths: number[]): boolean;
    applyRule(angles: number[], lengths: number[]): number[][];
}

class SumOfInteriorAnglesRule implements TriangleRule {
    canApply(angles: number[], lengths: number[]): boolean {
        const nonEmptyAngles = angles.filter(x => isNumber(x));
        if (nonEmptyAngles.length == 2) return true;
        else return false;
    }
    applyRule(angles: number[], lengths: number[]): number[][] {
        const newAngles = angles.slice()
        const sum = angles.reduce((x, y) => x + y)
        if (sum > 180) throw new TriangleDataError("Sum of interior angles cannot be greater than 180.");

        for (let i = 0; i < 3; i++) {
            if (!isNumber(angles[i])) {
                newAngles[i] = 180 - sum;
            }
        }

        return [newAngles, lengths.slice()]
    }

}

class CosineRuleOfSide implements TriangleRule {
    canApply(angles: number[], lengths: number[]): boolean {
        const nonEmptyLengths = lengths.filter(x => isNumber(x));
        if (nonEmptyLengths.length === 3) return true;
        else return false;
    }
    applyRule(angles: number[], lengths: number[]): number[][] {
        const newAngles = angles.slice()
        const indices = [0, 1, 2]
        for (let i = 0; i < 2; i++) {
            const a = lengths[indices[0]]
            const b = lengths[indices[1]]
            const c = lengths[indices[2]]

            const cosC = (a ** 2 + b ** 2 - c ** 2) / (2 * a * b)
            if (!isNaN(cosC)) {
                newAngles[indices[2]] = Math.acos(cosC) * 180 / Math.PI
            }
            indices.push(indices.shift() as number)
        }
        return [newAngles, lengths.slice()]
    }

}

class CosineRuleOfAngle implements TriangleRule {
    canApply(angles: number[], lengths: number[]): boolean {
        const nonEmptyAngles = angles.filter(x => isNumber(x));
        const nonEmptyLengths = lengths.filter(x => isNumber(x));
        if (
            nonEmptyAngles.length == 1 &&
            nonEmptyLengths.length == 2 &&
            this.haveNoPairs(angles, lengths)
        ) return true;
        else return false;
    }
    applyRule(angles: number[], lengths: number[]): number[][] {
        const newLengths = lengths.slice()
        const indices = []
        for (let i = 0; i < 3; i++) {
            if (isNumber(lengths[i])) indices.unshift(i)
            else if (isNumber(angles[i])) indices.push(i)
        }
        const a = lengths[indices[0]]
        const b = lengths[indices[1]]
        const gamma = angles[indices[2]]

        newLengths[indices[2]] = Math.sqrt(a ** 2 + b ** 2 - 2 * a * b * Math.cos(gamma * Math.PI / 180))
        return [angles.slice(), newLengths]
    }
    private haveNoPairs(angles: number[], lengths: number[]) {
        for (let i = 0; i < 3; i++) {
            if (isNumber(angles[i]) && isNumber(lengths[i])) return false
        }
        return true
    }
}

class SineRule implements TriangleRule {
    canApply(angles: number[], lengths: number[]): boolean {
        const nonEmptyAngles = angles.filter(x => isNumber(x));
        const nonEmptyLengths = lengths.filter(x => isNumber(x));
        if (
            nonEmptyAngles.length + nonEmptyLengths.length >= 3 &&
            this.findPair(angles, lengths)
        ) return true;
        else return false;
    }
    applyRule(angles: number[], lengths: number[]): number[][] {
        const newAngles = angles.slice()
        const newLengths = lengths.slice()
        const index = this.findPair(angles, lengths)

        const k = lengths[index] / Math.sin(angles[index] * Math.PI / 180)
        for (let i = 0; i < 3; i++) {
            if (isNumber(angles[i]) && !isNumber(lengths[i])) {
                newLengths[i] = k * Math.sin(angles[i] * Math.PI / 180);
            }
            else if (!isNumber(angles[i]) && isNumber(lengths[i])) {
                const ratio = lengths[i] / k;
                let angle;
                if (ratio > 1) {
                    angle = 1 / (Math.asin(1 / ratio) * 180 / Math.PI);
                } else {
                    angle = Math.asin(ratio) * 180 / Math.PI;
                }
                newAngles[i] = angle;
            }
        }
        return [newAngles, newLengths]
    }
    private findPair(angles: number[], lengths: number[]) {
        for (let i = 0; i < 3; i++) {
            if (isNumber(angles[i]) && isNumber(lengths[i])) return i
        }
        return -1
    }
}

class TriangleDataError extends Error {
    constructor(message?: string) {
        super(message)
        this.name = "TriangleDataError"
        Object.setPrototypeOf(this, TriangleDataError.prototype)
    }
}

function isNumber(x: number) {
    return x !== null && !isNaN(x)
}

export {
    TriangleFactory,
    SumOfInteriorAnglesRule,
    CosineRuleOfAngle,
    CosineRuleOfSide,
    SineRule
}