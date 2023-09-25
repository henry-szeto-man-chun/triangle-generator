import React, { useEffect, useState } from 'react';
import Triangle from './Triangle';
import './App.css';

function LabelInput({getter, setter, id}: {getter: string, setter: React.Dispatch<React.SetStateAction<string>>, id: string}) {
  return (
    <input
      className='labelInputs'
      type='text'
      value={getter}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setter(e.currentTarget.value)}
      id={id}
    />
  )
}

function App() {
  const [dpi, setDpi] = useState(300)
  const [angles, setAngles] = useState(Array(3).fill(null))
  const [lengths, setLengths] = useState(Array(3).fill(null))
  const [rotation, setRotation] = useState(0)
  const [triangle, setTriangle] = useState<Triangle | null>(null)
  const [labelA, setLabelA] = useState('A')
  const [labelB, setLabelB] = useState('B')
  const [labelC, setLabelC] = useState('C')

  useEffect(() => {
    redrawTriangle();
  })

  function handleDpiChange(value: string) {
    setDpi(parseFloat(value))
  }

  function handleAnglesChange(value: string, index: number) {
    angles[index] = parseFloat(value)
    setAngles(angles)

    setTriangle(new Triangle(angles, lengths))
  }

  function handleLengthsChange(value: string, index: number) {
    lengths[index] = parseFloat(value)
    setLengths(lengths)

    setTriangle(new Triangle(angles, lengths))
  }

  function handleRotationChange(value: string) {
    setRotation(parseFloat(value))
  }

  function redrawTriangle() {
    if (triangle !==null && triangle.haveEnoughInfomation()) {
      const canvas = document.getElementById('myCanvas') as HTMLCanvasElement
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      writePlaceholders(triangle)
      let points = convertTriangleToPoints(triangle.angles, triangle.lengths, dpiToLengthFactor(dpi))
      points = rotatePoints(points, rotation)
      points = shiftPoints(points)
      drawTriangle(points, canvas, ctx)
    }
  }

  function writePlaceholders(triangle: Triangle) {
    const angle_inputs = document.querySelectorAll<HTMLInputElement>('.inputs.angles')
    setPlaceholders(angle_inputs, triangle.angles)
    const length_inputs = document.querySelectorAll<HTMLInputElement>('.inputs.lengths')
    setPlaceholders(length_inputs, triangle.lengths)
  }

  function setPlaceholders(inputs: NodeListOf<HTMLInputElement>, values: number[]) {
    for (let i = 0; i < 3; i++) {
      if (inputs[i].value.length == 0 && values[i] !== null)
        inputs[i].placeholder = values[i].toString();
      else
        inputs[i].placeholder = ''
    }
  }

  function dpiToLengthFactor(dpi: number) {
    return dpi / 2.54
  }

  function convertTriangleToPoints(angles: number[], lengths: number[], length_factor: number) {
    let pointA = [0, 0]
    let pointB = [lengths[2] * length_factor, 0]
    let pointC = [
      Math.cos(angles[0] * Math.PI / 180) * lengths[1] * length_factor,
      Math.sin(angles[0] * Math.PI / 180) * lengths[1] * length_factor
    ]

    return [pointA, pointB, pointC]
  }

  function rotatePoints(points: number[][], rotation: number) {
    let rad = rotation * Math.PI / 180
    for (let i = 0; i < 3; i++) {
      let x = points[i][0]
      let y = points[i][1]
      points[i][0] = x * Math.cos(rad) - y * Math.sin(rad)
      points[i][1] = x * Math.sin(rad) + y * Math.cos(rad)
    }

    return points
  }

  function shiftPoints(points: number[][]) {
    let minX = 0
    let minY = 0
    points.forEach(point => {
      if (point[0] < minX) minX = point[0]
      if (point[1] < minY) minY = point[1]
    })

    for (let i = 0; i < 3; i++) {
      points[i][0] -= minX
      points[i][1] -= minY
    }

    return points
  }

  function getAngleLabelPoints(points: number[][], fontPx: number) {
    let center = getCenterPoint(points)
    let labelPoints: number[][] = [];
    points.forEach(point => {
      let distance = Math.sqrt((point[0] - center[0]) ** 2 + (point[1] - center[1]) ** 2)
      let bearing = Math.atan2(point[0] - center[0], point[1] - center[1])
      let labelDistance = distance + (fontPx * 1.1)
      let pointX = center[0] + Math.sin(bearing) * labelDistance
      let pointY = center[1] + Math.cos(bearing) * labelDistance
      labelPoints.push([pointX, pointY])
    })
    return labelPoints
  }

  function getCenterPoint(points: number[][]) {
    let center = [0, 0]
    points.forEach(point => {
      center[0] += point[0]
      center[1] += point[1]
    })
    center[0] = center[0] / 3
    center[1] = center[1] / 3
    return center
  }

  function drawTriangle(points: number[][], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const margin = 50
    resizeCanvas(canvas, points, margin)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.translate(margin, margin)
    ctx.beginPath()
    ctx.moveTo(points[0][0], points[0][1])
    ctx.lineTo(points[1][0], points[1][1])
    ctx.lineTo(points[2][0], points[2][1])
    ctx.closePath()
    ctx.stroke()

    const labelPoints = getAngleLabelPoints(points, 20)
    if ((document.getElementById('angleLables') as HTMLInputElement).checked) {
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = '20px Arial'
      ctx.fillText(labelA, labelPoints[0][0], labelPoints[0][1])
      ctx.fillText(labelB, labelPoints[1][0], labelPoints[1][1])
      ctx.fillText(labelC, labelPoints[2][0], labelPoints[2][1])
    }
  }

  function resizeCanvas(canvas: HTMLCanvasElement, points: number[][], margin: number) {
    let maxX = 0
    let maxY = 0
    points.forEach(point => {
      if (point[0] > maxX) maxX = point[0]
      if (point[1] > maxY) maxY = point[1]
    })
    canvas.width = maxX + margin * 2
    canvas.height = maxY + margin * 2
  }

  return (
    <div className='App'>
      <h1>
        Triangle Generator
      </h1>
      DPI: <input
        className='triggerRedraw'
        type='number'
        value={dpi}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDpiChange(e.currentTarget.value)} />
      <table>
        <thead>
          <tr>
            <td>A</td>
            <td>B</td>
            <td>C</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><label htmlFor='angleA'>&alpha;</label>:
              <input
                id='angleA'
                className='inputs angles'
                type='number'
                value={angles[0]}
                min='0.1'
                max='179.98'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAnglesChange(e.currentTarget.value, 0)}
              /></td>
            <td>&beta;:
              <input
                className='inputs angles'
                type='number'
                value={angles[1]}
                min='0.1'
                max='179.8'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAnglesChange(e.currentTarget.value, 1)}
              /></td>
            <td>&gamma;:
              <input
                className='inputs angles'
                type='number'
                value={angles[2]}
                min='0.1'
                max='179.8'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAnglesChange(e.currentTarget.value, 2)}
              /></td>
          </tr>
          <tr>
            <td>a:
              <input
                className='inputs lengths'
                type='number'
                value={lengths[0]}
                min='0.01'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLengthsChange(e.currentTarget.value, 0)}
              /></td>
            <td>b:
              <input
                className='inputs lengths'
                type='number'
                value={lengths[1]}
                min='0.01'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLengthsChange(e.currentTarget.value, 1)}
              /></td>
            <td>c:
              <input
                className='inputs lengths'
                type='number'
                value={lengths[2]}
                min='0.01'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLengthsChange(e.currentTarget.value, 2)}
              /></td>
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <td><input
              className='slider'
              type='range'
              min='-180'
              max='180'
              value={rotation}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRotationChange(e.currentTarget.value)} /></td>
            <td><input
              type='number'
              min='-180'
              max='180'
              value={rotation}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRotationChange(e.currentTarget.value)} /></td>
          </tr>
        </tbody>

      </table>
      <table>
        <tbody>
          <tr>
            <td><input className='triggerRedraw' type='checkbox' id='angleLables' checked /></td>
            <td><label htmlFor='labelA'>A: </label><LabelInput getter={labelA} setter={setLabelA} id='labelA' /></td>
            <td><label htmlFor='labelB'>B: </label><LabelInput getter={labelB} setter={setLabelB} id='labelB' /></td>
            <td><label htmlFor='labelC'>C: </label><LabelInput getter={labelC} setter={setLabelC} id='labelC' /></td>
          </tr>
        </tbody>

      </table>
      <canvas id='myCanvas' width='400' height='400'></canvas>
    </div>
  );
}

export default App;
