import ReactDOM from 'react-dom'
import { VRCanvas } from '@react-three/xr'
import { Sky } from '@react-three/drei'
import SpreadSheet from './components/SpreadSheet'
import Controllers from './components/Controllers'
import { RContextProvider } from './RContextProvider'
import '@react-three/fiber'
import './styles.css'

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry attach="geometry" args={[40, 40]} />
      <meshStandardMaterial attach="material" color="#666" />
    </mesh>
  )
}

function App() {
  
  return (
    <VRCanvas>
      <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
      <Floor />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <RContextProvider>
        <Controllers />
        <SpreadSheet position={[0, 3, -7]} cellSize={[2.5, 0.2]} anglemax={-1.4} />
      </RContextProvider>
    </VRCanvas>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));