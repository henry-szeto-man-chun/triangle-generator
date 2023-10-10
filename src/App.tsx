import React, { useState } from 'react';
import Triangle from './models/Triangle';
import './App.css';
import { TriangleFactory, TriangleDataError } from './models/TriangleFactory';
import { AnglesInputGroup, SidesInputGroup } from './components/TriangleDataInput';
import RotationInput from './components/RotationInput';
import {AngleLabelsInputGroup, SideLabelsInputGroup} from './components/TriangleLabelInput';
import triangleLabelData from './models/TriangleLabelData';
import Canvas from './components/Canvas';

function App() {
  const [dpi, setDpi] = useState(300)
  const [angles, setAngles] = useState(Array<number>(3).fill(NaN))
  const [sides, setSides] = useState(Array<number>(3).fill(NaN))
  const [rotation, setRotation] = useState(0)
  const [triangle, setTriangle] = useState<Triangle | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [labelData, setLabelData] = useState(triangleLabelData)
  const [tabsOpen, setTabsOpen] = useState([true, false])


  function handleTabToggle(index: number) {
    setTabsOpen(tabsOpen.map((prevValue, i) => {
      if (i === index) return !prevValue
      else return prevValue
    }))
  }

  function handleDpiChange(value: string) {
    setDpi(parseFloat(value));
  }

  function handleAnglesChange(value: string, index: number) {
    const nextAngles = angles.map((prevValue, i) => {
      if (i === index) return parseFloat(value);
      else return prevValue;
    })
    setAngles(nextAngles);

    try {
      createTriangle(nextAngles, sides);
      setErrorMessage('');
    } catch (error) {
      if (error instanceof TriangleDataError) {
        setErrorMessage(error.message);
      } else throw error
    }
  }

  function handleLengthsChange(value: string, index: number) {
    const nextSides = sides.map((prevValue, i) => {
      if (i === index) return parseFloat(value);
      else return prevValue;
    })
    setSides(nextSides);

    try {
      createTriangle(angles, nextSides);
      setErrorMessage('');
    } catch (error) {
      if (error instanceof TriangleDataError) {
        setErrorMessage(error.message);
      } else throw error
    }
  }

  function handleRotationChange(value: string) {
    setRotation(parseFloat(value))
  }

  function createTriangle(nextAngles: number[], nextLengths: number[]) {
    const triangleFactory = new TriangleFactory();
    const triangle = triangleFactory.createFromPartialAnglesAndLengths(nextAngles, nextLengths);

    if (triangle.isComplete()) {
      setTabsOpen(tabsOpen.map((prevValue, index) => {
        if (index === 1) return true;
        else return prevValue;
      }));
    }

    setTriangle(triangle);
  }


  return (
    <div className="App">
      <div className="control-panel">
        <h1>
          Triangle Generator
        </h1>
        <section >
          <h2 className={"toggle " + (tabsOpen[0] ? "open" : "")} onClick={() => handleTabToggle(0)}>Basic</h2>
          <div className={tabsOpen[0] ? "" : "hidden"}>
            <p>
              Input angles and lengths of sides to generate an image; right click on image to save.
            </p>
            <p>Angles (degree):</p>
            <AnglesInputGroup
              getter={angles}
              handler={handleAnglesChange}
              triangle={triangle} />
            <p>Sides (cm):</p>
            <SidesInputGroup
              getter={sides}
              handler={handleLengthsChange}
              triangle={triangle} />
            {errorMessage ? <p className="error-message">{errorMessage}</p> : ""}
            <p>Rotation (degree):</p>
            <RotationInput
              rotation={rotation}
              onRotationChange={handleRotationChange}
            />
          </div>
        </section>
        <section>
          <h2 className={"toggle " + (tabsOpen[1] ? "open" : "")} onClick={() => handleTabToggle(1)}>Labels</h2>
          <div className={tabsOpen[1] ? "" : "hidden"}>
            <p>Angle labels:</p>
            <AngleLabelsInputGroup labelData={labelData} setLabelData={setLabelData}></AngleLabelsInputGroup>
            <p>Side labels:</p>
            <SideLabelsInputGroup labelData={labelData} setLabelData={setLabelData}></SideLabelsInputGroup>
          </div>
        </section>
        <section>
          <p>
            <label htmlFor="dpiEle">DPI: </label>
          </p>
          <input
            id="dpiEle"
            type="number"
            value={dpi}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDpiChange(e.currentTarget.value)} />
        </section>
      </div>
      <div className="display-panel">
        <Canvas triangle={triangle} rotation={rotation} dpi={dpi} labelData={labelData}/>
      </div>
    </div>
  );
}

export default App;
