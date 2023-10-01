import Triangle from './domain/Triangle';
import TrianglePoints from './domain/TrianglePoints';
import { AngleArcs, AngleDegrees, AngleLabels, SideLabels } from './domain/TriangleLabels';

class CanvasDrawer {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D

    constructor() {
        this.canvas = document.getElementById('myCanvas') as HTMLCanvasElement
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
    }

    drawTriangle(triangle: Triangle, rotation: number, dpi: number, labelData: any) {
        let points = triangle.convertToPoints(this.dpiToLengthFactor(dpi))
            .rotate(rotation)
            .shift()
        this.drawPoints(points)
        new AngleArcs(labelData).draw(points, this.ctx)
        new AngleDegrees(triangle.angles, labelData).draw(points, this.ctx)
        new AngleLabels(labelData).draw(points, this.ctx)
        new SideLabels(['a', 'b', 'c'], 20).draw(points, this.ctx)
    }

    dpiToLengthFactor(dpi: number) {
        return dpi / 2.54
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

}

export default CanvasDrawer