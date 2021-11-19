import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { VRCanvas, Interactive, DefaultXRControllers } from '@react-three/xr'
import { Sky, Text } from '@react-three/drei'
import '@react-three/fiber'
import Papa from 'papaparse';
import './styles.css'

const CELL_X_SIZE = 0.4;
const CELL_Y_SIZE = 0.2;
const ANGLE_MAX = -1.3;
const GRID_NX = 20;
const GRID_NY = 10;
const API_R = 'https://vr.achencraft.fr';

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry attach="geometry" args={[40, 40]} />
      <meshStandardMaterial attach="material" color="#666" />
    </mesh>
  )
}

function Box({ color, size, scale, children, ...rest }) {
  return (
    <mesh scale={scale} {...rest}>
      <boxBufferGeometry attach="geometry" args={size} />
      <meshPhongMaterial attach="material" color={color} />
      {children}
    </mesh>
  )
}

function Button({ children, size, color, fontSize, fontColor, ...rest}) {
  return (
    <Box color={color} size={size} {...rest}>
      <Text fontSize={fontSize} color={fontColor} anchorX="center" anchorY="middle">
        {children}
      </Text>
    </Box>
  )
}

function ButtonPanel({ onClickColPrev, onClickColNext, onClickRowPrev, onClickRowNext, position, rotation }) {
  const [hover, setHover] = useState(false)
  const [select, setSelect] = useState(false)
  const [color, setColor] = useState(0xffffff)

  const onSelect = () => {
    if (select)
      setColor(0xffa36e);
    else
      setColor(0xffffff);
    setSelect(!select);
  }

  const onHover = () => {
    setHover(true);
  }

  const onBlur = () => {
    setHover(false);
  }
  
  return (
    <Box color={color} size={[0.4, 0.4, 0.01]} position={position} rotation={rotation}>
      <Interactive onSelect={function() { onSelect(); onClickColNext(); }} onHover={onHover} onBlur={onBlur}>
        <Button scale={hover ? [1.1, 1.1, 1.1] : [1, 1, 1]} color={0xfc2617} fontColor={0xffffff} fontSize={0.015} size={[0.15, 0.1, 0.02]} position={[0.10, -0.15, 0.03]}>Next Col</Button>
      </Interactive>
      <Interactive onSelect={function() { onSelect(); onClickColPrev(); }} onHover={onHover} onBlur={onBlur}>
        <Button scale={hover ? [1.1, 1.1, 1.1] : [1, 1, 1]} color={0xfc2617} fontColor={0xffffff} fontSize={0.015} size={[0.15, 0.1, 0.02]} position={[-0.10, -0.15, 0.03]}>Previous Col</Button>
      </Interactive>
    </Box>
  )
}

function Console({logs}){

  return (
    <Box size={[4, 4, 0]} position={[0, 6, -4]} rotation={[Math.PI*2.2, 0, 0]} color="black">
      <Text anchorX="center" anchorY="middle" position={[1,0,0.02]} maxWidth={3} color="white"  fontSize={0.12}>{'Console logs\n' + logs}</Text>
    </Box>
  )
}

function DataCol({data, firstcol, fetchInterval, position, colSize, cellSize, rotation}){
  const [hover, setHover] = useState(false)
  const [select, setSelect] = useState(false)
  const [color, setColor] = useState(0xffffff)

  const onSelect = () => {
    if (select)
      setColor(0xffa36e);
    else
      setColor(0xffffff);
    setSelect(!select);
  }

  const onHover = () => {
    setHover(true);
  }

  const onBlur = () => {
    setHover(false);
  }
  
  const generateCells = () => {
    const row = [];
    let fontSize = 0.1;
    let maxCells = colSize;
    for (let i=0; i < maxCells; i++){
      var longest = data.reduce(
        function (a, b) {
            return a.length > b.length ? a : b;
        }
      );
      let size = [((cellSize[0]<longest.length*fontSize/2) ? longest.length*fontSize/2 : cellSize[0]), cellSize[1], 0.1];
      let position = [0, cellSize[1]*(colSize/2-i), 0.1];
      let text = data[i];
      let colorBtn=color;
      let fontColor=0x000000
      if(firstcol){
        text = (fetchInterval[0]+i)+'';
        colorBtn=0x000000;
        fontColor=0xffffff;
      } else if (i==0) {
        if (firstcol)
          text = '';
        colorBtn=0x000000;
        fontColor=0xffffff;
      }
      if(i >= data.length && !firstcol)
        text = '';
      
      row.push(<Button key={i+''+colSize} position={position} fontSize={fontSize} fontColor={fontColor} color={colorBtn} size={size}>{text}</Button>);

    }
    return row;
  }

  return (
      <Box scale={hover ? [1.01, 1.01, 1.01] : [1, 1, 1]} position={position} rotation={rotation} size={[0,0,0]}>
        <Interactive onSelect={onSelect} onHover={onHover} onBlur={onBlur}>
          {generateCells()}
        </Interactive>
      </Box>
  )
}


