class Triangle {
    angles: number[]
    lengths: number[]

    constructor(angles: number[], lengths: number[]) {
        this.angles = angles.slice()
        this.lengths = lengths.slice()
    }

    isComplete() {
        if (this.angles.filter(x => !isNaN(x)).length < 3) return false
        if (this.lengths.filter(x => !isNaN(x)).length < 3) return false
        return true
    }
}

function roundToDecimal(x: number, n: number) {
    let k = 10 ** n
    return Math.round(x * k) / k
}


export default Triangle