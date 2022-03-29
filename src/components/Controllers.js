import { useState, useEffect } from 'react'
import { useController, DefaultXRControllers } from '@react-three/xr'
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";

function Controllers() {
    const leftController = useController('left');
    const [wristlePosition, setWristlePosition] = useState([0, 8, -3]);
    const [buttonXPressed, setButtonXPressed] = useState(false);
    const [buttonXActivated, setButtonXActivated] = useState(true);
    const [inAnimation, setInAnimation] = useState(false);
    const [panelSize, setPanelSize] = useState([0,0,0.001]);

    const finalPanelSize = [0.80, 0.50, 0.001];

    useFrame(() => {
        if (leftController) {
            if (leftController.grip && leftController.grip.position) {
                let position = [leftController.grip.position.x, leftController.grip.position.y+0.55, leftController.grip.position.z];
                setWristlePosition(position);
            }
            if (leftController.inputSource && leftController.inputSource.gamepad && leftController.inputSource.gamepad.buttons && !inAnimation) {
                let XButton = leftController.inputSource.gamepad.buttons[5];
                setButtonXPressed(XButton.pressed);
            }
            if (inAnimation){
                if(buttonXActivated){
                    if(panelSize[0] >= finalPanelSize[0] && panelSize[1] >= finalPanelSize[1]){
                        setInAnimation(false);
                        setPanelSize(finalPanelSize);
                    }else if(panelSize[0] < finalPanelSize[0]){
                        let nextSizeX = (panelSize[0]+1./10.*finalPanelSize[0] > finalPanelSize[0] ? finalPanelSize[0] : panelSize[0]+1./10.*finalPanelSize[0]);
                        setPanelSize([nextSizeX, panelSize[1], panelSize[2]]);
                    }else if(panelSize[1] < finalPanelSize[1]){
                        let nextSizeY = (panelSize[1]+1./10.*finalPanelSize[1] > finalPanelSize[1] ? finalPanelSize[1] : panelSize[1]+1./10.*finalPanelSize[1]);
                        setPanelSize([panelSize[0], nextSizeY, panelSize[2]]);
                    }
                }else{
                    if(panelSize[0] <= 0.001 && panelSize[1] <= 0.001){
                        setInAnimation(false);
                        setPanelSize([0, 0.001, 0.001]);
                    }else if(panelSize[1] > 0.001){
                        setPanelSize([panelSize[0], panelSize[1]-1./10.*finalPanelSize[1], panelSize[2]]);
                    }else if(panelSize[0] > 0.001){
                        setPanelSize([panelSize[0]-1./10.*finalPanelSize[0], 0.001, panelSize[2]]);
                    }
                }
            }
        }
    });

    useEffect(() => {
        // When we release the button
        if(!buttonXPressed){
            setButtonXActivated(!buttonXActivated);
        }
    }, [buttonXPressed]);

    useEffect(() => {
        setInAnimation(true);
    }, [buttonXActivated]);

    return (
        <>
            <DefaultXRControllers />
            <Billboard
                follow={true}
                lockX={false}
                lockY={false}
                lockZ={false} // Lock the rotation on the z axis (default=false)
                position={wristlePosition}
                scale={panelSize}
            >
                <Text anchorX="left" anchorY="top-baseline" fontSize={0.07} position={[0,0.5,0]} color={0x000000}>Control Panel</Text>
            </Billboard>
        </>
    )
}

//<RoundedButton color={wristleColor} fontColor={0xffffff} fontSize={0.015} size={[0.05, 0.05, 0.001]} position={wristlePosition} rotation={wristleRotation}>WRISTLE</RoundedButton>

export default Controllers;