import { useContext, useEffect, useRef } from "react";
import Triangle from "../models/Triangle";
import { AngleArcs, AngleDegrees, AngleLabels, SideLabels, TriangleLabels } from "../models/TriangleLabels";
import TrianglePoints from "../models/TrianglePoints";
import { triangleContext } from "../models/TriangleContext";

function Canvas({ rotation, dpi, labelData }: { rotation: number, dpi: number, labelData: any }) {
    const canvasRef = useRef(null);
    const triangle = useContext(triangleContext)

    useEffect(() => {
        if (triangle === null || !triangle.isComplete()) return;

        drawTriangle(triangle, rotation, dpi, labelData)
    })

    function drawTriangle(triangle: Triangle, rotation: number, dpi: number, labelData: any) {
        const canvas = canvasRef.current as unknown as HTMLCanvasElement
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
        const margin = 50
        const points = triangle.convertToPoints(dpiToLengthFactor(dpi))
            .rotate(rotation)
            .shift()
        resizeCanvas(points, margin, canvas)
        drawPoints(points, margin, canvas, ctx)
        const labels: TriangleLabels[] = [
            new AngleArcs(labelData),
            new AngleDegrees(triangle.angles, labelData),
            new AngleLabels(labelData),
            new SideLabels(labelData)
        ]
        labels.forEach((label) => label.draw(points, ctx));
    }

    function dpiToLengthFactor(dpi: number) {
        return dpi / 2.54
    }

    function drawPoints(points: TrianglePoints, margin: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.translate(margin, margin)
        ctx.beginPath()
        ctx.moveTo(points.points[0][0], points.points[0][1])
        ctx.lineTo(points.points[1][0], points.points[1][1])
        ctx.lineTo(points.points[2][0], points.points[2][1])
        ctx.closePath()
        ctx.stroke()
    }

    function resizeCanvas(points: TrianglePoints, margin: number, canvas: HTMLCanvasElement) {
        let [maxX, maxY] = points.getMaxXY()
        canvas.width = maxX + margin * 2
        canvas.height = maxY + margin * 2
    }

    return (
        <canvas ref={canvasRef} width={1} height={1} />
    )
}

export default Canvas