import { useState, useEffect } from 'react'
import { Interactive } from '@react-three/xr'
import Button from './Button'
import Box from './Box'

function DataCol({data, colId, firstcol, rowInterval, onClickCol, position, cellSize, rotation, selected}){
    const [hover, setHover] = useState(false)
    const [select, setSelect] = useState(selected)
    const [color, setColor] = useState(0xffffff)

    useEffect(() => {
      if (select)
        setColor(0xffa36e);
      else
        setColor(0xffffff);
    }, []);

    useEffect(() => {
      if (select)
        setColor(0xffa36e);
      else
        setColor(0xffffff);
    }, [select]);
  
    const onHover = () => {
      setHover(true);
    }
  
    const onBlur = () => {
      setHover(false);
    }
    
    const generateCells = () => {
      const row = [];
      let fontSize = 0.1;
      let maxCells = rowInterval[1];
      for (let i=0; i < maxCells; i++){
        var longest = data.reduce(
          function (a, b) {
              return a.length > b.length ? a : b;
          }
        );
        let size = [((cellSize[0]<longest.length*fontSize/2) ? longest.length*fontSize/2 : cellSize[0]), cellSize[1], 0.1];
        let position = [0, cellSize[1]*(maxCells/2-i), 0.1];
        let text = data[rowInterval[0] + i];
        let colorBtn=color;
        let fontColor=0x000000
        if(firstcol){
          text = (rowInterval[0]+i)+'';
          colorBtn=0x000000;
          fontColor=0xffffff;
        } else if (i==0) {
          if (firstcol)
            text = '';
          colorBtn=0x000000;
          fontColor=0xffffff;
        }

        if(i >= data.length && !firstcol)
          text = '';
        
        row.push(<Button key={i+''+maxCells} position={position} fontSize={fontSize} fontColor={fontColor} color={colorBtn} size={size}>{text}</Button>);
      }

      return row;
    }
  
    return (
        <Box scale={hover ? [1.01, 1.01, 1.01] : [1, 1, 1]} position={position} rotation={rotation} size={[0,0,0]}>
          <Interactive onSelect={function() { onClickCol(colId); setSelect(!select); }} onHover={onHover} onBlur={onBlur}>
            {generateCells()}
          </Interactive>
        </Box>
    )
  }

  function SpreadSheet({data, position, colInterval, rowInterval, gridSize, cellSize, anglemax, onClickCol}){

    function range([start, end]) {
      return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }
  
    const generateGrid = () => {
      const rows = [];
      const startY = position[1]+gridSize[1]/2*cellSize[1];
  
      let first_col_size = 0.2;
      let maxRows = gridSize[0];
      let pi_coeff = Math.PI/maxRows;
      let circle_ray = 6;
      
      //let rotation = [0,-Math.PI/2*Math.cos(-1*maxRows*pi_coeff),0];
      //let pos = [position[0]+circle_ray*Math.cos(-1*maxRows*pi_coeff), position[2]+startY, circle_ray*Math.sin(-1*maxRows*pi_coeff)];
      let size = [first_col_size, cellSize[1], 0.01];
      let data_col = range(rowInterval);
      let rotation = [0, 0, 0];
      let pos = [position[0]+cellSize[0]*(-maxRows/2+1)-first_col_size, position[1], position[2]];
      rows.push(
        <DataCol 
          colId={0} 
          data={data_col} 
          firstcol={true} 
          rowInterval={rowInterval} 
          position={pos} 
          rotation={rotation} 
          colSize={gridSize[1]} 
          cellSize={size} 
          selected={false} 
        />
      );
      size = [cellSize[0], cellSize[1], 0.01];
      for (let i=1; i < maxRows; i++){
        //rotation = [0,-Math.PI/2*Math.cos(-1*(maxRows-i)*pi_coeff),0];
        //pos = [position[0]+circle_ray*Math.cos(-1*(maxRows-i)*pi_coeff), position[2]+startY, circle_ray*Math.sin(-1*(maxRows-i)*pi_coeff)];
        pos = [position[0]+cellSize[0]*(i-maxRows/2+1/2), position[1], position[2]];
        data_col=[i];
        if(i+colInterval[0]-1 < data[1].length)
          data_col=data[1][colInterval[0]+i-1];
        rows.push(
          <DataCol 
            onClickCol={function() {onClickCol(i+colInterval[0]-1);}} 
            selected={data[0][i+colInterval[0]-1]} 
            colId={i} 
            data={data_col} 
            firstcol={false} 
            rowInterval={rowInterval} 
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