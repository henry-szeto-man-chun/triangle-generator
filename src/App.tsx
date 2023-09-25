import React, { useEffect, useState } from 'react';
import Triangle from './Triangle';
import CanvasDrawer from './CanvasDrawer';
import './App.css';

function TextInput({prompt, getter, setter}: {prompt: string, getter: string, setter: React.Dispatch<React.SetStateAction<string>>}) {
  return (
    <>
      <label htmlFor={React.useId()}>{prompt}</label>
      <input
        className='labelInputs'
        type='text'
        value={getter}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setter(e.currentTarget.value)}
        id={React.useId()}
      />
    </>
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
    writePlaceholders();
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
    if (triangle === null || !triangle.haveEnoughInfomation()) return

    const drawer = new CanvasDrawer()
    drawer.drawTriangle(triangle, rotation, dpi, [labelA, labelB, labelC])
  }

  function writePlaceholders() {
    if (triangle === null) return

    const angle_inputs = document.querySelectorAll<HTMLInputElement>('.inputs.angles')
    setPlaceholders(angle_inputs, triangle.angles)
    const length_inputs = document.querySelectorAll<HTMLInputElement>('.inputs.lengths')
    setPlaceholders(length_inputs, triangle.lengths)
  }

  function setPlaceholders(inputs: NodeListOf<HTMLInputElement>, values: number[]) {
    for (let i = 0; i < 3; i++) {
      if (inputs[i].value.length == 0 && values[i] !== null && !isNaN(values[i]))
        inputs[i].placeholder = values[i].toString();
      else
        inputs[i].placeholder = ''
    }
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
        <tbody>
          <tr>
            <td colSpan={3}>Angles (degree):</td>
          </tr>
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
            <td colSpan={3}>Lengths (cm):</td>
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
            <td colSpan={2}>Rotation (degree):</td>
          </tr>
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
            <td colSpan={3}>Labels:</td>
          </tr>
          <tr>
            <td><TextInput prompt='A: ' getter={labelA} setter={setLabelA} /></td>
            <td><TextInput prompt='B: ' getter={labelB} setter={setLabelB} /></td>
            <td><TextInput prompt='C: ' getter={labelC} setter={setLabelC} /></td>
          </tr>
        </tbody>

      </table>
      <canvas id='myCanvas' width='400' height='400'></canvas>
    </div>
  );
}

export default App;
