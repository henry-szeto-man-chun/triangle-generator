import React, { useEffect, useState } from 'react';
import Triangle from './domain/Triangle';
import CanvasDrawer from './CanvasDrawer';
import './App.css';
import { TriangleFactory, TriangleDataError } from './domain/TriangleFactory';
import { AnglesInputGroup, SidesInputGroup } from './components/TriangleDataInput';
import RotationInput from './components/RotationInput';
import AngleLabelsInputGroup from './components/TriangleLabelInput';
import triangleLabelData from './domain/TriangleLabelData';

function App() {
  const [dpi, setDpi] = useState(300)
  const [angles, setAngles] = useState(Array<number>(3).fill(NaN))
  const [sides, setSides] = useState(Array<number>(3).fill(NaN))
  const [rotation, setRotation] = useState(0)
  const [triangle, setTriangle] = useState<Triangle | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [labelData, setLabelData] = useState(triangleLabelData)

  useEffect(() => {
    redrawTriangle();
  })

  function handleDpiChange(value: string) {
    setDpi(parseFloat(value));
  }

  function handleAnglesChange(value: string, index: number) {
    const nextAngles = angles.map((prevValue, i) => {
      if (i === index) {
        return parseFloat(value);
      } else {
        return prevValue
      }
    })

    try {
      setAngles(nextAngles);
      createTriangle(nextAngles, sides);
      setErrorMessage('');
    } catch (error) {
      if (error instanceof TriangleDataError) {
        setErrorMessage(error.message);
      }
    }
  }



  function handleLengthsChange(value: string, index: number) {
    const nextSides = sides.map((prevValue, i) => {
      if (i === index) {
        return parseFloat(value);
      } else {
        return prevValue
      }
    })

    try {
      setSides(nextSides);
      createTriangle(angles, nextSides);
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
    drawer.drawTriangle(triangle, rotation, dpi, labelData)
  }

  return (
    <div className="App">
      <h1>
        Triangle Generator
      </h1>

      <p>
        Instructions: input angles and lengths of sides to generate an image, right click on image to save.
      </p>

      <section >
        <p>Angles (degree):</p>
        <AnglesInputGroup
          getter={angles}
          handler={handleAnglesChange}
          triangle={triangle} />
      </section>
      <section >
        <p>Sides (cm):</p>
        <SidesInputGroup
          getter={sides}
          handler={handleLengthsChange}
          triangle={triangle} />
      </section>
      <section>
        {errorMessage ? <p className="error-message">{errorMessage}</p> : ""}
      </section>
      <section>
        <p>Rotation (degree):</p>
        <RotationInput
          rotation={rotation}
          onRotationChange={handleRotationChange}
        />
      </section>
      <section className="input-section">
        <p>Angle labels:</p>
        <AngleLabelsInputGroup labelData={labelData} setLabelData={setLabelData}></AngleLabelsInputGroup>
      </section>
      <section className="input-section">
        <p>
          <label htmlFor="dpiEle">DPI: </label>
        </p>
        <input
          id="dpiEle"
          type="number"
          value={dpi}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDpiChange(e.currentTarget.value)} />
      </section>
      <canvas id="myCanvas" width="400" height="400"></canvas>
    </div>
  );
}

export default App;
