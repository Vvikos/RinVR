import ReactDOM from 'react-dom'
import { VRCanvas } from '@react-three/xr'
import { Sky } from '@react-three/drei'
import SpreadSheet from './components/SpreadSheet'
import Controllers from './components/Controllers'
import { RContextProvider, useRContext } from './RContextProvider'
import '@react-three/fiber'
import './styles.css'

function SessionCodeId() {
  const { sessionCodeId } = useRContext();
  return (
    <div className="sessionCodeId" style={{ display: "block" }}>
      { sessionCodeId ? 
          'Session Code Id : #'+sessionCodeId
        :
          'Session not created'
      }
    </div>
  )
}

function App() {

  return (
    <>
      <VRCanvas>
        <Sky distance={450000} sunPosition={[5, 1, 8]} inclination={0} azimuth={0.25} />
        <pointLight position={[10, 10, 10]} />
        <RContextProvider>
          <Controllers />
          <SpreadSheet position={[0, 3, -7]} />
        </RContextProvider>
      </VRCanvas>
      <RContextProvider>
          <SessionCodeId />
      </RContextProvider>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));