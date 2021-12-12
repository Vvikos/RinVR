import { useState, useEffect } from 'react'
import { Interactive } from '@react-three/xr'
import Button from './Button'
import Box from './Box'

function DataCol({data, colId, colSize, firstcol, rowInterval, onClickCol, position, cellSize, rotation, selected}){
    const [hover, setHover] = useState(false)
    const [color, setColor] = useState(0xffffff)

    useEffect(() => {
      if (selected)
        setColor(0xffa36e);
      else
        setColor(0xffffff);
    }, []);

    useEffect(() => {
      if (selected)
        setColor(0xffa36e);
      else
        setColor(0xffffff);
    }, [selected]);
  
    const onHover = () => {
      setHover(true);
    }
  
    const onBlur = () => {
      setHover(false);
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
        let size = [((cellSize[0]<longest.length*fontSize/2) ? longest.length*fontSize/2 : cellSize[0]), cellSize[1], 0.02];
        let position = [0, cellSize[1]*(colSize/2-i), 0.1];
        let text = '';
        let colorBtn=color;
        let fontColor=0x000000;
        if(firstcol || i==0){
          colorBtn=0x000000;
          fontColor=0xffffff;
        }
        
        if(firstcol){
          text = ((i==0) ? '' : rowIdx+'');
        } else if(i < data.length) {
          text = ((i==0) ? data[0] : data[rowIdx]+'');
        }
        
        row.push(<Button key={i+'x'+colSize} position={position} fontSize={fontSize} fontColor={fontColor} color={colorBtn} size={size}>{text}</Button>);
      }

      return row;
    }
  
    return (
        <Box scale={hover ? [1.01, 1.01, 1.01] : [1, 1, 1]} position={position} rotation={rotation} size={[0,0,0]}>
          <Interactive onSelect={function() { onClickCol(colId); }} onHover={onHover} onBlur={onBlur}>
            {generateCells()}
          </Interactive>
        </Box>
    )
  }

  function SpreadSheet({data, selectedCols, position, colInterval, rowInterval, gridSize, cellSize, anglemax, onClickCol}){

    function range([start, end]) {
      return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }
  
    const generateGrid = () => {
      const rows = [];
      const startY = position[1]+gridSize[1]/2*cellSize[1];
  
      let firstColSize = 0.2;
      let maxRows = gridSize[0];
      // Circle geometry TODO
      //let pi_coeff = Math.PI/maxRows;
      //let circle_ray = 6;
      //let rotation = [0,-Math.PI/2*Math.cos(-1*maxRows*pi_coeff),0];
      //let pos = [position[0]+circle_ray*Math.cos(-1*maxRows*pi_coeff), position[2]+startY, circle_ray*Math.sin(-1*maxRows*pi_coeff)];
      let size = [firstColSize, cellSize[1], 0.01];
      let data_col = range(rowInterval);
      let rotation = [0, 0, 0];
      let pos = [position[0]+cellSize[0]*(-maxRows/2+1)-firstColSize, position[1], position[2]];
      rows.push(
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
      );
      size = [cellSize[0], cellSize[1], 0.01];
      for (let i=0; i < maxRows; i++){
        let colId = i+1, colIdx = i+colInterval[0];
        //rotation = [0,-Math.PI/2*Math.cos(-1*(maxRows-i)*pi_coeff),0];
        //pos = [position[0]+circle_ray*Math.cos(-1*(maxRows-i)*pi_coeff), position[2]+startY, circle_ray*Math.sin(-1*(maxRows-i)*pi_coeff)];
        pos = [position[0]+cellSize[0]*(colId-maxRows/2+1/2), position[1], position[2]];
        data_col=[i];
        if(colIdx < data.length){
          data_col=data[colIdx];
        }
        rows.push(
          <DataCol
            key={'Col'+colId}
            onClickCol={function() {onClickCol(colIdx);}} 
            selected={selectedCols[colIdx]} 
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
      console.log(data);
      return rows;
    }
  
    return (
        <>
          {generateGrid()}
        </>
    )
  }

export default SpreadSheet;