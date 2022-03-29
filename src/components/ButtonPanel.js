import { useState, useEffect } from 'react'
import { Interactive } from '@react-three/xr'
import DropDown from './DropDown'
import Button from './Button'
import Box from './Box'

function ButtonPanel({ position, rotation, onDropDownChangeValue, dropDownValue, onClickRefresh, onClickColPrev, onClickColNext, onClickRowPrev, onClickRowNext }) {
    const [hover, setHover] = useState(false)
    const [select, setSelect] = useState(false)
    const [color, setColor] = useState(0x3b3a39)
  
    const onSelect = () => {
      if (select)
        setColor(0x3b3a39);
      else
        setColor(0x3b3a39);
      setSelect(!select);
    }
  
    const onHover = () => {
      setHover(true);
    }
  
    const onBlur = () => {
      setHover(false);
    }
    
    return (
      <Box color={color} scale={[1, 1, 0.001]} position={position} rotation={rotation}>
        <DropDown color={0xffffff} onChangeValue={onDropDownChangeValue} dropDownValue={dropDownValue} position={[-0.25, 0.35, 0.6]}/>
        <Interactive onSelect={function() { onSelect(); onClickRefresh(); }} onHover={onHover} onBlur={onBlur}>
          <Button color={0x16a5f2} fontColor={0xffffff} fontSize={0.03} scale={[0.2, 0.12, 0.02]} position={[0.3, 0, 0.6]}>Refresh</Button>
        </Interactive>
        
        <Interactive onSelect={function() { onSelect(); onClickRowNext(); }} onHover={onHover} onBlur={onBlur}>
          <Button color={0xfc2617} fontColor={0xffffff} fontSize={0.03} scale={[0.15, 0.1, 0.02]} position={[0, -0.15, 0.6]}>Up</Button>
        </Interactive>
        <Interactive onSelect={function() { onSelect(); onClickRowPrev(); }} onHover={onHover} onBlur={onBlur}>
          <Button color={0xfc2617} fontColor={0xffffff} fontSize={0.03} scale={[0.15, 0.1, 0.02]} position={[0, 0.15, 0.6]}>Down</Button>
        </Interactive>
        
        <Interactive onSelect={function() { onSelect(); onClickColNext(); }} onHover={onHover} onBlur={onBlur}>
          <Button color={0xfc2617} fontColor={0xffffff} fontSize={0.03} scale={[0.15, 0.1, 0.02]} position={[0.15, 0, 0.6]}>Right</Button>
        </Interactive>
        <Interactive onSelect={function() { onSelect(); onClickColPrev(); }} onHover={onHover} onBlur={onBlur}>
          <Button color={0xfc2617} fontColor={0xffffff} fontSize={0.03} scale={[0.15, 0.1, 0.02]} position={[-0.15, 0, 0.6]}>Left</Button>
        </Interactive>
      </Box>
    )
  }

export default ButtonPanel;