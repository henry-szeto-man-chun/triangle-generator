import { roundToDecimal } from "../utils";
import TrianglePoints from "./TrianglePoints";

interface TriangleLabels {
    draw(points: TrianglePoints, ctx: CanvasRenderingContext2D): void;
}

class AngleLabels implements TriangleLabels {
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
        const labelPoints = points.points.map(point => {
            let distance = Math.sqrt((point[0] - center[0]) ** 2 + (point[1] - center[1]) ** 2)
            let bearing = Math.atan2(point[0] - center[0], point[1] - center[1])
            let labelDistance = distance + (this.fontPx * 1.1)
            let pointX = center[0] + Math.sin(bearing) * labelDistance
            let pointY = center[1] + Math.cos(bearing) * labelDistance
            return [pointX, pointY]
        })
        return labelPoints
    }
}

class AngleArcs implements TriangleLabels {
    constructor(private radius: number) {

    }

    draw(points: TrianglePoints, ctx: CanvasRenderingContext2D) {
        points.points.forEach((point, index) => {
            const [sAngle, eAngle] = points.getStartEndAngles(index)
            ctx.beginPath();
            ctx.arc(point[0], point[1], this.radius, sAngle, eAngle);
            ctx.stroke();
        })
    }
}

class AngleDegrees implements TriangleLabels {
    constructor(private angles: number[], private arcRadius: number, private fontPx: number) {

    }

    draw(points: TrianglePoints, ctx: CanvasRenderingContext2D): void {
        const labelPoints = this.getLabelPoints(points)
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = `${this.fontPx}px Arial`
        ctx.fillText(roundToDecimal(this.angles[0], 2).toString() + "\u00B0", labelPoints[0][0], labelPoints[0][1])
        ctx.fillText(roundToDecimal(this.angles[1], 2).toString() + "\u00B0", labelPoints[1][0], labelPoints[1][1])
        ctx.fillText(roundToDecimal(this.angles[2], 2).toString() + "\u00B0", labelPoints[2][0], labelPoints[2][1])
    }

    private getLabelPoints(points: TrianglePoints) {
        const center = points.getIncenterPoint()
        const labelPoints = points.points.map(point => {
            let distance = Math.sqrt((point[0] - center[0]) ** 2 + (point[1] - center[1]) ** 2)
            let bearing = Math.atan2(point[0] - center[0], point[1] - center[1])
            let labelDistance = distance - ((this.arcRadius + this.fontPx) * 1.1)
            let pointX = center[0] + Math.sin(bearing) * labelDistance
            let pointY = center[1] + Math.cos(bearing) * labelDistance
            return [pointX, pointY]
        })
        return labelPoints
    }
}

class SideLabels implements TriangleLabels {
    constructor(private labels: string[], private fontPx: number) {

    }

    draw(points: TrianglePoints, ctx: CanvasRenderingContext2D): void {
        const labelPoints = this.getLabelPoints(points)
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = `${this.fontPx}px Arial`
        ctx.fillText(this.labels[0], labelPoints[0][0], labelPoints[0][1])
        ctx.fillText(this.labels[1], labelPoints[1][0], labelPoints[1][1])
        ctx.fillText(this.labels[2], labelPoints[2][0], labelPoints[2][1])
    }

    private getLabelPoints(points: TrianglePoints) {
        const middle = points.getMiddlePoint()
        const labelPoints = points.getBisectorPoints().map(point => {
            let distance = Math.sqrt((point[0] - middle[0]) ** 2 + (point[1] - middle[1]) ** 2)
            let bearing = Math.atan2(point[0] - middle[0], point[1] - middle[1])
            let labelDistance = distance + (this.fontPx * 1.1)
            let pointX = middle[0] + Math.sin(bearing) * labelDistance
            let pointY = middle[1] + Math.cos(bearing) * labelDistance
            return [pointX, pointY]
        })
        return labelPoints
    }
}

export {
    AngleArcs,
    AngleDegrees,
    AngleLabels,
    SideLabels
}