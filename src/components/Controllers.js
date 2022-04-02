import { useState, useEffect } from 'react'
import { useXREvent, useController, DefaultXRControllers } from '@react-three/xr'
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import { useRContext } from '../RContextProvider'
import DropDown from './DropDown'
import Box from './Box'

function Controllers() {
    const { csvFiles, setCsvFiles, rowInterval, setRowInterval, colInterval, setColInterval, gridSize } = useRContext();
    const leftController = useController('left');
    const [wristlePosition, setWristlePosition] = useState([0, 8, -3]);
    const [wristlePanel, setWristlePanel] = useState(false);
    const [joystickDirections, setJoystickDirections] = useState(['center']);
    const [inAnimation, setInAnimation] = useState(false);
    const [panelSize, setPanelSize] = useState([0,0,0.001]);

    const finalPanelSize = [1.5, 1, 0.001];
    const animationFrameCount = 4.;

    useXREvent('squeezeend', (e) => {if(!inAnimation) setWristlePanel(!wristlePanel)}, {handedness: 'left'});

    useEffect(() => {
        if(Array.isArray(joystickDirections)){
            if(joystickDirections.indexOf('center')){
                joystickDirections.forEach(element => {
                    if(element == 'left')
                        setColInterval(prevstate => ((prevstate[0]==0) ? prevstate : [prevstate[0]-1, prevstate[1]]));
                    else if(element == 'right')
                        setColInterval(prevstate => ((prevstate[0]+prevstate[1]>=csv[0].length-2) ? prevstate : [prevstate[0]+1, prevstate[1]]));
                    else if(element == 'top')
                        setRowInterval(prevstate => ((prevstate[0]==0) ? prevstate : [prevstate[0]-1, prevstate[1]]));
                    else if(element == 'bottom')
                        setRowInterval(prevstate => ((prevstate[0]+prevstate[1]>=csv.length-2) ? prevstate : [prevstate[0]+1, prevstate[1]]));
                    
                    setJoystickDirections(['center']);
                });
            }
        }
    }, [joystickDirections]);

    /*useEffect(() => {
        if (rightController) {
            if (rightController.inputSource && rightController.inputSource.gamepad && leftController.inputSource.gamepad.axes) {
                let joystickX = leftController.inputSource.gamepad.axes[2];
                let joystickY = leftController.inputSource.gamepad.axes[3];
                let newJoystickDirections = [];
                if(joystickX<0.85 && joystickX>-0.85 && joystickY<0.85 && joystickY>-0.85){
                    newJoystickDirections.push('center');
                }else{
                    if(joystickX<-0.85)
                        newJoystickDirections.push('left');
                    else if(joystickY <-0.85)
                        newJoystickDirections.push('top');
                    else if(joystickX > 0.85)
                        newJoystickDirections.push('right');
                    else if(joystickY > 0.85)
                        newJoystickDirections.push('bottom');
                }
                setJoystickDirections(newJoystickDirections);
            }
        }
    }, [rightController]);*/

    const onDropDownChange = (file) => {
        let newCsvFiles = csvFiles.slice();
        let idx = newCsvFiles.indexOf(file);
        //swap selected file to first file
        [newCsvFiles[0], newCsvFiles[idx]] = [newCsvFiles[idx], newCsvFiles[0]];
        setCsvFiles(newCsvFiles);
    }

    const onClickRefresh = () => {
        setRowInterval(rowInterval);
    }

    useFrame(() => {
        if (leftController && leftController.grip && leftController.grip.position) {
            let position = [leftController.grip.position.x-panelSize[0]/4., leftController.grip.position.y+4*panelSize[1]/5, leftController.grip.position.z-(panelSize[0]+panelSize[1])/2.];
            setWristlePosition(position);
        }
            
        if (leftController && inAnimation) {
            if(wristlePanel){
                if(panelSize[0] >= finalPanelSize[0] && panelSize[1] >= finalPanelSize[1]){
                    setInAnimation(false);
                    setPanelSize(finalPanelSize);
                }else if(panelSize[0] < finalPanelSize[0]){
                    let nextSizeX = (panelSize[0]+1./animationFrameCount*finalPanelSize[0] > finalPanelSize[0] ? finalPanelSize[0] : panelSize[0]+1./animationFrameCount*finalPanelSize[0]);
                    setPanelSize([nextSizeX, panelSize[1], panelSize[2]]);
                }else if(panelSize[1] < finalPanelSize[1]){
                    let nextSizeY = (panelSize[1]+1./animationFrameCount*finalPanelSize[1] > finalPanelSize[1] ? finalPanelSize[1] : panelSize[1]+1./animationFrameCount*finalPanelSize[1]);
                    setPanelSize([panelSize[0], nextSizeY, panelSize[2]]);
                }
            }else{
                if(panelSize[0] <= 0.001 && panelSize[1] <= 0.001){
                    setInAnimation(false);
                    setPanelSize([0, 0.001, 0.001]);
                }else if(panelSize[1] > 0.001){
                    setPanelSize([panelSize[0], panelSize[1]-1./animationFrameCount*finalPanelSize[1], panelSize[2]]);
                }else if(panelSize[0] > 0.001){
                    setPanelSize([panelSize[0]-1./animationFrameCount*finalPanelSize[0], 0.001, panelSize[2]]);
                }
            }
        }
    });

    useEffect(() => {
        setInAnimation(true);
    }, [wristlePanel]);

    return (
        <>
            <DefaultXRControllers />
            <Billboard
                follow={true}
                lockX={true}
                lockY={false}
                lockZ={true} // Lock the rotation on the z axis (default=false)
                position={wristlePosition}
                scale={panelSize}
            >
                <DropDown scale={[1, 1.5, 1]} color={0xffffff} onChangeValue={onDropDownChange} dropDownValue={csvFiles} position={[0, panelSize[1]/8, 0]}/>
                <Box position={[0, 0, -panelSize[1]/2]}></Box>
            </Billboard>
        </>
    )
}

//<RoundedButton color={wristleColor} fontColor={0xffffff} fontSize={0.015} size={[0.05, 0.05, 0.001]} position={wristlePosition} rotation={wristleRotation}>WRISTLE</RoundedButton>

export default Controllers;