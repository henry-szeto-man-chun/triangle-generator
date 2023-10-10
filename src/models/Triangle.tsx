import TrianglePoints from "./TrianglePoints"

class Triangle {
    angles: number[]
    sides: number[]

    constructor(angles: number[], sides: number[]) {
        this.angles = angles.slice()
        this.sides = sides.slice()
    }

    isComplete() {
        if (this.angles.filter(x => !isNaN(x)).length < 3) return false
        if (this.sides.filter(x => !isNaN(x)).length < 3) return false
        return true
    }

    convertToPoints(lengthFactor: number) {
        let pointA = [0, 0]
        let pointB = [
            Math.cos(this.angles[0] * Math.PI / 180) * this.sides[2] * lengthFactor,
            -Math.sin(this.angles[0] * Math.PI / 180) * this.sides[2] * lengthFactor
        ]
        let pointC = [this.sides[1] * lengthFactor, 0]

        return new TrianglePoints([pointA, pointB, pointC])
    }
}


export default Triangle