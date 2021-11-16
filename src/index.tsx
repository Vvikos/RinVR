import { useState } from 'react'
import ReactDOM from 'react-dom'
import { VRCanvas, Interactive, DefaultXRControllers } from '@react-three/xr'
import { Sky, Text } from '@react-three/drei'
import '@react-three/fiber'
import './styles.css'

const CELL_X_SIZE = 0.4;
const CELL_Y_SIZE = 0.2;
const ANGLE_MAX = -10;
const GRID_NX = 20;
const GRID_NY = 20;

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry attach="geometry" args={[40, 40]} />
      <meshStandardMaterial attach="material" color="#666" />
    </mesh>
  )
}

function Box({ color, size, scale, children, ...rest }: any) {
  return (
    <mesh scale={scale} {...rest}>
      <boxBufferGeometry attach="geometry" args={size} />
      <meshPhongMaterial attach="material" color={color} />
      {children}
    </mesh>
  )
}

function Button(props: any) {
  const [hover, setHover] = useState(false)
  const [color, setColor] = useState(0x123456)

  const onSelect = () => {
    setColor((Math.random() * 0xffffff) | 0)
  }

  return (
    <Interactive onSelect={onSelect} onHover={() => setHover(true)} onBlur={() => setHover(false)}>
      <Box color={color} scale={hover ? [1.5, 1.5, 1.5] : [1, 1, 1]} size={[CELL_X_SIZE, CELL_Y_SIZE, 0.05]} {...props}>
        <Text>Coucou</Text>
      </Box>
    </Interactive>
  )
}

function App() {
  const generateGrid = () => {
    const row = [];
    for (let i = -1*GRID_NX/2; i < GRID_NX/2; i++){
      for (let j = -1*GRID_NY/2; j < GRID_NY/2; j++){
        if (i<0){
          row.push(<Button position={[i*(CELL_X_SIZE+0.05), j*(CELL_Y_SIZE+0.05), -1-i/GRID_NX/2]} rotation={[0, i/GRID_NX/2*ANGLE_MAX, 0]}/>)
        } else if (i>=0) {
          row.push(<Button position={[i*(CELL_X_SIZE+0.05), j*(CELL_Y_SIZE+0.05), -1+i/GRID_NX/2]} rotation={[0, i/GRID_NX/2*ANGLE_MAX, 0]}/>)
        }
      }
    }
    return row;
  }
  return (
    <VRCanvas>
      <Sky sunPosition={[0, 1, 0]} />
      <Floor />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <DefaultXRControllers />
      {generateGrid()}
    </VRCanvas>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
