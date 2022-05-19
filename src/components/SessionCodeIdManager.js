/**
 * @module SessionCodeIdManager
 */
import '../styles.css'
import { useRContext } from '../RContextProvider'
import React from 'react';
import { Alert } from '@material-ui/lab';

/**
 * Gestion de la creation de session / connexion à une session existante
 * @returns {} - Page de connexion 
 */
function SessionCodeIdManager() {
    const { sessionCodeId, setSessionState } = useRContext();
    const [session, setSession] = React.useState(null);
    const [panelDiplayed, setPanelDiplayed] = React.useState(true);

    const [error, setError] = React.useState("");
    
    React.useEffect(() => {
      if(!session || session=="#00001" || sessionCodeId=="#00001"){
        setError("Session ID does not exist !");
        setSession("#00001");
        setPanelDiplayed(true);
      }else{
        setSession(sessionCodeId);
        setPanelDiplayed(false);
      }

      console.log(session, sessionCodeId);
    }, [sessionCodeId, session]);

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
      setPanelDiplayed(false);
    }
  
    return (
    <>
      {panelDiplayed ?
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
                    </div>
                </div>
            </div>
        </div>
      :
        null
      }
    </>
    )
  }

export default SessionCodeIdManager;