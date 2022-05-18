import '../styles.css'
import { useRContext } from '../RContextProvider'
import React from 'react';
import { Alert } from '@material-ui/lab';

function SessionCodeIdManager() {
    const { sessionCodeId, setSessionState } = useRContext();
    const [session, setSession] = React.useState(null);

    const [error, setError] = React.useState("");
    
    React.useEffect(() => {
      if(sessionCodeId == "#00001"){
        setError("Session ID does not exist !");
        setSession(sessionCodeId);
      } 
  }, [sessionCodeId]);

  React.useEffect(() => {
    if(session == "#00001"){
      setError("Session ID does not exist !");
    } 
}, [session]);

    function connectToSession() {
      let inputSessionId = document.getElementById("sessionId").value;
      let isnum = /^\d+$/.test(inputSessionId);

      if(!isnum){
        setError("Session ID should be only numbers !");
        setSession(null);
      }

      if(inputSessionId && inputSessionId.length == 6 && isnum){
        setSessionState(inputSessionId);
        setSession(sessionCodeId);
      }

      if(inputSessionId.length == 0){
        setError("Input is empty !");
        setSession(null);
      }
    }
  
    function createSession() {
      setSessionState('INIT');
    }
  
    return (
    <>
      {sessionCodeId && sessionCodeId != "#00001" ?
        null
      :
        <div className="sessionCodeId">
            <div>
                <div>
                    <div>
                        <label>Existing Session ID (6 numbers) :</label>
                        <input type="text" id="sessionId" required minLength="6" maxLength="6" size="10" />
                        <input type='button' value='Connect' onClick={connectToSession}/>
                        
                        { error != "" ? 
                          <div className='sessionCodeIdError'>
                              <Alert className='input-error' severity="error">{error}</Alert>
                          </div>
                        : null }
                    </div>
                    <div>
                        OR
                    </div>
                    <div>
                        <input type='button' value='Create Session' onClick={createSession} />
                        <p color='red'>{}</p>
                    </div>
                </div>
            </div>
        </div>
      }
    </>
    )
  }

export default SessionCodeIdManager;