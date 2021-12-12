import { useState, useEffect } from 'react'
import { Interactive } from '@react-three/xr'
import { Text } from '@react-three/drei'
import Button from './Button'
import Box from './Box'

function DropDown({ position, dropDownValue, cellSize, onChangeValue, ...rest}) {
  const [visible, setVisible] = useState(false)
  const [color, setColor] = useState(0xffffff)
  
  const onSelect = () => {
    setVisible(prevstate => (!prevstate));
  }

  const generateComboBox = () => {
    const row = [];
    let pos = [0, 0, 0];
    for (let i=0; i < dropDownValue[1].length; i++){
      pos=[-0.1, -(i+1)*0.1, 0];
      row.push(
        <Interactive onSelect={function() { setVisible(false);onChangeValue(dropDownValue[1][i]); }}>
          <Button 
            key={i} 
            color={0xffffff} 
            fontColor={0x000000} 
            fontSize={0.015} 
            size={[0.2, 0.1, 0.02]} 
            position={pos} 
          >
            {dropDownValue[1][i]}
          </Button>
        </Interactive>
      );
    }
    return row;
  }
  
  return (
    <Box size={[0, 0, 0]} position={position} color={0xffffff} {...rest}>
      <Button fontSize={0.015} position={[-0.1,0,0]} color={0xffffff} fontColor={0x000000} size={[0.2, 0.1, 0.02]}>
        {dropDownValue[0]}
      </Button>
      <Interactive onSelect={function() { onSelect(); }}>
        <Button color={0xffffff} fontColor={0x000000} fontSize={0.015} position={[0.06, 0, 0]} size={[0.15, 0.1, 0.02]}>Choose File</Button>
      </Interactive>
      {visible && generateComboBox()}
    </Box>
  )
}

export default DropDown;