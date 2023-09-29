import TrianglePoints from "./TrianglePoints";

class AngleLabels {
    constructor(private labels: string[], private fontPx: number) {

    }

    draw(points: TrianglePoints, ctx: CanvasRenderingContext2D) {
        const labelPoints = this.getLabelPoints(points)
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = `${this.fontPx}px Arial`
        ctx.fillText(this.labels[0], labelPoints[0][0], labelPoints[0][1])
        ctx.fillText(this.labels[1], labelPoints[1][0], labelPoints[1][1])
        ctx.fillText(this.labels[2], labelPoints[2][0], labelPoints[2][1])
    }

    private getLabelPoints(points: TrianglePoints) {
        const center = points.getIncenterPoint()
        const labelPoints: number[][] = [];
        points.points.forEach(point => {
            let distance = Math.sqrt((point[0] - center[0]) ** 2 + (point[1] - center[1]) ** 2)
            let bearing = Math.atan2(point[0] - center[0], point[1] - center[1])
            let labelDistance = distance + (this.fontPx * 1.0)
            let pointX = center[0] + Math.sin(bearing) * labelDistance
            let pointY = center[1] + Math.cos(bearing) * labelDistance
            labelPoints.push([pointX, pointY])
        })
        return labelPoints
    }
}

export {
    AngleLabels
}