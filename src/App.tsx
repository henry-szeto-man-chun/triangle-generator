import React, { useEffect, useState } from 'react';
import Triangle from './Triangle';
import CanvasDrawer from './CanvasDrawer';
import './App.css';
import { TriangleFactory } from './TriangleFactory';
import TextInput from './components/TextInput';
import { AngleInput, LengthInput } from './components/TriangleDataInput';

function App() {
  const [dpi, setDpi] = useState(300)
  const [angles, setAngles] = useState(Array<number>(3).fill(NaN))
  const [lengths, setLengths] = useState(Array<number>(3).fill(NaN))
  const [rotation, setRotation] = useState(0)
  const [triangle, setTriangle] = useState<Triangle | null>(null)
  const [labelA, setLabelA] = useState('α')
  const [labelB, setLabelB] = useState('β')
  const [labelC, setLabelC] = useState('γ')

  useEffect(() => {
    redrawTriangle();
  })

  function handleDpiChange(value: string) {
    setDpi(parseFloat(value));
  }

  function handleAnglesChange(value: string, index: number) {
    angles[index] = parseFloat(value);
    setAngles(angles);

    createTriangle();
  }



  function handleLengthsChange(value: string, index: number) {
    lengths[index] = parseFloat(value);
    setLengths(lengths);

    createTriangle();
  }

  function createTriangle() {
    const triangleFactory = new TriangleFactory();
    const triangle = triangleFactory.createFromPartialAnglesAndLengths(angles, lengths);
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
      <table>
        <tbody>
          <tr>
            <td colSpan={3}>Angles (degree):</td>
          </tr>
          <tr>
            <td>
              <AngleInput prompt='&alpha;: ' getter={angles} index={0} handler={handleAnglesChange} inferredValue={triangle !== null ? triangle.angles[0] : NaN} />
            </td>
            <td>
              <AngleInput prompt='&beta;: ' getter={angles} index={1} handler={handleAnglesChange} inferredValue={triangle !== null ? triangle.angles[1] : NaN} />
            </td>
            <td>
              <AngleInput prompt='&gamma;: ' getter={angles} index={2} handler={handleAnglesChange} inferredValue={triangle !== null ? triangle.angles[2] : NaN} />
            </td>
          </tr>
          <tr>
            <td colSpan={3}>Lengths (cm):</td>
          </tr>
          <tr>
            <td>
              <LengthInput prompt='a: ' getter={lengths} index={0} handler={handleLengthsChange} inferredValue={triangle !== null ? triangle.lengths[0] : NaN} />
            </td>
            <td>
              <LengthInput prompt='b: ' getter={lengths} index={1} handler={handleLengthsChange} inferredValue={triangle !== null ? triangle.lengths[1] : NaN}/>
            </td>
            <td>
              <LengthInput prompt='c: ' getter={lengths} index={2} handler={handleLengthsChange} inferredValue={triangle !== null ? triangle.lengths[2] : NaN} />
            </td>
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
            <td><TextInput prompt='&alpha;: ' getter={labelA} setter={setLabelA} /></td>
            <td><TextInput prompt='&beta;: ' getter={labelB} setter={setLabelB} /></td>
            <td><TextInput prompt='&gamma;: ' getter={labelC} setter={setLabelC} /></td>
          </tr>
        </tbody>

      </table>
      <p>
      <label htmlFor='dpiEle'>DPI: </label>
      <input
        id='dpiEle'
        type='number'
        value={dpi}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDpiChange(e.currentTarget.value)} />
      </p>
      <canvas id='myCanvas' width='400' height='400'></canvas>
    </div>
  );
}

export default App;
