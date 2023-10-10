import { roundToDecimal } from "../utils";
import TrianglePoints from "./TrianglePoints";

export interface TriangleLabels {
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
        for(let i=0; i<3; i++) {
            if ((this.labelData.angleLabel as boolean[])[i]) {
                const labelPoint = this.getLabelPoint(points, i)
                ctx.font = `${(this.labelData.angleLabelSize as number[])[i]}px Arial`
                ctx.fillText((this.labelData.angleLabelText as string[])[i], labelPoint[0], labelPoint[1])
            }
        }
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
        for(let i=0; i<3; i++) {
            if ((this.labelData.angleDegree as boolean[])[i]) {
                const labelPoint = this.getLabelPoint(points, i)
                ctx.font = `${(this.labelData.angleDegreeSize as number[])[i]}px Arial`
                ctx.fillText(roundToDecimal(this.angles[i], 2).toString() + "\u00B0", labelPoint[0], labelPoint[1])
            }
        }
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
    constructor(private labelData: any) {

    }

    draw(points: TrianglePoints, ctx: CanvasRenderingContext2D): void {
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        for(let i=0; i<3; i++) {
            if ((this.labelData.sideLabel as boolean[])[i]) {
                const labelPoint = this.getLabelPoint(points, i)
                ctx.font = `${(this.labelData.sideLabelSize as number[])[i]}px Arial`
                ctx.fillText((this.labelData.sideLabelText as string[])[i], labelPoint[0], labelPoint[1])
            }
        }
    }

    private getLabelPoint(points: TrianglePoints, index: number) {
        const [start, end] = points.getOppositeLine(index);
        const midpoint = [
            (start[0] + end[0]) / 2,
            (start[1] + end[1]) / 2
        ];
        const perpendicularBearing = Math.atan2(midpoint[1] - start[1], -(midpoint[0] - start[0]))
        const labelDistance = (
            (this.labelData.sideLabelSize as number[])[index] * 
            (this.labelData.sideLabelOffset as number[])[index]
        )
        const pointX = midpoint[0] + Math.sin(perpendicularBearing) * labelDistance
        const pointY = midpoint[1] + Math.cos(perpendicularBearing) * labelDistance
        return [pointX, pointY]
    }
}

export {
    AngleArcs,
    AngleDegrees,
    AngleLabels,
    SideLabels
}