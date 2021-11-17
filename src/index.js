import { useState } from 'react'
import ReactDOM from 'react-dom'
import { VRCanvas, Interactive, DefaultXRControllers } from '@react-three/xr'
import { Sky, Text } from '@react-three/drei'
import '@react-three/fiber'
import './styles.css'

const CELL_X_SIZE = 0.4;
const CELL_Y_SIZE = 0.2;
const ANGLE_MAX = -1.3;
const GRID_NX = 20;
const GRID_NY = 10;

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
  const [hover, setHover] = useState(false)
  //const [color, setColor] = useState(0x123456)

  const onSelect = () => {
    setColor((Math.random() * 0xffffff) | 0)
  }

  return (
    <Interactive onSelect={onSelect} onHover={() => setHover(true)} onBlur={() => setHover(false)}>
      <Box color={color} scale={hover ? [1.5, 1.5, 1.5] : [1, 1, 1]} size={size} {...rest}>
        <Text position={[0, 0, 0.06]} fontSize={fontSize} color={fontColor} anchorX="center" anchorY="middle">
          {children}
        </Text>
      </Box>
    </Interactive>
  )
}

function ButtonPanel({ position, rotation }) {
  return (
    <Box color="black" size={[0.4, 0.4, 0.2]} position={position} rotation={rotation}>
      <Button color="#999" fontColor="#000" fontSize={0.015} size={[0.1, 0.1, 0.2]} position={[0.15, -0.15, 0]}>Next Col</Button>
      <Button color="#999" fontColor="#000" fontSize={0.015} size={[0.1, 0.1, 0.2]} position={[0.04, -0.15, 0]}>Previous Col</Button>
    </Box>
  )
}

function DataCol({firstcol, position, colSize, cellSize, rotation}){
  const [hover, setHover] = useState(false)
  const [color, setColor] = useState(0x123456)

  const onSelect = () => {
    if (color==0xffffff)
      setColor(0xffa36e);
    else
      setColor(0xffffff);
  }

  const onHover = () => {
    setColor(0xffa36e);
    setHover(true);
  }

  const onBlur = () => {
    setColor(0xffffff);
    setHover(false);
  }
  
  const generateCells = () => {
    const row = [];
    for (let i=0; i < colSize; i++){
      let size = [cellSize[0], cellSize[1], 0.1];
      let position = [0, cellSize[1]*(colSize/2-i), 0.1];
      let text = colSize+'x'+i;
      let colorBtn=color;
      let fontColor=0x000000
      if(firstcol){
        text = i+'';
        colorBtn=0x000000;
        fontColor=0xffffff;
      } else if (i==0) {
        text = 'Col'+ i;
        colorBtn=0x000000;
        fontColor=0xffffff;
      }
      row.push(<Button key={i+''+colSize} position={position} fontSize={0.1} fontColor={fontColor} color={colorBtn} size={size}>{text}</Button>);
    }
    return row;
  }

  return (
    <Interactive onSelect={onSelect} onHover={onHover} onBlur={onBlur}>
      <Box position={position} rotation={rotation} size={[cellSize[0], cellSize[1]*colSize, 0.01]}>
        {generateCells()}
      </Box>
    </Interactive>
  )
}

function SpreadSheet({position, gridSize, cellSize, anglemax}){
  const generateGrid = ([x, y, z]) => {
    const row = [];
    let startX = position[0]-gridSize[0]/2*cellSize[0];
    let startY = position[1]+gridSize[1]/2*cellSize[1];
    for (let i=0; i < gridSize[0]; i++){
      let mirrorX = i-gridSize[0]/2;
      let rotation = [0, mirrorX/(gridSize[0]/2)*anglemax, 0];
      let position = [startX+i*cellSize[0], startY, z+0.025*mirrorX*mirrorX];
      let size = [cellSize[0]+0.0025*mirrorX*mirrorX, cellSize[1], 0.1];
      row.push(<DataCol firstcol={false} position={position} rotation={rotation} colSize={gridSize[1]} cellSize={size} />);
    }
    return row;
  }

  return (
      <Box>
        {generateGrid(position)}
      </Box>
  )
}

function App() {

  return (
    <VRCanvas>
      <Sky sunPosition={[0, 1, 0]} />
      <Floor />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <DefaultXRControllers />
      <SpreadSheet position={[0, 2, -4]}  gridSize={[20, 10]} cellSize={[0.4, 0.2]} anglemax={-1.4} />
      <ButtonPanel rotation={[-1.1, 0, 0]} position={[0, 1, -1]}/>
    </VRCanvas>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
