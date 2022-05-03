import { useState, useEffect, useRef } from 'react'
import { useXREvent, useController, DefaultXRControllers } from '@react-three/xr'
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import { useRContext } from '../RContextProvider'
import DropDown from './DropDown'
import Box from './Box'
import UserPreferences from './UserPreferences'
import QueryBuilder from './QueryBuilder'

function Controllers() {
    const { csvFiles, setCsvFiles, incrementRowInterval, decrementRowInterval, incrementColInterval, decrementColInterval, gridSize } = useRContext();
    const leftController = useController('left');
    const rightController = useController('right');
    const ref = useRef();
    const [wristlePanel, setWristlePanel] = useState(false);
    const [swipeColMode, setSwipeColMode] = useState(false);
    const [swipeRowMode, setSwipeRowMode] = useState(false);
    const [joystickDirections, setJoystickDirections] = useState(['center']);
    const [inAnimation, setInAnimation] = useState(false);

    const finalPanelSize = { x:1.5, y:1, z:0.001 };
    const animationFrameCount = 4.;

    useXREvent('squeezeend', (e) => {if(!inAnimation) setWristlePanel(!wristlePanel)}, {handedness: 'left'});
    
    // Swipe Colomns mode
    useXREvent('squeezestart', (e) => {if(!swipeRowMode) setSwipeColMode(true)}, {handedness: 'right'});
    useXREvent('squeezeend', (e) => {if(!swipeRowMode) setSwipeColMode(false)}, {handedness: 'right'});    
    useXREvent('selectend', (e) => {if(swipeColMode && !swipeRowMode) incrementColInterval();}, {handedness: 'right'});
    useXREvent('selectend', (e) => {if(swipeColMode && !swipeRowMode) decrementColInterval();}, {handedness: 'left'});

    // Swipe Rows mode
    useXREvent('selectstart', (e) => {if(!swipeColMode) setSwipeRowMode(true)}, {handedness: 'left'});
    useXREvent('selectend', (e) => {if(!swipeColMode) setSwipeRowMode(false)}, {handedness: 'left'});
    useXREvent('selectend', (e) => {if(swipeRowMode && !swipeColMode) incrementRowInterval();}, {handedness: 'right'});
    useXREvent('squeezeend', (e) => {if(swipeRowMode && !swipeColMode) decrementRowInterval();}, {handedness: 'right'});

    useEffect(() => {
        if(Array.isArray(joystickDirections)){
            if(joystickDirections.indexOf('center')){
                joystickDirections.forEach(element => {
                    if(element == 'left')
                        decrementColInterval();
                    else if(element == 'right')
                        incrementColInterval();
                    else if(element == 'top')
                        decrementRowInterval();
                    else if(element == 'bottom')
                        incrementRowInterval();
                    
                    setJoystickDirections(['center']);
                });
            }
        }
    }, [joystickDirections]);

    const onDropDownChange = (file) => {
        let newCsvFiles = csvFiles.slice();
        let idx = newCsvFiles.indexOf(file);
        //swap selected file to first file
        [newCsvFiles[0], newCsvFiles[idx]] = [newCsvFiles[idx], newCsvFiles[0]];
        setCsvFiles(newCsvFiles);
    }

    useFrame(() => {
        let currentSize = ref.current.scale;
        if (leftController && leftController.grip && leftController.grip.position) {
            ref.current.position.x = leftController.grip.position.x-leftController.grip.scale.x;
            ref.current.position.y = leftController.grip.position.y+4*currentSize.y/5;
            ref.current.position.z = leftController.grip.position.z-(currentSize.x+currentSize.y)/2.;
        }

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
            
        if (leftController && inAnimation) {
            if(wristlePanel){
                if(currentSize.x >= finalPanelSize.x && currentSize.y >= finalPanelSize.y){
                    setInAnimation(false);
                    ref.current.scale.x = finalPanelSize.x;
                    ref.current.scale.y = finalPanelSize.y;
                    ref.current.scale.z = finalPanelSize.z;
                }else if(currentSize.x < finalPanelSize.x){
                    let nextSizeX = (currentSize.x+1./animationFrameCount*finalPanelSize.x > finalPanelSize.x ? finalPanelSize.x : currentSize.x+1./animationFrameCount*finalPanelSize.x);
                    ref.current.scale.x = nextSizeX;
                }else if(currentSize.y < finalPanelSize.y){
                    let nextSizeY = (currentSize.y+1./animationFrameCount*finalPanelSize.y > finalPanelSize.y ? finalPanelSize.y : currentSize.y+1./animationFrameCount*finalPanelSize.y);
                    ref.current.scale.y = nextSizeY;
                }
            }else{
                if(currentSize.x <= 0.001 && currentSize.y <= 0.001){
                    setInAnimation(false);
                    ref.current.scale.x = 0;
                    ref.current.scale.y = 0.001;
                    ref.current.scale.z = 0.001;
                }else if(currentSize.y > 0.001){
                    ref.current.scale.y = currentSize.y-1./animationFrameCount*finalPanelSize.y;
                }else if(currentSize.x > 0.001){
                    ref.current.scale.x = currentSize.x-1./animationFrameCount*finalPanelSize.x;
                    ref.current.scale.y = 0.001;
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
                ref={ref}
                follow={true}
                lockX={true}
                lockY={false}
                lockZ={true} // Lock the rotation on the z axis (default=false)
            >
                <DropDown scale={[1, 0.25, 0.1]} color={0xffffff} onChangeValue={onDropDownChange} dropDownValue={csvFiles} position={[0, ref?.current?.scale?.y/8, 0]} fontSize={0.04} />
                
                <QueryBuilder position={[0, -0.01, -ref?.current?.scale?.y/2]} scale={[1, 1, 0.1]} />

                <Box position={[0.8, 0, -ref?.current?.scale?.y/2]} scale={[0.5, 1, 0.1]} >
                    <UserPreferences/>
                </Box>

            </Billboard>
        </>
    )
}

export default Controllers;