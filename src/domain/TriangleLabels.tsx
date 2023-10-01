import { roundToDecimal } from "../utils";
import TrianglePoints from "./TrianglePoints";

interface TriangleLabels {
    draw(points: TrianglePoints, ctx: CanvasRenderingContext2D): void;
}

class AngleLabels implements TriangleLabels {
    private incenterPoint: number[] = []
    constructor(private labelData: any) {

    }

    draw(points: TrianglePoints, ctx: CanvasRenderingContext2D) {
        this.incenterPoint = points.getIncenterPoint()
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        points.points.forEach((point, index) => {
            if ((this.labelData.angleLabel as boolean[])[index]) {
                const labelPoint = this.getLabelPoint(points, index)
                ctx.font = `${(this.labelData.angleLabelSize as number[])[index]}px Arial`
                ctx.fillText((this.labelData.angleLabelText as string[])[index], labelPoint[0], labelPoint[1])
            }
        })
    }

    private getLabelPoint(points: TrianglePoints, index: number) {
        const point = points.points[index]
        const center = this.incenterPoint
        const distance = Math.sqrt((point[0] - center[0]) ** 2 + (point[1] - center[1]) ** 2)
        const bearing = Math.atan2(point[0] - center[0], point[1] - center[1])
        const labelDistance = distance + (
            (this.labelData.angleLabelSize as number[])[index] *
            (this.labelData.angleLabelOffset as number[])[index]
        )
        const pointX = center[0] + Math.sin(bearing) * labelDistance
        const pointY = center[1] + Math.cos(bearing) * labelDistance
        return [pointX, pointY]
    }
}

class AngleArcs implements TriangleLabels {
    constructor(private labelData: any) {

    }

    draw(points: TrianglePoints, ctx: CanvasRenderingContext2D) {
        points.points.forEach((point, index) => {
            if ((this.labelData.angleArc as boolean[])[index]) {
                const [sAngle, eAngle] = points.getStartEndAngles(index)
                ctx.beginPath();
                ctx.arc(point[0], point[1], (this.labelData.angleArcRadius as number[])[index], sAngle, eAngle);
                ctx.stroke();
            }
        })
    }
}

class AngleDegrees implements TriangleLabels {
    private incenterPoint: number[] = []
    constructor(private angles: number[], private labelData: any) {

    }

    draw(points: TrianglePoints, ctx: CanvasRenderingContext2D): void {
        this.incenterPoint = points.getIncenterPoint()
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        points.points.forEach((point, index) => {
            if ((this.labelData.angleDegree as boolean[])[index]) {
                const labelPoint = this.getLabelPoint(points, index)
                ctx.font = `${(this.labelData.angleDegreeSize as number[])[index]}px Arial`
                ctx.fillText(roundToDecimal(this.angles[index], 2).toString() + "\u00B0", labelPoint[0], labelPoint[1])
            }
        })
    }

    private getLabelPoint(points: TrianglePoints, index: number) {
        const point = points.points[index]
        const center = this.incenterPoint
        const distance = Math.sqrt((point[0] - center[0]) ** 2 + (point[1] - center[1]) ** 2)
        const bearing = Math.atan2(point[0] - center[0], point[1] - center[1])
        const labelDistance = distance + (
            (
                (this.labelData.angleArcRadius as number[])[index] +
                (this.labelData.angleDegreeSize as number[])[index]
            ) *
            (this.labelData.angleDegreeOffset as number[])[index]
        )
        const pointX = center[0] + Math.sin(bearing) * labelDistance
        const pointY = center[1] + Math.cos(bearing) * labelDistance
        return [pointX, pointY]
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