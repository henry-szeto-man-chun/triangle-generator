import Triangle from "./Triangle";

class TriangleFactory {
    private rules: TriangleRule[] = [
        new SumOfInteriorAnglesRule(),
        new CosineRuleOfSide(),
        new CosineRuleOfAngle(),
        new SineRule()
    ];

    createFromPartialAnglesAndLengths(angles: number[], sides: number[]) {
        let finalAngles = angles.slice()
        let finalSides = sides.slice()
        let applicableRules = [new VerifyNonZero()] // verify only need to be ran once
            .concat(this.rules.filter(x => x.isApplicable(finalAngles, finalSides)))
        while (!this.isComplete(finalAngles, finalSides) && applicableRules.length > 0) {
            for (let i = 0; i < applicableRules.length; i++) {
                [finalAngles, finalSides] = applicableRules[i].apply(finalAngles, finalSides)
            }
            applicableRules = this.rules.filter(x => x.isApplicable(finalAngles, finalSides));
        }

        return new Triangle(finalAngles, finalSides)
    }

    private isComplete(angles: number[], sides: number[]) {
        return (
            angles.filter(x => !isNaN(x)).length === 3 &&
            sides.filter(x => !isNaN(x)).length === 3
        )
    }
}

interface TriangleRule {
    isApplicable(angles: number[], sides: number[]): boolean;
    apply(angles: number[], sides: number[]): number[][];
}

class VerifyNonZero implements TriangleRule {
    isApplicable(angles: number[], sides: number[]): boolean {
        return true;
    }
    apply(angles: number[], sides: number[]): number[][] {
        angles.forEach((angle) => {
            if (angle <= 0) throw new TriangleDataError("Angle must be greater than 0.")
        })

        sides.forEach((length) => {
            if (length <= 0) throw new TriangleDataError("Length of side must be greater than 0.")
        })

        return [angles.slice(), sides.slice()]
    }

}

class SumOfInteriorAnglesRule implements TriangleRule {
    isApplicable(angles: number[], sides: number[]): boolean {
        const nonEmptyAngles = angles.filter(x => !isNaN(x));
        if (nonEmptyAngles.length == 2) return true;
        else return false;
    }
    apply(angles: number[], sides: number[]): number[][] {
        const newAngles = angles.slice()
        const sum = angles.filter(x => !isNaN(x)).reduce((x, y) => x + y)
        if (sum >= 180) throw new TriangleDataError("Sum of interior angles cannot be greater than 180.");

        for (let i = 0; i < 3; i++) {
            if (isNaN(angles[i])) {
                newAngles[i] = 180 - sum;
            }
        }

        return [newAngles, sides.slice()]
    }

}

class CosineRuleOfSide implements TriangleRule {
    isApplicable(angles: number[], sides: number[]): boolean {
        const nonEmptyLengths = sides.filter(x => !isNaN(x));
        if (nonEmptyLengths.length === 3) return true;
        else return false;
    }
    apply(angles: number[], sides: number[]): number[][] {
        const nextAngles = angles.slice()
        const indices = [0, 1, 2]
        for (let i = 0; i < 3; i++) {
            const a = sides[indices[0]]
            const b = sides[indices[1]]
            const c = sides[indices[2]]

            if (a + b <= c) throw new TriangleDataError(`Combination of sides cannot form a valid triangle because ${a} + ${b} <= ${c}`)
            const cosC = (a ** 2 + b ** 2 - c ** 2) / (2 * a * b)
            if (isNaN(nextAngles[indices[2]])) {
                nextAngles[indices[2]] = Math.acos(cosC) * 180 / Math.PI
            }
            indices.push(indices.shift() as number) //rotate the indices
        }
        return [nextAngles, sides.slice()]
    }

}

class CosineRuleOfAngle implements TriangleRule {
    isApplicable(angles: number[], sides: number[]): boolean {
        const nonEmptyAngles = angles.filter(x => !isNaN(x));
        const nonEmptyLengths = sides.filter(x => !isNaN(x));
        if (
            nonEmptyAngles.length == 1 &&
            nonEmptyLengths.length == 2 &&
            this.haveNoPairs(angles, sides)
        ) return true;
        else return false;
    }
    apply(angles: number[], sides: number[]): number[][] {
        const nextLengths = sides.slice()
        const indices = []
        for (let i = 0; i < 3; i++) { //find where the given lengths and angles are
            if (!isNaN(sides[i])) indices.unshift(i) //put lenghts at indices 0, 1
            else if (!isNaN(angles[i])) indices.push(i) //put angle at 2
        }
        const a = sides[indices[0]]
        const b = sides[indices[1]]
        const gamma = angles[indices[2]]

        nextLengths[indices[2]] = Math.sqrt(a ** 2 + b ** 2 - 2 * a * b * Math.cos(gamma * Math.PI / 180))
        return [angles.slice(), nextLengths]
    }
    private haveNoPairs(angles: number[], sides: number[]) {
        for (let i = 0; i < 3; i++) {
            if (!isNaN(angles[i]) && !isNaN(sides[i])) return false
        }
        return true
    }
}

class SineRule implements TriangleRule {
    isApplicable(angles: number[], sides: number[]): boolean {
        const nonEmptyAngles = angles.filter(x => !isNaN(x));
        const nonEmptyLengths = sides.filter(x => !isNaN(x));
        if (
            (nonEmptyAngles.length + nonEmptyLengths.length) >= 3 &&
            (nonEmptyAngles.length + nonEmptyLengths.length) < 6 &&
            this.findPair(angles, sides) !== -1
        ) return true;
        else return false;
    }
    apply(angles: number[], sides: number[]): number[][] {
        const nextAngles = angles.slice()
        const nextLengths = sides.slice()
        const index = this.findPair(angles, sides)

        const k = sides[index] / Math.sin(angles[index] * Math.PI / 180)
        for (let i = 0; i < 3; i++) {
            if (!isNaN(angles[i]) && isNaN(sides[i])) {
                nextLengths[i] = k * Math.sin(angles[i] * Math.PI / 180);
            }
            else if (isNaN(angles[i]) && !isNaN(sides[i])) {
                const ratio = sides[i] / k;
                const angle = (ratio > 1) ?
                    1 / (Math.asin(1 / ratio) * 180 / Math.PI) :
                    Math.asin(ratio) * 180 / Math.PI;
                nextAngles[i] = angle;
            }
        }
        return [nextAngles, nextLengths]
    }
    private findPair(angles: number[], sides: number[]) {
        for (let i = 0; i < 3; i++) {
            if (!isNaN(angles[i]) && !isNaN(sides[i])) return i
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

export {
    TriangleFactory,
    SumOfInteriorAnglesRule,
    CosineRuleOfAngle,
    CosineRuleOfSide,
    SineRule,
    TriangleDataError
}