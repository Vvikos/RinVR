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
      <planeBufferGeometry attach="geometry" args={[40, 30]} />
      <meshStandardMaterial attach="material" color="#666" />
    </mesh>
  )
}

function App() {
  
  return (
    <VRCanvas>
      <Sky distance={450000} sunPosition={[5, 1, 8]} inclination={0} azimuth={0.25} />
      <pointLight position={[10, 10, 10]} />
      <RContextProvider>
        <Controllers />
        <SpreadSheet position={[0, 3, -7]} />
      </RContextProvider>
    </VRCanvas>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));