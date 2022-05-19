/**
 * @module SpreadSheet
 */
import { useMemo, useState, useEffect } from 'react';
import { MeshBasicMaterial, DoubleSide, PlaneBufferGeometry, CanvasTexture, LinearFilter, RepeatWrapping } from 'three';
import { Interactive } from '@react-three/xr';
import { useRContext } from '../RContextProvider';
import { normal_light, normal_darker, normalMaterial, hoveredMaterial, hoveredFirstMaterial, selectedMaterial } from '../helpers/colors';

const backgroundGeometry = new PlaneBufferGeometry(1, 1);

/**
 * Interaction des cellules
 * @param {} colId - Id colonne
 * @param {} cellId - Id Cellule
 * @param {} position - Position
 * @param {} rotation - Rotation
 * @param {} scale - Echelle
 * @returns {} - Cellule interactive
 */
function InteractiveCell({colId, cellId, position, rotation, scale}){
  const { csv, rowInterval, colInterval, selectedCols, setSelectedCols, selectedCells, setSelectedCells, cellSelectionMode, colSelectionMode } = useRContext();
  const [selected, setSelected] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() =>{
    let colIdx = colId+colInterval[0];
    let cellIdx = cellId+rowInterval[0];
    let elementToFind = [colIdx, cellIdx];
    let selectedCell = (selectedCells.findIndex(element => element[0] == elementToFind[0] && element[1] == elementToFind[1])>=0 ? true : false);
    let selectedCol = (selectedCols.findIndex(element => element == colIdx)>=0 ? true : false);
    setSelected(selectedCell || selectedCol);
  }, [selectedCols, selectedCells, colInterval, rowInterval]);

  function select() {
    let colIdx = colId+colInterval[0];
    let cellIdx = cellId+rowInterval[0];

    if(cellId==0){
      let newSelectedCols = selectedCols.slice();
      let idx = selectedCols.findIndex(element => element == colIdx);
      if(idx!=-1){
        newSelectedCols.splice(idx, 1);
      } else if(colIdx<csv.length){
        newSelectedCols.push(colIdx);
      }
      setSelectedCols(newSelectedCols);
    }else{
      let newSelectedCells = selectedCells.slice();
      let elementToFind = [colIdx, cellIdx];
      let idx = selectedCells.findIndex(element => element[0] == elementToFind[0] && element[1] == elementToFind[1]);
      if(idx!=-1){
        newSelectedCells.splice(idx, 1);
      } else if(colIdx<csv.length && cellIdx<csv[colIdx].length){
        newSelectedCells.push(elementToFind);
      }
      setSelectedCells(newSelectedCells);
    }
  }

  function hoverCell() {
    setHovered(true);
  }

  function blurCell() {
    setHovered(false);
  }

  return (
    <>
      {(cellSelectionMode==colId && cellId!=0) || (colSelectionMode && cellId==0)? 
        <Interactive onSelectStart={select} onHover={hoverCell} onBlur={blurCell} >
          {(!selected && !hovered) || cellId==0 ?
            <mesh rotation={rotation} scale={scale} position={position} geometry={backgroundGeometry} material={normalMaterial} />
          :
            null
          }

          {selected && cellId!=0 ? 
            <mesh rotation={rotation} scale={scale} position={position} geometry={backgroundGeometry} material={selectedMaterial} />
          :
            null
          }

          {hovered ?
            cellId==0 ?
              <mesh rotation={rotation} scale={scale} position={position} geometry={backgroundGeometry} material={hoveredFirstMaterial} />
            :
              <mesh rotation={rotation} scale={scale} position={position} geometry={backgroundGeometry} material={hoveredMaterial} />
          :
            null
          }
        </Interactive>
        :
          selected && cellId!=0 ? 
            <mesh rotation={rotation} scale={scale} position={position} geometry={backgroundGeometry} material={selectedMaterial} />
          :
            null
      }
    </>
  )
}

/**
 * Interaction des données
 * @param {} colId - Id colonne
 * @param {} position - Position
 * @param {} rotation - Rotation
 * @param {} scale - Echelle
 * @returns {} - Récupérer les valeurs des cellules
 */
