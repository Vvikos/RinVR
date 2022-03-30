import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { VRCanvas, DefaultXRControllers } from '@react-three/xr'
import { useFrame } from "@react-three/fiber";
import { Sky } from '@react-three/drei'
import SpreadSheet from './components/SpreadSheet'
import ButtonPanel from './components/ButtonPanel'
import RService from './services/RService'
import Controllers from './components/Controllers'
import '@react-three/fiber'
import './styles.css'

const CELL_X_SIZE = 0.4;
const CELL_Y_SIZE = 0.2;
const ANGLE_MAX = -1.3;
const FETCH_SIZE = 40;

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry attach="geometry" args={[40, 40]} />
      <meshStandardMaterial attach="material" color="#666" />
    </mesh>
  )
}

function App() {
  const [gridSize, setGridSize] = useState([10, 20]);
  const [csv, setCsv] = useState([]);
  const [selectedCols, setSelectedCols] = useState([]);
  const [csvFiles, setCsvFiles] = useState(['', []]);
  const [fetchInterval, setFetchInterval] = useState([0, 0]);
  const [rowInterval, setRowInterval] = useState([0, 9]);
  const [colInterval, setColInterval] = useState([0, 9]);

  useEffect(() => {
    if(csvFiles[0]=='') {
      console.log('INFO', 'NO FILE FETCHED BECAUSE NO FILE SELECTED');
      return;
    }
    if(rowInterval[1]+rowInterval[0]>=fetchInterval[0]+fetchInterval[1]){
      setFetchInterval(prevstate => ([prevstate[0], prevstate[1]+FETCH_SIZE]));
    }

  }, [rowInterval, csvFiles]);

  useEffect(() => {
    if(csvFiles[0]=='') {
      console.log('INFO', 'NO FILE FETCHED BECAUSE NO FILE SELECTED');
      return;
    }

    RService.getCsv(csvFiles[0], fetchInterval)
    .then(response => setCsv(response))
    .catch(error => console.log('ERROR', error));
  }, [fetchInterval]);

  useEffect(() => {
    if (csv.length>0 && csv[1].length>0 && csv[1][0].length>0) {
      setRowInterval([0, ((csv[1][0].length < gridSize[1]-1) ? csv[1][0].length : gridSize[1]-1)]);
      setColInterval([0, ((csv[1].length < gridSize[0]-1) ? csv[1].length : gridSize[0]-1)]);
      console.log('INFO', 'REQUEST 200 OK : CSV SIZE ' + csv.length + 'x' + csv[0].length);
    }
    setSelectedCols(Array(csv.length).fill(false));
  }, [csv]);

  useEffect(() => {
    RService.getCsvFiles()
    .then(function(response) {setCsvFiles([response[1], response]);})
    .catch(error =>  console.log('ERROR', error));
  }, []);

  const onDropDownChange = (file) => {
    setCsvFiles(prevstate => ([file, prevstate[1]]));
  }

  const onClickRefresh = () => {
    setRowInterval(rowInterval);
  }

  const onClickRowPrev = () => {
    setRowInterval(prevstate => ((prevstate[0]==0) ? prevstate : [prevstate[0]-1, prevstate[1]]));
  }

  const onClickRowNext = () => {
    setRowInterval(prevstate => ((prevstate[0]+prevstate[1]>=csv.length-2) ? prevstate : [prevstate[0]+1, prevstate[1]]));
  }

  const onClickColPrev = () => {
    setColInterval(prevstate => ((prevstate[0]==0) ? prevstate : [prevstate[0]-1, prevstate[1]]));
  }

  const onClickColNext = () => {
    setColInterval(prevstate => ((prevstate[0]+prevstate[1]>=csv[0].length-2) ? prevstate : [prevstate[0]+1, prevstate[1]]));
  }

  const onClickCol = (colIdx) => {
    let selected = selectedCols;
    selected[colIdx] = !selected[colIdx];
    setSelectedCols(selected);
  }
  
  return (
    <VRCanvas>
      <Sky sunPosition={[0, 1, 0]} />
      <Floor />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Controllers />
      <SpreadSheet 
        position={[0, 3, -7]}
        gridSize={gridSize}
        data={csv}
        colInterval={colInterval} 
        rowInterval={rowInterval}
        selectedCols={selectedCols}
        cellSize={[2.5, 0.2]} 
        anglemax={-1.4} 
        onClickCol={onClickCol}
      />
      <ButtonPanel 
        position={[0, 1, -1.5]} 
        rotation={[-0.8, 0, 0]}
        dropDownValue={csvFiles}
        onClickColPrev={onClickColPrev} 
        onClickColNext={onClickColNext} 
        onClickRowPrev={onClickRowPrev} 
        onClickRowNext={onClickRowNext} 
        onClickRefresh={onClickRefresh}
        onDropDownChangeValue={onDropDownChange}
      />
    </VRCanvas>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));