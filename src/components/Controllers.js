import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { useXR, VRCanvas, DefaultXRControllers } from '@react-three/xr'
import { useFrame } from "@react-three/fiber";
import { Interactive } from '@react-three/xr'
import DropDown from './DropDown'
import RoundedButton from './RoundedButton'

function Controllers() {
    const { controllers } = useXR();
    const [wristlePosition, setWristlePosition] = useState([0, 8, -3]);
    const [wristleRotation, setWristleRotation] = useState([0, 0, 0]);
    const [wristleColor, setWristleColor] = useState(0x999999);

    useFrame(() => {
        if (controllers && controllers.length>0 && controllers[0].grip && controllers[0].grip.position) {
            let position = [controllers[0].grip.position.x-0.1, controllers[0].grip.position.y, controllers[0].grip.position.z];
            let rotation = [controllers[0].grip.rotation.x, controllers[0].grip.rotation.y, controllers[0].grip.rotation.z];
            //let rotation = [0,0,0];
            setWristlePosition(position);
            setWristleRotation(rotation);
            console.log(controllers);
        }
    });

    const onWrislteClick = () => {
        let color = 0x999999;
        if(wristleColor==0x999999)
            color=0xe28743
        setWristleColor(color);
    }

    return (
        <>
            <DefaultXRControllers />
            <Interactive onSelect={onWrislteClick} >
                <RoundedButton color={wristleColor} fontColor={0xffffff} fontSize={0.015} size={[0.05, 0.05, 0.001]} position={wristlePosition} rotation={wristleRotation}>WRISTLE</RoundedButton>
            </Interactive>
        </>
    )
}

export default Controllers;