import Triangle from './Triangle';

class CanvasDrawer {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D

    constructor() {
        this.canvas = document.getElementById('myCanvas') as HTMLCanvasElement
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
    }

    drawTriangle(triangle: Triangle, rotation: number, dpi: number, labels: string[]) {
        let points = this.convertTriangleToPoints(triangle.angles, triangle.lengths, this.dpiToLengthFactor(dpi))
            .rotate(rotation)
            .shift()
        this.drawPoints(points)
        this.drawAngleLabelPoints(points, labels, 20)
    }

    dpiToLengthFactor(dpi: number) {
        return dpi / 2.54
    }

    convertTriangleToPoints(angles: number[], lengths: number[], length_factor: number) {
        let pointA = [0, 0]
        let pointB = [lengths[2] * length_factor, 0]
        let pointC = [
            Math.cos(angles[0] * Math.PI / 180) * lengths[1] * length_factor,
            Math.sin(angles[0] * Math.PI / 180) * lengths[1] * length_factor
        ]

        return new TrianglePoints([pointA, pointB, pointC])
    }

    drawPoints(points: TrianglePoints) {
        const margin = 50
        this.resizeCanvas(this.canvas, points, margin)

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.translate(margin, margin)
        this.ctx.beginPath()
        this.ctx.moveTo(points.points[0][0], points.points[0][1])
        this.ctx.lineTo(points.points[1][0], points.points[1][1])
        this.ctx.lineTo(points.points[2][0], points.points[2][1])
        this.ctx.closePath()
        this.ctx.stroke()
    }

    resizeCanvas(canvas: HTMLCanvasElement, points: TrianglePoints, margin: number) {
        let [maxX, maxY] = points.getMaxXY()
        canvas.width = maxX + margin * 2
        canvas.height = maxY + margin * 2
    }

    drawAngleLabelPoints(points: TrianglePoints, labels: string[], fontPx: number) {
        const labelPoints = this.getAngleLabelPoints(points, fontPx)
        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'middle'
        this.ctx.font = `${fontPx}px Arial`
        this.ctx.fillText(labels[0], labelPoints[0][0], labelPoints[0][1])
        this.ctx.fillText(labels[1], labelPoints[1][0], labelPoints[1][1])
        this.ctx.fillText(labels[2], labelPoints[2][0], labelPoints[2][1])
    }

    getAngleLabelPoints(points: TrianglePoints, fontPx: number) {
        let center = points.getIncenterPoint()
        let labelPoints: number[][] = [];
        points.points.forEach(point => {
            let distance = Math.sqrt((point[0] - center[0]) ** 2 + (point[1] - center[1]) ** 2)
            let bearing = Math.atan2(point[0] - center[0], point[1] - center[1])
            let labelDistance = distance + (fontPx * 1.0)
            let pointX = center[0] + Math.sin(bearing) * labelDistance
            let pointY = center[1] + Math.cos(bearing) * labelDistance
            labelPoints.push([pointX, pointY])
        })
        return labelPoints
    }

}

class TrianglePoints {
    points: number[][]

    constructor(points: number[][]) {
        this.points = points
    }

    rotate(rotation: number) {
        const rad = rotation * Math.PI / 180
        const new_points: number[][] = [[], [], []]
        for (let i = 0; i < 3; i++) {
            let x = this.points[i][0]
            let y = this.points[i][1]
            new_points[i][0] = x * Math.cos(rad) - y * Math.sin(rad)
            new_points[i][1] = x * Math.sin(rad) + y * Math.cos(rad)
        }

        return new TrianglePoints(new_points)
    }

    shift() {
        let [minX, minY] = this.getMinXY()
        let new_points: number[][] = [[], [], []]
        for (let i = 0; i < 3; i++) {
            new_points[i][0] = this.points[i][0] - minX
            new_points[i][1] = this.points[i][1] - minY
        }

        return new TrianglePoints(new_points)
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
        for(let i=0; i<3; i++) {
            result[0] += lengths[i] * this.points[i][0]
            result[1] += lengths[i] * this.points[i][1]
        }
        result[0] /= sum_of_lengths
        result[1] /= sum_of_lengths
        return result
    }

    private getLengths() {
        let result = []
        for(let i=0; i<3; i++) {
            let others = [0, 1, 2].filter(x => x !== i)
            result[i] = this.getLength(this.points[others[0]], this.points[others[1]])
        }
        return result
    }

    private getLength(pointA: number[], pointB: number[]) {
        let result = Math.sqrt(
            Math.pow(pointA[0] - pointB[0], 2) + Math.pow(pointA[1] - pointB[1], 2)
        )
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

export default CanvasDrawer