class TrianglePoints {
    points: number[][]

    constructor(points: number[][]) {
        this.points = points
    }

    rotate(rotationDegree: number) {
        const rad = rotationDegree * Math.PI / 180
        const newPoints = this.points.map(([x, y]) => [
            x * Math.cos(rad) - y * Math.sin(rad),
            x * Math.sin(rad) + y * Math.cos(rad)
        ])

        return new TrianglePoints(newPoints)
    }

    shift() {
        const [minX, minY] = this.getMinXY()
        const newPoints = this.points.map(([x, y]) => [x - minX, y - minY])
        return new TrianglePoints(newPoints)
    }

    getMiddlePoint() {
        let result = [0, 0]
        this.points.forEach(point => {
            result[0] += point[0]
            result[1] += point[1]
        })
        result[0] /= 3
        result[1] /= 3
        return result
    }

    getIncenterPoint() {
        const result = [0, 0]
        const lengths = this.getLengths()
        const sum_of_lengths = lengths.reduce((x, y) => x + y)
        for (let i = 0; i < 3; i++) {
            result[0] += lengths[i] * this.points[i][0]
            result[1] += lengths[i] * this.points[i][1]
        }
        result[0] /= sum_of_lengths
        result[1] /= sum_of_lengths
        return result
    }

    private getLengths() {
        const result = [0,1, 2].map(index => {
            let indices = [0, 1, 2].filter(x => x !== index)
            return this.getLength(this.points[indices[0]], this.points[indices[1]])
        })
        return result
    }

    private getLength(pointA: number[], pointB: number[]) {
        let result = Math.sqrt(
            Math.pow(pointA[0] - pointB[0], 2) + Math.pow(pointA[1] - pointB[1], 2)
        )
        return result
    }

    getStartEndAngles(index: number) {
        const otherIndices = [0, 1, 2].filter(x => x !== index);
        const result = [0, 1].map(i => Math.atan2(
            this.points[otherIndices[i]][1] - this.points[index][1],
            this.points[otherIndices[i]][0] - this.points[index][0]
        ));
        if (index === 1) return result.reverse();
        else return result;
    }

    getBisectorPoints() {
        const result = [0, 1, 2].map(index => {
            let indices = [0, 1, 2].filter(x => x !== index)
            return [
                (this.points[indices[0]][0] + this.points[indices[1]][0]) / 2,
                (this.points[indices[0]][1] + this.points[indices[1]][1]) / 2
            ]
        })
        return result
    }

    getMinXY() {
        return this.reducePoints((x: number, y: number) => x < y)
    }

    getMaxXY() {
        return this.reducePoints((x: number, y: number) => x > y)
    }

    private reducePoints(comparator: Function) {
        let result = [0, 0]
        this.points.forEach(point => {
            if (comparator(point[0], result[0])) result[0] = point[0]
            if (comparator(point[1], result[1])) result[1] = point[1]
        })

        return result
    }
}

export default TrianglePoints