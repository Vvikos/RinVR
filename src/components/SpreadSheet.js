import { useState, useEffect } from 'react'
import { useRContext } from '../RContextProvider'
import { Interactive } from '@react-three/xr'
import Button from './Button'

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
      let fontSize = 0.1;
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
        let colorBtn;
        let fontColor=0x000000;
        if(firstcol || i==0){
          colorBtn=0x000000;
          fontColor=0xffffff;
        }else{
          let normal = (selected ? 0xffa36e : 0xffffff);
          let oposite = (selected ? 0xff7221 : 0xdedcdc);
          colorBtn = (i%2==0 ? oposite : normal);
        }
        
        let text = '';
        if(firstcol){
          text = ((i==0) ? '' : rowIdx+'');
        } else if(i < data.length) {
          text = ((i==0) ? data[0] : data[rowIdx]+'');
        }
        
        row.push(<Button key={i+'x'+colSize} position={position} fontSize={fontSize} fontColor={fontColor} color={colorBtn} scale={scale}>{text}</Button>);
      }
      return row;
    }
  
    return (
      <Interactive onSelect={function() { clickCol(colId); }}>
        <group scale={[1, 1, 0.001]} position={position} rotation={rotation}>
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
      // Circle geometry TODO
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
      size = [cellSize[0], cellSize[1], 0.01];

      let posX0 = (circle_ray*Math.cos(-1*(maxRows-1)*pi_coeff));
      let posZ0 = (circle_ray*Math.sin(-1*(maxRows-1)*pi_coeff));

      for (let i=0; i < maxRows; i++){
        let colId = i+1, colIdx = i+colInterval[0];
        
        let posX1 = (circle_ray*Math.cos(-1*(maxRows-i)*pi_coeff));
        let posZ1 = (circle_ray*Math.sin(-1*(maxRows-i)*pi_coeff));
        
        size=[ Math.sqrt(((posX1-posX0)**2)+((posZ1-posZ0)**2)), cellSize[1], 0.01 ];
        
        //rotation = [0, -Math.PI/2*Math.cos(-1*(maxRows-i)*pi_coeff), 0];
        rotation = [0, -((Math.PI/(maxRows))*i) + (Math.PI/2), 0];

        //pos = [0+circle_ray*Math.cos(-1*(maxRows-i)*pi_coeff), position[1], circle_ray*Math.sin(-1*(maxRows-i)*pi_coeff)];
        pos = [posX1, position[1], posZ1];
        pos = [pos[0]+2,pos[1]-5,pos[2]-9];

        posX0 = posX1;
        posZ0 = posZ1;


        //pos = [position[0]+cellSize[0]*(colId-maxRows/2+1/2), position[1], position[2]];
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
      console.log('RENDERED GRID');
      return rows;
    }
  
    return (
        <>
          {generateGrid()}
        </>
    )
  }

export default SpreadSheet;