function DataCol({colId, position, positionInteractiveCell, rotation, scale, scaleInteractiveCell}){
  const { csv, sessionCodeId, gridSize, colInterval, rowInterval } = useRContext();
  const fontSize = 45;

  const canvas = useMemo(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = scale[0]*100;
    canvas.height =  gridSize[1]*fontSize;
    context.textBaseline = 'top';
    context.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif`;

    return canvas;
  }, [scale, gridSize]);

  const data = useMemo(() => {
    return csv[colInterval[0]+colId];
  }, [csv, sessionCodeId, colInterval, colId]);

  const dataMaterial = useMemo(() => {
    const context = canvas.getContext('2d');
    
    const colSize = gridSize[1];
    const maxChar = canvas.width/fontSize;

    context.lineWidth = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i=0; i < colSize; i++){
      let rowIdx = rowInterval[0] + i;
      let backgroundColor=normal_light;
      let fontColor='#000000';
      if(i==0){
        backgroundColor='#080505';
        fontColor='#ffffff';
      }else if (i%2!=0){
        backgroundColor = normal_darker;
      }
      context.fillStyle = backgroundColor;
      context.fillRect(0, i*fontSize, canvas.width, fontSize);
      
      let text = '';
      if(data && i < data.length) {
        text = ((i==0) ? data[0] : data[rowIdx])+'';
      }
      text = text.substring(0, maxChar) + (text.length > maxChar ? "..." : "");
      context.fillStyle = fontColor;
      context.fillText(text, 0, i*fontSize, canvas.width);
    }

    const texture = new CanvasTexture(canvas);
    // because our canvas is likely not a power of 2
    // in both dimensions set the filtering appropriately.
    texture.minFilter = LinearFilter;
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    const material = new MeshBasicMaterial({
        map: texture,
        side: DoubleSide,
        transparent: false,
      });

    return material;

  }, [data, rowInterval, canvas]);

  const generateInteractiveCol = () => {
    const cells = [];

    let maxRows = gridSize[1];
    let cellScale = [scaleInteractiveCell[0], scaleInteractiveCell[1]/maxRows, scaleInteractiveCell[2]];
    let pos = [positionInteractiveCell[0], positionInteractiveCell[1]+cellScale[1]*maxRows/2-cellScale[1]/2, positionInteractiveCell[2]];
    for (let i=0; i < maxRows; i++){
      cells.push(
        <InteractiveCell
          key={'IntCell'+colId+i}
          position={pos} 
          rotation={rotation}
          scale={cellScale}
          cellId={i}
          colId={colId}
        />
      );
      pos=[pos[0], pos[1]-cellScale[1], pos[2]];
    }
    return cells;
  }

  return (
    <>
      <mesh rotation={rotation} scale={scale} position={position} geometry={backgroundGeometry} material={dataMaterial} />
      {generateInteractiveCol()}
    </>
  )
}

/**
 * Tableau 3D qui affichent une partie des données du CSV issu du serveur
 * @param {} position - Position
 * @returns {} - Afficher un tableau de données en 180° et 360°
 */
function SpreadSheet({ position }){
  const { csv, gridSize, displayAngles } = useRContext();
  
  const generateGrid = () => {
    const cols = [];

    let disAnge = parseInt(displayAngles[0]);
    let maxCols = gridSize[0];
    let filledCols = csv.length;
    let pi_coeff = (disAnge*(Math.PI/180.))/maxCols;
    let circle_ray = 30;
    let circle_ray_ic = 29.5;
    let size, pos, rotation;
    let size_i, pos_i, rotation_i;

    let posX0 = (circle_ray*Math.cos(-1*(maxCols-1)*pi_coeff));
    let posZ0 = (circle_ray*Math.sin(-1*(maxCols-1)*pi_coeff));

    let posX1 = (circle_ray*Math.cos(-1*(maxCols)*pi_coeff));
    let posZ1 = (circle_ray*Math.sin(-1*(maxCols)*pi_coeff));

    size=[Math.sqrt(((posX1-posX0)**2)+((posZ1-posZ0)**2)), gridSize[1]*1.5, 1];

    let posX0_i = (circle_ray_ic*Math.cos(-1*(maxCols-1)*pi_coeff));
    let posZ0_i = (circle_ray_ic*Math.sin(-1*(maxCols-1)*pi_coeff));

    let posX1_i = (circle_ray_ic*Math.cos(-1*(maxCols)*pi_coeff));
    let posZ1_i = (circle_ray_ic*Math.sin(-1*(maxCols)*pi_coeff));

    size_i=[Math.sqrt(((posX1_i-posX0_i)**2)+((posZ1_i-posZ0_i)**2)), gridSize[1]*1.5, 1];

    for (let i=0; i < maxCols; i++){
      posX1 = (circle_ray*Math.cos(-1*(maxCols-i)*pi_coeff));
      posZ1 = (circle_ray*Math.sin(-1*(maxCols-i)*pi_coeff));
      
      posX1_i = (circle_ray_ic*Math.cos(-1*(maxCols-i)*pi_coeff));
      posZ1_i = (circle_ray_ic*Math.sin(-1*(maxCols-i)*pi_coeff));

      rotation = [0, -(pi_coeff*i) + (disAnge==360 ? -Math.PI/2 : +Math.PI/2), 0];

      pos = [posX1, position[1], posZ1];

      pos_i = [posX1_i, position[1], posZ1_i];

      posX0 = posX1;
      posZ0 = posZ1;
      
      posX0_i = posX1_i;
      posZ0_i = posZ1_i;

      let colid = (filledCols < maxCols ? 0-Math.round((maxCols-filledCols)/2)+i : i);

      cols.push(
        <DataCol
          key={'Col'+i}
          position={pos} 
          positionInteractiveCell={pos_i}
          rotation={rotation}
          scale={size}
          scaleInteractiveCell={size_i}
          colId={colid} 
        />
      );
    }
    return cols;
  }

  return (
      <>
        {generateGrid()}
      </>
  )
}

export default SpreadSheet;