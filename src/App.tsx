import React, { useEffect, useState } from 'react';
import Triangle from './domain/Triangle';
import CanvasDrawer from './CanvasDrawer';
import './App.css';
import { TriangleFactory, TriangleDataError } from './domain/TriangleFactory';
import TextInput from './components/TextInput';
import { AnglesInputGroup, SidesInputGroup } from './components/TriangleDataInput';
import RotationInput from './components/RotationInput';

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

      <section className='input-sections'>
        <p>Angles (degree):</p>
        <AnglesInputGroup
          getter={angles}
          handler={handleAnglesChange}
          triangle={triangle} />
      </section>
      <section className='input-sections'>
        <p>Sides (cm):</p>
        <SidesInputGroup
          getter={lengths}
          handler={handleLengthsChange}
          triangle={triangle} />
      </section>
      <section className='input-sections'>
        {errorMessage ? <p className='error-message'>{errorMessage}</p> : ''}
      </section>
      <section className='input-sections'>
        <p>Rotation (degree):</p>
        <RotationInput
          rotation={rotation}
          onRotationChange={handleRotationChange}
        />
      </section>
      <section className='input-sections'>
        <p>Labels:</p>
        <ul className='input-groups'>
          <li className='input-wrappers'><TextInput prompt='&alpha;: ' getter={labelA} setter={setLabelA} /></li>
          <li className='input-wrappers'><TextInput prompt='&beta;: ' getter={labelB} setter={setLabelB} /></li>
          <li className='input-wrappers'><TextInput prompt='&gamma;: ' getter={labelC} setter={setLabelC} /></li>
        </ul>
      </section>
      <section className='input-sections'>
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
