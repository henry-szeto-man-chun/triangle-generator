import Triangle from './domain/Triangle';
import TrianglePoints from './domain/TrianglePoints';
import { AngleArcs, AngleLabels, SideLabels } from './domain/TriangleLabels';

class CanvasDrawer {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D

    constructor() {
        this.canvas = document.getElementById('myCanvas') as HTMLCanvasElement
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
    }

    drawTriangle(triangle: Triangle, rotation: number, dpi: number, labels: string[]) {
        let points = this.convertTriangleToPoints(triangle.angles, triangle.sides, this.dpiToLengthFactor(dpi))
            .rotate(rotation)
            .shift()
        this.drawPoints(points)
        new AngleLabels(labels, 20).draw(points, this.ctx)
        new AngleArcs(10).draw(points, this.ctx)
        new SideLabels(['a', 'b', 'c'], 20).draw(points, this.ctx)
    }

    dpiToLengthFactor(dpi: number) {
        return dpi / 2.54
    }

    convertTriangleToPoints(angles: number[], lengths: number[], length_factor: number) {
        let pointA = [0, 0]
        let pointB = [
            Math.cos(angles[0] * Math.PI / 180) * lengths[2] * length_factor,
            -Math.sin(angles[0] * Math.PI / 180) * lengths[2] * length_factor
        ]
        let pointC = [lengths[1] * length_factor, 0]

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

}

export default CanvasDrawer