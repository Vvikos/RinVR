import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { VRCanvas, DefaultXRControllers } from '@react-three/xr'
import { Sky } from '@react-three/drei'
import Console from './components/Console'
import SpreadSheet from './components/SpreadSheet'
import ButtonPanel from './components/ButtonPanel'
import RService from './services/RService'
import '@react-three/fiber'
import './styles.css'

const CELL_X_SIZE = 0.4;
const CELL_Y_SIZE = 0.2;
const ANGLE_MAX = -1.3;
const GRID_NX = 20;
const GRID_NY = 10;
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
  const [logs, setLogs] = useState('');
  const [csv, setCsv] = useState([[],[]]);
  const [csvFiles, setCsvFiles] = useState(['', []]);
  const [fetchInterval, setFetchInterval] = useState([0, 1]);
  const [rowInterval, setRowInterval] = useState([0, GRID_NY-1]);
  const [colInterval, setColInterval] = useState([0, 8]);

  useEffect(() => {
    if(csvFiles[0]=='') {
      addLogs('NO REQUEST', 'NO FETCH');
      return;
    }
    if(rowInterval[1]+rowInterval[0]>fetchInterval[0]+fetchInterval[1]){
      setFetchInterval(prevstate => ([prevstate[0], prevstate[1]+FETCH_SIZE]));
    }

  }, [rowInterval, csvFiles]);

  useEffect(() => {
    if(csvFiles[0]=='') {
      addLogs('NO REQUEST', 'NO FETCH');
      return;
    }

    RService.getCsv(csvFiles[0], fetchInterval).then(response => setCsv([Array(response.length).fill(false), response]));
    addLogs('REQUEST 200 OK', 'DETAILS FETCHED');
  }, [fetchInterval]);

  useEffect(() => {
    RService.getCsvFiles().then(response => setCsvFiles(['', response]));
    addLogs('REQUEST 200 OK', 'FILES FETCHED');
  }, []);

  const addLogs = (type, log) => {
    const MAX_CHAR = 1000;
    let added_logs = '> '+type+' : ' + log;
    if(logs.length + added_logs.length < MAX_CHAR)
      setLogs(logs+'\n'+added_logs);
    else
      setLogs(added_logs);
  }

  const onDropDownChange = (file) => {
    addLogs('DropDown Event', 'DropDown value changed');
    setCsvFiles(prevstate => ([file, prevstate[1]]));
  }

  const onClickRefresh = () => {
    addLogs('Mouse Event', 'Clicked Refresh');
    setRowInterval(prevstate => ([prevstate[0], prevstate[1]]));
  }

  const onClickRowPrev = () => {
    addLogs('Mouse Event', 'Clicked Previous Row');
    setRowInterval(prevstate => ((prevstate[0]==0) ? [0, prevstate[1]] : [prevstate[0]-1, prevstate[1]]));
  }

  const onClickRowNext = () => {
    addLogs('Mouse Event', 'Clicked Next Row');
    setRowInterval(prevstate => ([prevstate[0]+1, prevstate[1]]));
  }

  const onClickColPrev = () => {
    addLogs('Mouse Event', 'Clicked Previous Col');
    setColInterval(prevstate => ((prevstate[0]==0) ? [0, prevstate[1]] : [prevstate[0]-1, prevstate[1]]));
  }

  const onClickColNext = () => {
    addLogs('Mouse Event', 'Clicked Next Col');
    setColInterval(prevstate => ([prevstate[0]+1, prevstate[1]+1]));
  }

  const onClickCol = (colIdx) => {
    let selected = csv[0];
    selected[colIdx] = !selected[colIdx];
    let info = ((selected[colIdx]) ? 'Selected' : 'Unselected')
    addLogs('COL SELECTION', 'Col '+colIdx+' '+info);
    setCsv([selected, csv[1]]);
  }
  
  return (
    <VRCanvas>
      <Sky sunPosition={[0, 1, 0]} />
      <Floor />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <DefaultXRControllers />
      <Console position={[0, 6, -4]} rotation={[Math.PI*2.2, 0, 0]} logs={logs} />
      <SpreadSheet 
        data={csv} 
        position={[0, 2, -7]} 
        colInterval={colInterval} 
        rowInterval={rowInterval} 
        gridSize={[8, 10]} 
        cellSize={[2.5, 0.2]} 
        anglemax={-1.4} 
        onClickCol={onClickCol}
      />
      <ButtonPanel 
        position={[0, 1, -1.5]} 
        rotation={[-0.8, 0, 0]} 
        onClickColPrev={onClickColPrev} 
        onClickColNext={onClickColNext} 
        onClickRowPrev={onClickRowPrev} 
        onClickRowNext={onClickRowNext} 
        onClickRefresh={onClickRefresh}
        onDropDownChangeValue={onDropDownChange}
        dropDownValue={csvFiles}
      />
    </VRCanvas>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));