import { useMemo, useState, useEffect } from 'react';
import { Interactive } from '@react-three/xr';
import { MeshBasicMaterial, FrontSide, PlaneBufferGeometry, CanvasTexture, LinearFilter, RepeatWrapping } from 'three';
import { useRContext } from '../RContextProvider';
import Box from './Box'
import { DoubleSide } from 'three';

const selected_light = '#ffa36e';
const selected_darker = '#ff7221';
const normal_light = '#ffffff';
const normal_darker = '#dedcdc';
const normal_hovered = '#B0E2FF';
const first_dark = '#000000';

const MAX_CHAR = 35;

function DataCol({colId, firstcol, position, rotation, scale}){
    const { csv, gridSize, rowInterval, colInterval, selectedCols, setSelectedCols } = useRContext();
    const [selected, setSelected] = useState(false);
    const [hovered, setHovered] = useState(false);

    useEffect(() =>{
      let colIdx = colId+colInterval[0];
      let selected = (selectedCols.find(element => element == colIdx)>=0 ? true : false);
      setSelected(selected);
    }, [selectedCols, colInterval]);

    function selectCol() {
      let newSelectedCols = selectedCols.slice();
      let colIdx = colId+colInterval[0];
      let idx = selectedCols.findIndex(element => element == colIdx);
      if(idx!=-1){
        newSelectedCols.splice(idx, 1);
      } else {
        newSelectedCols.push(colIdx);
      }
      setSelectedCols(newSelectedCols);
    }

    function hoverCol() {
      setHovered(true);
    }

    function blurCol() {
      setHovered(false);
    }

    const labelMaterial = useMemo(() => {
      var fontSize = 50;
      var borderThickness =  0;

      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      
      var colSize = gridSize[1];
      canvas.width = 750;
      canvas.height = colSize*fontSize;
      context.textBaseline = 'top';
      context.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif`;

      context.lineWidth = borderThickness;
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (let i=0; i < colSize; i++){
        let rowIdx = rowInterval[0] + i;
        let backgroundColor;
        let fontColor='#000000';
        if(firstcol || i==0){
          backgroundColor=first_dark;
          fontColor='#ffffff';
        }else{
          let normal = (selected ? selected_light : (hovered ? normal_hovered : normal_light));
          let darker = (selected ? selected_darker : (hovered ? normal_hovered : normal_darker));
          backgroundColor = (i%2==0 ? darker : normal);
        }
        context.fillStyle = backgroundColor;
        context.fillRect(0, i*fontSize, canvas.width, fontSize);
        
        let data = csv[colInterval[0]+colId];
        let text = '';
        if(firstcol){
          text = ((i==0) ? '' : rowIdx)+'';
        } else if(data && i < data.length) {
          text = ((i==0) ? data[0] : data[rowIdx])+'';
        }
        text = text.substring(0, MAX_CHAR) + (text.length > MAX_CHAR ? "..." : "");
        context.fillStyle = fontColor;
        context.fillText(text, 0, i*fontSize, canvas.width);
      }

      var texture = new CanvasTexture(canvas);
      // because our canvas is likely not a power of 2
      // in both dimensions set the filtering appropriately.
      texture.minFilter = LinearFilter;
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping;
      const labelMaterial = new MeshBasicMaterial({
          map: texture,
          side: DoubleSide,
          transparent: false,
        });

      return labelMaterial;

    }, [csv, selected, hovered, rowInterval, colInterval, colId]);

    const backgroundGeometry = new PlaneBufferGeometry(1, 1);
  
    return (
      <Interactive onSelectStart={selectCol} onHover={hoverCol} onBlur={blurCol} >
        <mesh rotation={rotation} scale={scale} position={position} geometry={backgroundGeometry} material={labelMaterial} />
      </Interactive>
    )
  }

  function SpreadSheet({ position }){
    const { gridSize, displayAngle } = useRContext();
    
    const generateGrid = () => {
      const rows = [];

      let maxRows = gridSize[0];
      let pi_coeff = (displayAngle*(Math.PI/180.))/maxRows;
      let circle_ray = 30;
      let size, pos, rotation;
      
      let posX0 = (circle_ray*Math.cos(-1*(maxRows-1)*pi_coeff));
      let posZ0 = (circle_ray*Math.sin(-1*(maxRows-1)*pi_coeff));

      let posX1 = (circle_ray*Math.cos(-1*(maxRows)*pi_coeff));
      let posZ1 = (circle_ray*Math.sin(-1*(maxRows)*pi_coeff));

      size=[ Math.sqrt(((posX1-posX0)**2)+((posZ1-posZ0)**2)), maxRows, 1 ];

      for (let i=0; i < maxRows; i++){
        posX1 = (circle_ray*Math.cos(-1*(maxRows-i)*pi_coeff));
        posZ1 = (circle_ray*Math.sin(-1*(maxRows-i)*pi_coeff));
        
        rotation = [0, -(pi_coeff*i) + (Math.PI/2), 0];

        pos = [posX1, position[1], posZ1];

        posX0 = posX1;
        posZ0 = posZ1;

        rows.push(
          <DataCol
            key={'Col'+i}
            position={pos} 
            rotation={rotation}
            scale={size}
            colId={i} 
            firstcol={false}  
          />
        );
      }
      return rows;
    }
  
 /*
    const generateGrid = () => {
      const rows = [];
      const radius = 3;
      let i = 0;
      let maxRows = gridSize[0];
      console.log((Math.PI*4)/maxRows);
      for(let radian = 0.0; radian<Math.PI*4; radian+=((Math.PI*2)/maxRows*2))
      {
        let x = radius*Math.cos(radian);
        let y = 0;
        let z = radius*Math.sin(radian);

        rows.push(
          <DataCol
            key={'Col'+i}
            position={[x,y,z]} 
            scale={[1,1,1]}
            colId={i} 
            firstcol={false}  
          />
        );

        i++;
        console.log(i);
      }
      return rows;

    };
    */
    return (
        <>
          {generateGrid()}
        </>
    )
  }

export default SpreadSheet;