function SpreadSheet({data, position, colInterval, fetchInterval, gridSize, cellSize, anglemax}){
  function range([start, end]) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
  }

  const generateGrid = () => {
    const rows = [];
    const startY = position[1]+gridSize[1]/2*cellSize[1];

    let maxRows = gridSize[0];
    let pi_coeff = Math.PI/maxRows;
    let circle_ray = 5;
    
    let rotation = [0,-Math.PI/2*Math.cos(-1*maxRows*pi_coeff),0];
    let pos = [position[0]+circle_ray*Math.cos(-1*maxRows*pi_coeff), position[2]+startY, circle_ray*Math.sin(-1*maxRows*pi_coeff)];
    let size = [cellSize[0], cellSize[1], 0.01];
    let data_col = range(fetchInterval);
    rows.push(<DataCol key={'Col'+0} data={data_col} firstcol={true} fetchInterval={fetchInterval} position={pos} rotation={rotation} colSize={gridSize[1]} cellSize={size} />);
   
    for (let i=1; i < maxRows; i++){
      rotation = [0,-Math.PI/2*Math.cos(-1*(maxRows-i)*pi_coeff),0];
      pos = [position[0]+circle_ray*Math.cos(-1*(maxRows-i)*pi_coeff), position[2]+startY, circle_ray*Math.sin(-1*(maxRows-i)*pi_coeff)];
      data_col=[i];
      if(i+colInterval[0]-1 < data.length)
        data_col=data[colInterval[0]+i-1];
      rows.push(<DataCol key={'Col'+i} data={data_col} firstcol={false} fetchInterval={fetchInterval} position={pos} rotation={rotation} colSize={gridSize[1]} cellSize={size} />);
    }
    console.log(data);
    return rows;
  }

  return (
      <>
        {generateGrid()}
      </>
  )
}

function App() {
  const [logs, setLogs] = useState('No console logs.\n');
  const [csv, setCsv] = useState([]);
  const [csvFiles, setCsvFiles] = useState([['sample.csv'], []]);
  const [fetchInterval, setFetchInterval] = useState([0, GRID_NY-1]);
  const [colInterval, setColInterval] = useState([0, 8]);

  useEffect(() => {
    fetch(API_R + "/csv?name="+csvFiles[0]+"&offset="+fetchInterval[0]+"&limit="+(fetchInterval[1]-fetchInterval[0]), {mode: 'cors'})
    .then(res => {
      const reader = res.body.getReader();
      return reader.read();
    })
    .then(result => {
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(result.value);
    })
    .then(csvStr => {
      const csv_data = Papa.parse(csvStr);
      const csv_flip = csv_data.data.map((_, colIndex) => csv_data.data.map(row => row[colIndex]));
      setCsv(csv_flip);
      addLogs('Fetched Csv', csv_flip.toString());
    })
    .catch(e => {
      console.log(e);
      return e;
    });
    
    fetch(API_R + "/csv_names", {mode: 'cors'})
    .then(res => {
      const reader = res.body.getReader();
      return reader.read();
    })
    .then(result => {
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(result.value);
    })
    .then(csvStr => {
      const csv_data = Papa.parse(csvStr).data;
      setCsvFiles([csv_data[0], csv_data]);
      addLogs('Fetched Csv Files', csv_data.toString());
    })
    .catch(e => {
      console.log(e);
      return e;
    });
  }, []);

  const addLogs = (type, log) => {
    const MAX_CHAR = 100;
    let added_logs = 'LOGS | '+type+' : ' + log + '\n';
    if(logs + added_logs.length < MAX_CHAR)
      setLogs(logs+'\n'+added_logs);
    else
      setLogs(added_logs);
  }

  const onClickRowPrev = () => {
    addLogs('Mouse Event', 'Clicked Previous Row');
    setFetchInterval(prevstate => ((prevstate[0]==0) ? [0, prevstate[1]] : [prevstate[0]-1, prevstate[1]]));
  }

  const onClickRowNext = () => {
    addLogs('Mouse Event', 'Clicked Next Row');
    setFetchInterval(prevstate => (prevstate[0]+1, prevstate[1]+1));
  }

  const onClickColPrev = () => {
    addLogs('Mouse Event', 'Clicked Previous Col');
    setColInterval(prevstate => ((prevstate[0]==0) ? [0, prevstate[1]] : [prevstate[0]-1, prevstate[1]]));
  }

  const onClickColNext = () => {
    addLogs('Mouse Event', 'Clicked Next Col');
    setColInterval(prevstate => (prevstate[0]+1, prevstate[1]+1));
  }
  
  return (
    <VRCanvas>
      <Sky sunPosition={[0, 1, 0]} />
      <Floor />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <DefaultXRControllers />
      <Console logs={logs} />
      <SpreadSheet data={csv} position={[0, 2, -1]} colInterval={colInterval} fetchInterval={fetchInterval} gridSize={[8, 10]} cellSize={[0.8, 0.2]} anglemax={-1.4} />
      <ButtonPanel onClickColPrev={onClickColPrev} onClickColNext={onClickColNext} onClickRowNext={onClickRowNext} onClickRowPrev={onClickRowPrev} position={[0, 1.5, -1]} rotation={[-0.8, 0, 0]} />
    </VRCanvas>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));