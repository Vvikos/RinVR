
import { useMemo, useState, useEffect } from 'react';
import { MeshBasicMaterial, DoubleSide, PlaneBufferGeometry, CanvasTexture, LinearFilter, RepeatWrapping } from 'three';
import { Interactive } from '@react-three/xr';
import { useRContext } from '../RContextProvider';
import Box from './Box';
import DropDown from './DropDown';
import { normal_light, normal_darker, selected_light, normal_hovered, normalMaterial, hoveredMaterial, selectedMaterial } from '../helpers/colors';

const backgroundGeometry = new PlaneBufferGeometry(1, 1);

function ColumnsField({ position, rotation, scale, onColSelection }) {
    const { selectedCols, setSelectedCols, colSelectionMode, cellSelectionMode, setColSelectionMode } = useRContext();
    const [inSelection, setInSelection] = useState(false);
    const [currentSelection, setCurrentSelection] = useState([]);
    const [hovered, setHovered] = useState(false);

    const fontSize = 45;

    function hoverCell() {
        setHovered(true);
    }

    function blurCell() {
        setHovered(false);
    }

    function changeSelectionMode() {
        if(!inSelection && !colSelectionMode && !cellSelectionMode){
            setInSelection(true);
            setColSelectionMode(true);
        }
        if(inSelection && colSelectionMode){
            setInSelection(false);
            setColSelectionMode(false);
            setCurrentSelection(selectedCols);
            onColSelection(selectedCols);
            setSelectedCols([]);
        }
    }

    const canvas = useMemo(() => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = scale[0]*100;
        canvas.height = fontSize;
        context.textBaseline = 'top';
        context.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif`;
    
        return canvas;
    }, [scale]);
    
    const dataMaterial = useMemo(() => {
        const context = canvas.getContext('2d');
        const maxChar = canvas.width/fontSize;

        context.lineWidth = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);

        const backgroundColor = inSelection ? selected_light : (hovered ? normal_hovered : normal_darker);
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, canvas.width, fontSize);

        let selection = '_';
        /*if(inSelection && selectedCols.length>0){
            selection = '';
            selectedCols.forEach((colid) => { selection += ', '+ csv[colid][0]});
        } else if (currentSelection.length>0){
            selection = '';
            currentSelection.forEach((colid) => { selection += ', '+ csv[colid][0]});
        }*/

        if(inSelection && selectedCols.length>0){
            selection = '';
            selectedCols.forEach((colid) => { selection += colid+', '});
        } else if (currentSelection.length>0){
            selection = '';
            currentSelection.forEach((colid) => { selection += colid+', '});
        }

        let text = selection;
        context.fillStyle = '#000000';
        context.fillText(text, 0, 0, canvas.width);

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

    }, [canvas, hovered, inSelection]);
    
  return (
    <Interactive onSelect={changeSelectionMode} onHover={hoverCell} onBlur={blurCell} >
        <mesh rotation={rotation} scale={scale} position={position} geometry={backgroundGeometry} material={dataMaterial} />
    </Interactive>
  )
}

function ColumnField({ position, rotation, scale, onColSelection }) {
    const { selectedCols, setSelectedCols, colSelectionMode, cellSelectionMode, setColSelectionMode } = useRContext();
    const [inSelection, setInSelection] = useState(false);
    const [currentSelection, setCurrentSelection] = useState([]);
    const [hovered, setHovered] = useState(false);

    const fontSize = 45;

    function hoverCell() {
        setHovered(true);
    }

    function blurCell() {
        setHovered(false);
    }

    function changeSelectionMode() {
        if(!inSelection && !colSelectionMode && !cellSelectionMode){
            setInSelection(true);
            setColSelectionMode(true);
        }
        if(inSelection && colSelectionMode){
            setInSelection(false);
            setColSelectionMode(false);
            setCurrentSelection(selectedCols);
            onColSelection(selectedCols);
            setSelectedCols([]);
        }
    }

    useEffect(() => {
        if(colSelectionMode && inSelection && selectedCols.length>0){
            setCurrentSelection(selectedCols);
            setInSelection(false);
            setColSelectionMode(false);
            setCurrentSelection(selectedCols);
            setSelectedCols([]);
        }
    }, [selectedCols])

    const canvas = useMemo(() => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = scale[0]*100;
        canvas.height = fontSize;
        context.textBaseline = 'top';
        context.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif`;
    
        return canvas;
    }, [scale]);
    
    const dataMaterial = useMemo(() => {
        const context = canvas.getContext('2d');
        const maxChar = canvas.width/fontSize;

        context.lineWidth = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);

        const backgroundColor = inSelection ? selected_light : (hovered ? normal_hovered : normal_darker);
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, canvas.width, fontSize);

        let selection = '_';
        /*if (currentSelection.length>0){
            selection = '';
            currentSelection.forEach((colid) => { selection += ', '+ csv[colid][0]});
        }*/

        if (currentSelection.length>0){
            selection = '';
            currentSelection.forEach((colid) => { selection += colid+', '});
        }

        let text = selection;
        context.fillStyle = '#000000';
        context.fillText(text, 0, 0, canvas.width);

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

    }, [canvas, hovered, currentSelection]);
    
  return (
    <Interactive onSelect={changeSelectionMode} onHover={hoverCell} onBlur={blurCell} >
        <mesh rotation={rotation} scale={scale} position={position} geometry={backgroundGeometry} material={dataMaterial} />
    </Interactive>
  )
}

