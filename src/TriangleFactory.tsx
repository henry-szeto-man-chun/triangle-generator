import Triangle from "./Triangle";

class TriangleFactory {
    private rules: TriangleRule[] = [
        new SumOfInteriorAnglesRule(),
        new CosineRuleOfSide(),
        new CosineRuleOfAngle(),
        new SineRule()
    ];

    createFromPartialAnglesAndLengths(angles: number[], lengths: number[]) {
        let applicableRules = this.rules.filter(x => x.isApplicable(angles, lengths))
            .concat([new VerifyNonZero()]) // verify only need to be ran once
        while (!this.isComplete(angles, lengths) && applicableRules.length > 0) {
            for (let i = 0; i < applicableRules.length; i++) {
                [angles, lengths] = applicableRules[i].apply(angles, lengths)
            }
            applicableRules = this.rules.filter(x => x.isApplicable(angles, lengths));
        }

        return new Triangle(angles, lengths)
    }

    private isComplete(angles: number[], lengths: number[]) {
        return (
            angles.filter(x => isNumber(x)).length === 3 &&
            lengths.filter(x => isNumber(x)).length === 3
        )
    }
}

interface TriangleRule {
    isApplicable(angles: number[], lengths: number[]): boolean;
    apply(angles: number[], lengths: number[]): number[][];
}

class VerifyNonZero implements TriangleRule {
    isApplicable(angles: number[], lengths: number[]): boolean {
        return true;
    }
    apply(angles: number[], lengths: number[]): number[][] {
        angles.forEach((angle) => {
            if (angle <= 0) throw new TriangleDataError("Angle must be greater than 0.")
        })

        lengths.forEach((length) => {
            if (length <= 0) throw new TriangleDataError("Length of side must be greater than 0.")
        })

        return [angles.slice(), lengths.slice()]
    }

}

class SumOfInteriorAnglesRule implements TriangleRule {
    isApplicable(angles: number[], lengths: number[]): boolean {
        const nonEmptyAngles = angles.filter(x => isNumber(x));
        if (nonEmptyAngles.length == 2) return true;
        else return false;
    }
    apply(angles: number[], lengths: number[]): number[][] {
        const newAngles = angles.slice()
        const sum = angles.filter(x => isNumber(x)).reduce((x, y) => x + y)
        if (sum >= 180) throw new TriangleDataError("Sum of interior angles cannot be greater than 180.");

        for (let i = 0; i < 3; i++) {
            if (!isNumber(angles[i])) {
                newAngles[i] = 180 - sum;
            }
        }

        return [newAngles, lengths.slice()]
    }

}

class CosineRuleOfSide implements TriangleRule {
    isApplicable(angles: number[], lengths: number[]): boolean {
        const nonEmptyLengths = lengths.filter(x => isNumber(x));
        if (nonEmptyLengths.length === 3) return true;
        else return false;
    }
    apply(angles: number[], lengths: number[]): number[][] {
        const nextAngles = angles.slice()
        const indices = [0, 1, 2]
        for (let i = 0; i < 3; i++) {
            const a = lengths[indices[0]]
            const b = lengths[indices[1]]
            const c = lengths[indices[2]]

            const cosC = (a ** 2 + b ** 2 - c ** 2) / (2 * a * b)
            if (!isNaN(cosC) && !isNumber(nextAngles[indices[2]])) {
                nextAngles[indices[2]] = Math.acos(cosC) * 180 / Math.PI
            }
            indices.push(indices.shift() as number) //rotate the indices
        }
        return [nextAngles, lengths.slice()]
    }

}

class CosineRuleOfAngle implements TriangleRule {
    isApplicable(angles: number[], lengths: number[]): boolean {
        const nonEmptyAngles = angles.filter(x => isNumber(x));
        const nonEmptyLengths = lengths.filter(x => isNumber(x));
        if (
            nonEmptyAngles.length == 1 &&
            nonEmptyLengths.length == 2 &&
            this.haveNoPairs(angles, lengths)
        ) return true;
        else return false;
    }
    apply(angles: number[], lengths: number[]): number[][] {
        const nextLengths = lengths.slice()
        const indices = []
        for (let i = 0; i < 3; i++) { //find where the given lengths and angles are
            if (isNumber(lengths[i])) indices.unshift(i) //put lenghts at indices 0, 1
            else if (isNumber(angles[i])) indices.push(i) //put angle at 2
        }
        const a = lengths[indices[0]]
        const b = lengths[indices[1]]
        const gamma = angles[indices[2]]

        nextLengths[indices[2]] = Math.sqrt(a ** 2 + b ** 2 - 2 * a * b * Math.cos(gamma * Math.PI / 180))
        return [angles.slice(), nextLengths]
    }
    private haveNoPairs(angles: number[], lengths: number[]) {
        for (let i = 0; i < 3; i++) {
            if (isNumber(angles[i]) && isNumber(lengths[i])) return false
        }
        return true
    }
}

class SineRule implements TriangleRule {
    isApplicable(angles: number[], lengths: number[]): boolean {
        const nonEmptyAngles = angles.filter(x => isNumber(x));
        const nonEmptyLengths = lengths.filter(x => isNumber(x));
        if (
            (nonEmptyAngles.length + nonEmptyLengths.length) >= 3 &&
            (nonEmptyAngles.length + nonEmptyLengths.length) < 6 &&
            this.findPair(angles, lengths) !== -1
        ) return true;
        else return false;
    }
    apply(angles: number[], lengths: number[]): number[][] {
        const nextAngles = angles.slice()
        const nextLengths = lengths.slice()
        const index = this.findPair(angles, lengths)

        const k = lengths[index] / Math.sin(angles[index] * Math.PI / 180)
        for (let i = 0; i < 3; i++) {
            if (isNumber(angles[i]) && !isNumber(lengths[i])) {
                nextLengths[i] = k * Math.sin(angles[i] * Math.PI / 180);
            }
            else if (!isNumber(angles[i]) && isNumber(lengths[i])) {
                const ratio = lengths[i] / k;
                const angle = (ratio > 1) ? 
                    1 / (Math.asin(1 / ratio) * 180 / Math.PI) :
                    Math.asin(ratio) * 180 / Math.PI;
                nextAngles[i] = angle;
            }
        }
        return [nextAngles, nextLengths]
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
    SineRule,
    TriangleDataError
}