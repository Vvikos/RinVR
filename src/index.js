import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { VRCanvas, DefaultXRControllers } from '@react-three/xr'
import { useFrame } from "@react-three/fiber";
import { Sky } from '@react-three/drei'
import Console from './components/Console'
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
  const [logs, setLogs] = useState('');
  const [csv, setCsv] = useState([]);
  const [selectedCols, setSelectedCols] = useState([]);
  const [csvFiles, setCsvFiles] = useState(['', []]);
  const [fetchInterval, setFetchInterval] = useState([0, 0]);
  const [rowInterval, setRowInterval] = useState([0, 9]);
  const [colInterval, setColInterval] = useState([0, 9]);

  useEffect(() => {
    if(csvFiles[0]=='') {
      addLogs('INFO', 'NO FILE FETCHED BECAUSE NO FILE SELECTED');
      return;
    }
    if(rowInterval[1]+rowInterval[0]>=fetchInterval[0]+fetchInterval[1]){
      setFetchInterval(prevstate => ([prevstate[0], prevstate[1]+FETCH_SIZE]));
    }

  }, [rowInterval, csvFiles]);

  useEffect(() => {
    if(csvFiles[0]=='') {
      addLogs('INFO', 'NO FILE FETCHED BECAUSE NO FILE SELECTED');
      return;
    }

    RService.getCsv(csvFiles[0], fetchInterval)
    .then(response => setCsv(response))
    .catch(error => addLogs('ERROR', error));
    addLogs('INFO', '['+fetchInterval[0]+','+(fetchInterval[0]+fetchInterval[1])+']');
  }, [fetchInterval]);

  useEffect(() => {
    if (csv.length>0 && csv[1].length>0 && csv[1][0].length>0) {
      setRowInterval([0, ((csv[1][0].length < gridSize[1]-1) ? csv[1][0].length : gridSize[1]-1)]);
      setColInterval([0, ((csv[1].length < gridSize[0]-1) ? csv[1].length : gridSize[0]-1)]);
    }
    setSelectedCols(Array(csv.length).fill(false));
    if (csv.length>0)
      addLogs('INFO', 'REQUEST 200 OK : CSV SIZE ' + csv.length + 'x' + csv[0].length);
  }, [csv]);

  useEffect(() => {
    RService.getCsvFiles()
    .then(function(response) {setCsvFiles([response[0], response]); addLogs('INFO', 'FILES FETCHED');})
    .catch(error => addLogs('ERROR', error));
  }, []);

  const addLogs = (type, log) => {
    const MAX_CHAR = 750;
    let added_logs = '> '+type+' : ' + log;
    if(logs.length + added_logs.length < MAX_CHAR)
      setLogs(logs+'\n'+added_logs);
    else
      setLogs(added_logs);
  }

  const onDropDownChange = (file) => {
    addLogs('INFO', 'DropDown value changed');
    setCsvFiles(prevstate => ([file, prevstate[1]]));
  }

  const onClickRefresh = () => {
    addLogs('INFO', 'Clicked Refresh');
    setRowInterval(rowInterval);
  }

  const onClickRowPrev = () => {
    addLogs('INFO', 'Clicked Previous Row');
    setRowInterval(prevstate => ((prevstate[0]==0) ? prevstate : [prevstate[0]-1, prevstate[1]]));
  }

  const onClickRowNext = () => {
    addLogs('INFO', '['+(rowInterval[0]+1)+','+(rowInterval[0]+rowInterval[1]+1)+'] '+csv.length+'x'+csv[0].length);
    setRowInterval(prevstate => ((prevstate[0]+prevstate[1]>=csv.length-2) ? prevstate : [prevstate[0]+1, prevstate[1]]));
  }

  const onClickColPrev = () => {
    addLogs('INFO', 'Clicked Previous Col');
    setColInterval(prevstate => ((prevstate[0]==0) ? prevstate : [prevstate[0]-1, prevstate[1]]));
  }

  const onClickColNext = () => {
    addLogs('INFO', '['+(colInterval[0]+1)+','+(colInterval[0]+colInterval[1]+1)+'] '+csv.length+'x'+csv[0].length);
    setColInterval(prevstate => ((prevstate[0]+prevstate[1]>=csv[0].length-2) ? prevstate : [prevstate[0]+1, prevstate[1]]));
  }

  const onClickCol = (colIdx) => {
    let selected = selectedCols;
    selected[colIdx] = !selected[colIdx];
    let info = ((selected[colIdx]) ? 'Selected' : 'Unselected')
    addLogs('INFO', 'Col '+colIdx+' '+info);
    setSelectedCols(selected);
  }
  
  return (
    <VRCanvas>
      <Sky sunPosition={[0, 1, 0]} />
      <Floor />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Controllers />
      <Console position={[0, 6, -4]} rotation={[Math.PI*2.2, 0, 0]} logs={logs} />
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