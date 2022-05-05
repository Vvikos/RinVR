import { useState, useEffect } from 'react';
import { Interactive } from '@react-three/xr';
import Button from './Button';

function DropDown({ scale, position, dropDownValue, onChangeValue, fontSize, backgroundColor}) {
  const [visible, setVisible] = useState(false);
  const [currentHovered, setCurrentHovered] = useState('');
  
  const MAX_CHAR = 100;
  const hoveredColor = 0xB0E2FF;
  const currentColor = 0xcc5500;

  const generateComboBox = () => {
    const row = [];
    let pos = [0, 0, 0];
    for (let i=0; i < dropDownValue.length; i++){
      pos=[0, -(i+1)*scale[1], 0];
      const text = dropDownValue[i].substring(0, MAX_CHAR) + (dropDownValue[i].length > MAX_CHAR ? "..." : "");
      row.push(
        <Interactive 
          key={'int'+i} 
          onSelect={function(){ setVisible(false);onChangeValue(dropDownValue[i]); }}
          onHover={function(){ setCurrentHovered(dropDownValue[i]); }}
          onBlur={function(){ setCurrentHovered(''); }}
        >
          <Button 
            key={i} 
            color={(i==0 ? currentColor : (currentHovered==dropDownValue[i] ? hoveredColor : backgroundColor))} 
            fontColor={0x000000} 
            fontSize={fontSize} 
            scale={scale}
            position={pos} 
          >
            {text}
          </Button>
        </Interactive>
      );
    }
    return row;
  }
  
  return (
    <group scale={scale} position={position} >
      <Interactive 
        onSelect={function(){setVisible(prevstate => (!prevstate));}} 
        onHover={function(){ setCurrentHovered(dropDownValue[0]); }}
        onBlur={function(){ setCurrentHovered(''); }}
      >
        <Button fontSize={fontSize} position={[0,0,0]} color={(currentHovered==dropDownValue[0] ? hoveredColor: backgroundColor)} fontColor={0x000000} scale={scale}>
          {dropDownValue[0]}
        </Button>
      </Interactive>
      {visible && generateComboBox()}
    </group>
  )
}

export default DropDown;