function CellField({ position, rotation, scale, onCellSelection }) {
    const { selectedCells, setSelectedCells, colSelectionMode, cellSelectionMode, setCellSelectionMode } = useRContext();
    const [inSelection, setInSelection] = useState(false);
    const [currentSelection, setCurrentSelection] = useState([]);
    const [hovered, setHovered] = useState(false);

    const fontSize = 45;

    function hoverCell() {
        setHovered(true);
    }

    function blurCell() {
        setHovered(false);
    }

    function changeSelectionMode() {
        if(!inSelection && !colSelectionMode && !cellSelectionMode){
            setInSelection(true);
            setCellSelectionMode(true);
        }
        if(inSelection && cellSelectionMode){
            setInSelection(false);
            setCellSelectionMode(false);
            setCurrentSelection(selectedCells);
            onCellSelection(selectedCells);
            setSelectedCells([]);
        }
    }

    useEffect(() => {
        if(cellSelectionMode && inSelection && selectedCells.length>0){
            setCurrentSelection(selectedCells);
            setInSelection(false);
            setCellSelectionMode(false);
            setCurrentSelection(selectedCells);
            setSelectedCells([]);
        }
    }, [selectedCells])

    const canvas = useMemo(() => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = scale[0]*100;
        canvas.height = fontSize;
        context.textBaseline = 'top';
        context.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif`;
    
        return canvas;
    }, [scale]);
    
    const dataMaterial = useMemo(() => {
        const context = canvas.getContext('2d');
        const maxChar = canvas.width/fontSize;

        context.lineWidth = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);

        const backgroundColor = inSelection ? selected_light : (hovered ? normal_hovered : normal_darker);
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, canvas.width, fontSize);

        let selection = '_';
        /*if (currentSelection.length>0){
            selection = '';
            currentSelection.forEach((colid) => { selection += ', '+ csv[colid][0]});
        }*/

        if (currentSelection.length>0){
            selection = '';
            currentSelection.forEach((element) => { selection += element+', '});
        }

        let text = selection;
        context.fillStyle = '#000000';
        context.fillText(text, 0, 0, canvas.width);

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

    }, [canvas, hovered, currentSelection]);
    
  return (
    <Interactive onSelect={changeSelectionMode} onHover={hoverCell} onBlur={blurCell} >
        <mesh rotation={rotation} scale={scale} position={position} geometry={backgroundGeometry} material={dataMaterial} />
    </Interactive>
  )
}

function SelectBuilder({ position, scale, onColSelection }) {
    const fontSize = 45;
    const canvas = useMemo(() => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = scale[0]*100;
        canvas.height = fontSize;
        context.textBaseline = 'top';
        context.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif`;
    
        return canvas;
    }, [scale]);
    
    const dataMaterial = useMemo(() => {
        const context = canvas.getContext('2d');

        context.lineWidth = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = '#000000';
        context.fillText('SELECT', 0, 0, canvas.width);

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

    }, [canvas]);
    
  return (
    <>
        <mesh position={[position[0]-scale[0]/3,position[1],position[2]]} scale={[scale[0]/4, scale[1], scale[2]]} geometry={backgroundGeometry} material={dataMaterial} />
        <ColumnsField position={[position[0]+scale[0]/8,position[1],position[2]]} scale={[2*scale[0]/3, scale[1], scale[2]]} onColSelection={onColSelection} />
    </>
  )
}

function FilterBuilder({ position, scale, onFilterChange }) {
    const [operator, setOperator] = useState(['==', '!=']);
    const [selectedCol, setSelectCol] = useState([]);
    const [selectedCell, setSelectedCell] = useState([]);

    useEffect(() => {
        if(selectedCell.length>0 && selectedCol.length>0);
            //onFilterChange(selectedCell[0]+operator+selectedCol[0])
    }, [operator, selectedCell, selectedCol]);

    const fontSize = 45;
    const canvas = useMemo(() => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = scale[0]*100;
        canvas.height = fontSize;
        context.textBaseline = 'top';
        context.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif`;
    
        return canvas;
    }, [scale]);
    
    const dataMaterial = useMemo(() => {
        const context = canvas.getContext('2d');

        context.lineWidth = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = '#000000';
        context.fillText('FILTER', 0, 0, canvas.width);

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

    }, [canvas]);
    
  return (
    <>
        <mesh position={[position[0]-scale[0]/3,position[1],position[2]]} scale={[scale[0]/4, scale[1], scale[2]]} geometry={backgroundGeometry} material={dataMaterial} />
        <ColumnField position={[position[0]-scale[0]/16,position[1],position[2]]} scale={[scale[0]/5, scale[1], scale[2]]} />
        <DropDown position={[position[0]-scale[0]/16+scale[0]/5,position[1],position[2]]} scale={[3*scale[0]/8, scale[1]*3, scale[2]]} color={0xffffff} onChangeValue={(value) => {setOperator(value)}} dropDownValue={operator} fontSize={0.08} />
        <CellField position={[position[0]-scale[0]/16+2*scale[0]/5,position[1],position[2]]} scale={[scale[0]/5, scale[1], scale[2]]} />
    </>
  )
}

function QueryBuilder({ position, scale }) {
    const [selectCols, setSelectCols] = useState([]);
    return (
        <Box position={position} scale={scale}>
            <SelectBuilder position={[0,-scale[1]/16,1]} scale={[scale[0], scale[1]/8, scale[2]]} onColSelection={setSelectCols} />
            <FilterBuilder position={[0,-scale[1]/8-0.1,1]} scale={[scale[0], scale[1]/8, scale[2]]} />
        </Box>
    )
}

export default QueryBuilder;