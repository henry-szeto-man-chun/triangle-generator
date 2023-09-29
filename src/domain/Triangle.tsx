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
}


export default Triangle