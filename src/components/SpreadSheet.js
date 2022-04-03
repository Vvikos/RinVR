import { useState, useEffect } from 'react';
import { Interactive } from '@react-three/xr';
import { Text } from '@react-three/drei';
import { BufferGeometry, BoxBufferGeometry, BoxGeometry, MeshBasicMaterial, TextGeometry  } from "three";
import { useRContext } from '../RContextProvider';
import TextSprite from './TextSprite';

const cselected_light = new MeshBasicMaterial({color: 0xffa36e});
const cselected_darker = new MeshBasicMaterial({color: 0xff7221});
const cnormal_light = new MeshBasicMaterial({color: 0xffffff});
const cnormal_darker = new MeshBasicMaterial({color: 0xdedcdc});
const cfirst_dark = new MeshBasicMaterial({color: 0x000000});
const MAX_CHAR = 35;

function DataCol({data, colId, colSize, firstcol, rowInterval, position, cellSize, rotation}){
    const { selectedCols, setSelectedCols} = useRContext();
    const [selected, setSelected] = useState(false);

    useEffect(() =>{
      let selected = (selectedCols.find(element => element == colId) ? true : false);
      setSelected(selected);
    }, [selectedCols]);

    function clickCol(colIdx) {
      let newSelectedCols = selectedCols.slice();
      let idx = selectedCols.findIndex(element => element == colIdx);
      if(idx!=-1){
        newSelectedCols.splice(idx, 1);
      } else {
        newSelectedCols.push(colIdx);
      }
      setSelectedCols(newSelectedCols);
    }
  
    const generateCells = () => {
      const row = [];
      let fontSize = 0.22;
      let longest = data.reduce(
        function (a, b) {
            if (a == null && b == null){
              return "default_text";
            } else if (a == null) {
              return b;
            } else if (b == null){
              return a;
            } else {
              return a.length > b.length ? a : b;
            }
        }
      );

      for (let i=0; i < colSize; i++){
        let rowIdx = rowInterval[0] + i;
        let scale = [((cellSize[0]<longest.length*fontSize/2) ? longest.length*fontSize/2 : cellSize[0]), cellSize[1], 0.02];
        let position = [0, cellSize[1]*(colSize/2-i), 0.1];
        let materialColor;
        let fontColor='#000000';
        if(firstcol || i==0){
          materialColor=cfirst_dark;
          fontColor='#ffffff';
        }else{
          let normal = (selected ? cselected_light : cnormal_light);
          let darker = (selected ? cselected_darker : cnormal_darker);
          materialColor = (i%2==0 ? darker : normal);
        }
        
        let text = '';
        if(firstcol){
          text = ((i==0) ? '' : rowIdx)+'';
        } else if(i < data.length) {
          text = ((i==0) ? data[0] : data[rowIdx])+'';
        }
        text = text.substring(0, MAX_CHAR) + (text.length > MAX_CHAR ? "..." : "");
        row.push(
          <TextSprite key={'Col'+i} position={position} scale={scale} color={fontColor} backgroundMaterial={materialColor} >{text}</TextSprite>
        );
      }
      return row;
    }
  
    return (
      <Interactive onSelectStart={function() { clickCol(colId); }}>
        <group position={position} rotation={rotation}>
            {generateCells()}
        </group>
      </Interactive>
    )
  }

  function SpreadSheet({position, cellSize, anglemax }){
    const { csv, rowInterval, colInterval, gridSize } = useRContext();
    
    function range([start, end]) {
      return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }
    const generateGrid = () => {
      const rows = [];
      const startY = position[1]+gridSize[1]/2*cellSize[1];
  
      let firstColSize = 0.2;
      let maxRows = gridSize[0];
      let pi_coeff = Math.PI/maxRows;
      let circle_ray = 16;
      let rotation = [0,-Math.PI/2*Math.cos(-1*maxRows*pi_coeff),0];
      let pos = [position[0]+circle_ray*Math.cos(-1*maxRows*pi_coeff), position[1], circle_ray*Math.sin(-1*maxRows*pi_coeff)];
      let size = [firstColSize, cellSize[1], 0.01];
      let data_col = range(rowInterval);
      //let rotation = [0, 0, 0];
      //let pos = [position[0]+cellSize[0]*(-maxRows/2+1)-firstColSize, position[1], position[2]];
      /*rows.push(
        <DataCol 
          key={'Col0'}
          colId={0} 
          data={data_col} 
          firstcol={true} 
          rowInterval={rowInterval} 
          position={pos} 
          rotation={rotation} 
          colSize={gridSize[1]} 
          cellSize={size} 
          selected={false}
          onClickCol={function() {}}
        />
      );*/
      let posX0 = (circle_ray*Math.cos(-1*(maxRows-1)*pi_coeff));
      let posZ0 = (circle_ray*Math.sin(-1*(maxRows-1)*pi_coeff));

      let posX1 = (circle_ray*Math.cos(-1*(maxRows)*pi_coeff));
      let posZ1 = (circle_ray*Math.sin(-1*(maxRows)*pi_coeff));

      size=[ Math.sqrt(((posX1-posX0)**2)+((posZ1-posZ0)**2)), cellSize[1], 0.01 ];

      for (let i=0; i < maxRows; i++){
        let colId = i+1, colIdx = i+colInterval[0];
        
        posX1 = (circle_ray*Math.cos(-1*(maxRows-i)*pi_coeff));
        posZ1 = (circle_ray*Math.sin(-1*(maxRows-i)*pi_coeff));
        
        rotation = [0, -((Math.PI/(maxRows))*i) + (Math.PI/2), 0];

        pos = [posX1, position[1], posZ1];

        posX0 = posX1;
        posZ0 = posZ1;

        data_col=[i];

        if(colIdx < csv.length){
          data_col=csv[colIdx];
        }
        rows.push(
          <DataCol
            key={'Col'+colId}
            colId={i} 
            data={data_col} 
            firstcol={false} 
            rowInterval={rowInterval} 
            colSize={gridSize[1]}
            position={pos} 
            rotation={rotation} 
            cellSize={size} 
          />
        );
      }
      return rows;
    }
  
    return (
        <>
          {generateGrid()}
        </>
    )
  }

export default SpreadSheet;