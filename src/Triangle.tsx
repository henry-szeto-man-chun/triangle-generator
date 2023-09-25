class Triangle {
    angles: number[]
    lengths: number[]

    constructor(angles: number[], lengths: number[]) {
        this.angles = angles.slice()
        this.lengths = lengths.slice()

        for (let i = 0; i < 2; i++) {
            let valid_angles = this.angles.filter(x => isNumber(x))
            let valid_lengths = this.lengths.filter(x => isNumber(x))
            this.applySumOfInteriorAnglesRule(valid_angles)
            if (valid_angles.length === 0 && valid_lengths.length === 3) this.applyCosineRuleWithLengths()
            if ((valid_angles.length + valid_lengths.length === 3) && this.haveNoPairs()) this.applyCosineRuleWithAngle()
            this.applySineRule()
        }
    }

    applySumOfInteriorAnglesRule(valid_angles: number[]) {
        const sum = valid_angles.reduce((x, y) => x + y)
        if (valid_angles.length === 3 && sum > 180) throw new TriangleDataError("Sum of interior angles cannot be greater than 180.")
        else if (valid_angles.length === 2) {
            for (let i = 0; i < 3; i++) {
                if (!isNumber(this.angles[i])) {
                    this.angles[i] = 180 - sum
                }
            }
        }

    }

    applySineRule() {
        let have_pair = false
        let k = 0
        for (let i = 0; i < 3; i++) {
            if (isNumber(this.angles[i]) && isNumber(this.lengths[i])) {
                k = this.lengths[i] / Math.sin(this.angles[i] * Math.PI / 180)
                have_pair = true
                break
            }
        }

        if (!have_pair) return

        for (let i = 0; i < 3; i++) {
            if (isNumber(this.angles[i]) && !isNumber(this.lengths[i])) {
                let length = k * Math.sin(this.angles[i] * Math.PI / 180)
                this.lengths[i] = roundToDecimal(length, 5)
            }
            else if (!isNumber(this.angles[i]) && isNumber(this.lengths[i])) {
                let ratio = this.lengths[i] / k
                let inversed = false
                if (ratio > 1) {
                    ratio = 1 / ratio
                    inversed = true
                }
                let angle = Math.asin(ratio) * 180 / Math.PI
                if (inversed) angle = 1 / angle
                this.angles[i] = roundToDecimal(angle, 5)
            }
        }
    }

    applyCosineRuleWithLengths() {
        let idx = [0, 1, 2]
        for (let i = 0; i < 2; i++) {
            let a = this.lengths[idx[0]]
            let b = this.lengths[idx[1]]
            let c = this.lengths[idx[2]]

            let cosC = (a ** 2 + b ** 2 - c ** 2) / (2 * a * b)
            let angC = Math.acos(cosC) * 180 / Math.PI
            this.angles[idx[2]] = roundToDecimal(angC, 5)
            idx.push(idx.shift() as number)
        }
    }

    applyCosineRuleWithAngle() {
        let idx = []
        for (let i = 0; i < 3; i++) {
            if (!isNumber(this.angles[i]) && isNumber(this.lengths[i])) idx.unshift(i)
            else if (isNumber(this.angles[i]) && isNumber(this.lengths[i])) idx.push(i)
        }
        let a = this.lengths[idx[0]]
        let b = this.lengths[idx[1]]
        let angC = this.angles[idx[2]]

        let c = Math.sqrt(a ** 2 + b ** 2 - 2 * a * b * Math.cos(angC * Math.PI / 180))
        this.lengths[idx[2]] = roundToDecimal(c, 5)
    }

    haveNoPairs() {
        for (let i = 0; i < 3; i++) {
            if (isNumber(this.angles[i]) && isNumber(this.lengths[i])) return false
        }
        return true
    }

    isValid() {
        if (this.angles.filter(x => isNumber(x)).length < 3) return false
        if (this.lengths.filter(x => isNumber(x)).length < 3) return false
        return true
    }
}

class TriangleDataError extends Error {
    constructor(message?: string) {
        super(message)
        this.name = "TriangleDataError"
        Object.setPrototypeOf(this, TriangleDataError.prototype)
    }
}

function roundToDecimal(x: number, n: number) {
    let k = 10 ** n
    return Math.round(x * k) / k
}

function isNumber(x: number) {
    return x !== null && !isNaN(x)
}

export default Triangle