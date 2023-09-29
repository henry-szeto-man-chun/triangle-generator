import React, { useEffect, useState } from 'react';
import Triangle from './domain/Triangle';
import CanvasDrawer from './CanvasDrawer';
import './App.css';
import { TriangleFactory, TriangleDataError } from './domain/TriangleFactory';
import TextInput from './components/TextInput';
import { AnglesInputGroup, SidesInputGroup } from './components/TriangleDataInput';

function App() {
  const [dpi, setDpi] = useState(300)
  const [angles, setAngles] = useState(Array<number>(3).fill(NaN))
  const [lengths, setLengths] = useState(Array<number>(3).fill(NaN))
  const [rotation, setRotation] = useState(0)
  const [triangle, setTriangle] = useState<Triangle | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [labelA, setLabelA] = useState('A')
  const [labelB, setLabelB] = useState('B')
  const [labelC, setLabelC] = useState('C')

  useEffect(() => {
    redrawTriangle();
  })

  function handleDpiChange(value: string) {
    setDpi(parseFloat(value));
  }

  function handleAnglesChange(value: string, index: number) {
    const nextAngles = angles.map((oldValue, i) => {
      if (i === index) {
        return parseFloat(value);
      } else {
        return oldValue
      }
    })

    try {
      createTriangle(nextAngles, lengths);
      setAngles(nextAngles);
      setErrorMessage('');
    } catch (error) {
      if (error instanceof TriangleDataError) {
        setErrorMessage(error.message);
      }
    }
  }



  function handleLengthsChange(value: string, index: number) {
    const nextLengths = lengths.map((oldValue, i) => {
      if (i === index) {
        return parseFloat(value);
      } else {
        return oldValue
      }
    })

    try {
      createTriangle(angles, nextLengths);
      setLengths(nextLengths);
      setErrorMessage('');
    } catch (error) {
      if (error instanceof TriangleDataError) {
        setErrorMessage(error.message);
      }
    }
  }

  function createTriangle(nextAngles: number[], nextLengths: number[]) {
    const triangleFactory = new TriangleFactory();
    const triangle = triangleFactory.createFromPartialAnglesAndLengths(nextAngles, nextLengths);
    setTriangle(triangle);
  }

  function handleRotationChange(value: string) {
    setRotation(parseFloat(value))
  }

  function redrawTriangle() {
    if (triangle === null || !triangle.isComplete()) return

    const drawer = new CanvasDrawer()
    drawer.drawTriangle(triangle, rotation, dpi, [labelA, labelB, labelC])
  }

  return (
    <div className='App'>
      <h1>
        Triangle Generator
      </h1>

      <p>
        Instructions: input angles and lengths of sides to generate an image, right click on image to save.
      </p>

      <section className='data-box'>
        <p>Angles (degree):</p>
        <AnglesInputGroup
          getter={angles}
          handler={handleAnglesChange}
          triangle={triangle} />
      </section>
      <section className='data-box'>
        <p>Sides (cm):</p>
        <SidesInputGroup
          getter={lengths}
          handler={handleLengthsChange}
          triangle={triangle} />
      </section>
      <section className='data-box'>
        {errorMessage ? <p className='error-message'>{errorMessage}</p> : ''}
      </section>
      <section className='data-box'>
        <p>Rotation (degree):</p>
        <input
          className='slider'
          type='range'
          min='-180'
          max='180'
          value={rotation}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRotationChange(e.currentTarget.value)} />
        <input
          type='number'
          min='-180'
          max='180'
          value={rotation}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRotationChange(e.currentTarget.value)} />
      </section>
      <section className='data-box'>
        <p>Labels:</p>
        <ul>
          <li className='data-input'><TextInput prompt='&alpha;: ' getter={labelA} setter={setLabelA} /></li>
          <li className='data-input'><TextInput prompt='&beta;: ' getter={labelB} setter={setLabelB} /></li>
          <li className='data-input'><TextInput prompt='&gamma;: ' getter={labelC} setter={setLabelC} /></li>
        </ul>
      </section>
      <section className='data-box'>
        <p>
          <label htmlFor='dpiEle'>DPI: </label>
        </p>
        <input
          id='dpiEle'
          type='number'
          value={dpi}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDpiChange(e.currentTarget.value)} />
      </section>
      <canvas id='myCanvas' width='400' height='400'></canvas>
    </div>
  );
}

export default App;
