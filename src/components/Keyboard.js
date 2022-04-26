import { useMemo, useState } from 'react';
import { Interactive } from '@react-three/xr';
import { MeshBasicMaterial, FrontSide, PlaneBufferGeometry, CanvasTexture, LinearFilter, RepeatWrapping } from 'three';

const colorHovered = '#B0E2FF';
const colorLight = '#ffffff';
const fontColor = '#000000'

function Key({letter, position}){

    const [hovered, setHovered] = useState(false);

    function hoverCol(){
      setHovered(true);
    }
  
    function blurCol(){
      setHovered(false);
    }

    function selectLetter(){
      console.log("test");
    }

    const normalMaterial = useMemo(() => {
        var fontSize = 100;
        var borderThickness =  2;
  
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        canvas.width = 70;
        canvas.height = 82;
        
        context.textBaseline = 'top';
        context.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif`;
  
        context.lineWidth = borderThickness;
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = colorLight;
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = fontColor;
        context.fillText(letter, 0, 0, canvas.width);

        var texture = new CanvasTexture(canvas);
        texture.minFilter = LinearFilter;
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;

        const labelMaterial = new MeshBasicMaterial({
            map: texture,
            side: FrontSide,
            transparent: false,
          });
  
        return labelMaterial;
  
      }, [letter]);


      const hoveredMaterial = useMemo(() => {
        var fontSize = 100;
        var borderThickness =  2;
  
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        
        canvas.width = 70;
        canvas.height = 82;
        context.textBaseline = 'top';
        context.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif`;
  
        context.lineWidth = borderThickness;
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = colorHovered;
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = fontColor;
        context.fillText(letter, 0, 0, canvas.width);
  
        var texture = new CanvasTexture(canvas);

        texture.minFilter = LinearFilter;
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        const labelMaterial = new MeshBasicMaterial({
            map: texture,
            side: FrontSide,
            transparent: false,
        });
  
        return labelMaterial;
  
      }, [letter]);
  
      const backgroundGeometry = new PlaneBufferGeometry(1, 1);
    
      return (
        <Interactive onSelectStart={selectLetter} onHover={hoverCol} onBlur={blurCol} >
          <mesh scale={[0.1,0.2,0.1]} position={position} geometry={backgroundGeometry} material={hovered ? hoveredMaterial : normalMaterial} />
        </Interactive>
      )
}

function Keyboard({position})
{
    const generateKeyboard = () => {


        const keys = [];
        const letters = ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P", "Q", "S", "D", "F", "G", "H", "J", "K", "L", "M", "W", "X", "C", "V", "B","N", "-", "_"]
        let y = position[1];
        let x = -0.45;

        for (let i=0; i < letters.length; i++){
            keys.push(
                <Key
                key={"key"+i}
                letter={letters[i]}
                position={[x,y,0.8]}
                />
            );
            x += 0.11;

            if(((i+1)%10==0) && (i!=0))
            {
              y -= 0.25;
              x = -0.45;
            }
        }
        return keys;
    }

    return (
        <>
          {generateKeyboard()}
        </>
    )  
}

export default Keyboard;