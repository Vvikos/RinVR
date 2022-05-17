import { useMemo, useState } from 'react';
import { Interactive } from '@react-three/xr';
import { MeshBasicMaterial, FrontSide, PlaneBufferGeometry, CanvasTexture, LinearFilter, RepeatWrapping } from 'three';

import { useRContext } from '../RContextProvider';
import Button from './Button';
import DropDown from './DropDown';
import { darker_panel, blue_button } from '../helpers/colors';

function InsertText({position, backgroundColor, textColor, fontSize, text, width, meshScale})
{
    const normalMaterial = useMemo(() => {
        var borderThickness =  2;
  
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = fontSize;
        
        context.textBaseline = 'top';
        context.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif`;
  
        context.lineWidth = borderThickness;
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = textColor;
        context.fillText(text, 0, 0, canvas.width);

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
  
      }, [text]);
     
      const backgroundGeometry = new PlaneBufferGeometry(1, 1);

      return (
          <mesh scale={meshScale} position={position} geometry={backgroundGeometry} material={normalMaterial} />
      )
}

function ChangeGrid({position})
{
    const { gridSize, incrementColGrid, incrementRowGrid, decrementColGrid, decrementRowGrid, displayAngles, setDisplayAngles } = useRContext();
    
    const backgroundColor = darker_panel;
    const textColor = "#cc5500";

    return (
        <>
            /***************** GRID PART ****************/

            <InsertText position={[0,0,1]} backgroundColor={blue_button} textColor={"white"} fontSize={100} text={"Modifier la grille"} width={150} height={100} meshScale={[0.6,0.10,0.15]}/>

            <InsertText position={[-0.30,-0.15,1]} backgroundColor={blue_button} textColor={"white"} fontSize={100} text={"Lignes"} width={150} height={100} meshScale={[0.15,0.07,0.15]}/>
            <Interactive onSelectStart={decrementRowGrid}>
                <Button color={blue_button} fontColor={"white"} fontSize={.08} scale={[0.1,0.1, 0.001]} position={[-0.1,-0.15,1]} rotation={[0,0,0]} >-</Button>
            </Interactive>
            <InsertText position={[0.1,-0.15,1]} backgroundColor={blue_button} textColor={"white"} fontSize={100} text={gridSize[1]} width={150} height={100} meshScale={[0.15,0.07,0.15]}/>
            <Interactive onSelectStart={incrementRowGrid}>
                <Button color={blue_button} fontColor={"white"} fontSize={.08} scale={[0.1,0.1, 0.001]} position={[0.3,-0.15,1]} rotation={[0,0,0]}>+</Button>
            </Interactive>

            <InsertText position={[-0.30,-0.30,1]} backgroundColor={blue_button} textColor={"white"} fontSize={100} text={"Colonnes"} width={150} height={100} meshScale={[0.15,0.07,0.15]}/>
            <Interactive onSelectStart={decrementColGrid}>
                <Button color={blue_button} fontColor={"white"} fontSize={.08} scale={[0.1,0.1, 0.001]} position={[-0.1,-0.30,1]} rotation={[0,0,0]} >-</Button>
            </Interactive>
            <InsertText position={[0.1,-0.3,1]} backgroundColor={blue_button} textColor={"white"} fontSize={100} text={gridSize[0]} width={150} height={100} meshScale={[0.15,0.07,0.15]}/>
            <Interactive onSelectStart={incrementColGrid}>
                <Button color={blue_button} fontColor={"white"} fontSize={.08} scale={[0.1,0.1, 0.001]} position={[0.3,-0.30,1]} rotation={[0,0,0]}>+</Button>
            </Interactive>

            /***************** 360/180 PART ****************/

            <InsertText position={[0,-0.5, 1]} backgroundColor={blue_button} textColor={"white"} fontSize={100} text={"Modifier l'angle d'affichage"} width={150} height={100} meshScale={[0.8,0.1,0.15]}/>
            <DropDown position={[0, -0.62, 1]} backgroundColor={blue_button} scale={[0.9, 0.1, 0.1]} color={blue_button} onChangeValue={setDisplayAngles} dropDownValue={displayAngles}  fontSize={0.04}/>

        </>
    );
}

function UserPreferences({position})
{
    return (
        <>
          <ChangeGrid position={[1,1,4]}/>
        </>
    )  
}

export default UserPreferences;