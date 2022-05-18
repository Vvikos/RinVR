import ReactDOM from 'react-dom'
import { VRCanvas } from '@react-three/xr'
import { Sky } from '@react-three/drei'
import SpreadSheet from './components/SpreadSheet'
import Controllers from './components/Controllers'
import { RContextProvider, useRContext } from './RContextProvider'
import '@react-three/fiber'
import './styles.css'

function SessionCodeIdManager() {
  const { sessionCodeId, setSessionState } = useRContext();

  function connectToSession() {
    let inputSessionId = document.getElementById("sessionId").value;
    let isnum = /^\d+$/.test(inputSessionId);
    if(inputSessionId && inputSessionId.length == 6 && isnum)
      setSessionState(inputSessionId);
  }

  function createSession() {
    setSessionState('INIT');
  }

  return (
  <>
    {sessionCodeId ?
      null
    :
      <div 
        className="sessionCodeId" 
        style={{ display: "block", height: '98%', width: '99%', backgroundColor: '#000000', flex: 1, flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}
      >
        <label>Existing Session ID (6 numbers):</label>
        <input type="text" id="sessionId" required minLength="6" maxLength="6" size="10" />
        <input type='button' value='Connect' onClick={connectToSession}/>
        OR
        <input type='button' value='Create Session' onClick={createSession} />
        <p color='red'>{}</p>
      </div>
    }
  </>
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
          <SessionCodeIdManager />
      </RContextProvider>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));