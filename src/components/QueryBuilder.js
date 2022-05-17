import { useMemo, useState, useEffect } from 'react';
import { MeshBasicMaterial, DoubleSide, PlaneBufferGeometry, CanvasTexture, LinearFilter, RepeatWrapping } from 'three';
import { Interactive } from '@react-three/xr';
import { useRContext } from '../RContextProvider';
import Box from './Box';
import DropDown from './DropDown';
import { normal_light, normal_darker, selected_light, normal_hovered, normalMaterial, hoveredMaterial, selectedMaterial, darker_panel, blue_button } from '../helpers/colors';

const backgroundGeometry = new PlaneBufferGeometry(1, 1);

function ColumnsField({ position, rotation, scale, onColSelection }) {
    const { csv, selectedCols, setSelectedCols, colSelectionMode, cellSelectionMode, setColSelectionMode } = useRContext();
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
            let selection = [];
            if(selectedCols.length>0){
                selectedCols.forEach((colid) => { selection.push(csv.length>colid && csv[0].length>0 ? csv[colid][0] : '?')});
            } else if (currentSelection.length>0){
                currentSelection.forEach((colid) => { selection.push(csv.length>colid && csv[0].length>0 ? csv[colid][0] : '?')});
            } else {
                selection.push('*');
            }
            onColSelection(selection);
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

        let selection = '';
        if(inSelection && selectedCols.length>0){
            selectedCols.forEach((colid) => { selection += (csv.length>colid && csv[0].length>0 ? csv[colid][0] : '?')+', '});
        } else if (currentSelection.length>0){
            currentSelection.forEach((colid) => { selection += (csv.length>colid && csv[0].length>0 ? csv[colid][0] : '?')+', '});
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
    <Interactive onSelectStart={changeSelectionMode} onHover={hoverCell} onBlur={blurCell} >
        <mesh rotation={rotation} scale={scale} position={position} geometry={backgroundGeometry} material={dataMaterial} />
    </Interactive>
  )
}

function ColumnField({ position, rotation, scale, onColSelection }) {
    const { csv, selectedCols, setSelectedCols, colSelectionMode, cellSelectionMode, setColSelectionMode } = useRContext();
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
            setSelectedCols([]);
        }
    }

    useEffect(() => {
        if(inSelection && colSelectionMode && selectedCols.length>0){
            let colid = -1;
            if (selectedCols.length>0){
                colid = selectedCols[0];
            }
            let selection = '';
            if (colid>-1 && csv.length>colid){
                selection = csv[colid][0];
                onColSelection(selection);
                setCurrentSelection(selection);
            }
            setInSelection(false);
            setColSelectionMode(false);
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

        let text = currentSelection;
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
    <Interactive onSelectStart={changeSelectionMode} onHover={hoverCell} onBlur={blurCell} >
        <mesh rotation={rotation} scale={scale} position={position} geometry={backgroundGeometry} material={dataMaterial} />
    </Interactive>
  )
}

function CellField({ position, rotation, scale, onCellSelection }) {
    const { csv, selectedCells, setSelectedCells, colSelectionMode, cellSelectionMode, setCellSelectionMode } = useRContext();
    const [inSelection, setInSelection] = useState(false);
    const [currentSelection, setCurrentSelection] = useState('');
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
            setSelectedCells([]);
        }
    }

    useEffect(() => {
        if(cellSelectionMode && inSelection && selectedCells.length>0){
            let colid = -1;
            let rowid = -1;
            if(selectedCells.length>0 && selectedCells[0].length>1){
                colid = selectedCells[0][0]
                rowid = selectedCells[0][1];
            }
            let selection = '';
            if (colid>-1 && rowid>-1 && csv.length>colid && csv[0].length>rowid){
                selection = csv[colid][rowid];
                setCurrentSelection(selection);
                onCellSelection(selection);
            }
            setInSelection(false);
            setCellSelectionMode(false);
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

        let text = currentSelection;
        context.fillStyle = '#000000';
        context.fillText(text, 0, 0, canvas.width);

        const texture = new CanvasTexture(canvas);
        
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
    <Interactive onSelectStart={changeSelectionMode} onHover={hoverCell} onBlur={blurCell} >
        <mesh rotation={rotation} scale={scale} position={position} geometry={backgroundGeometry} material={dataMaterial} />
    </Interactive>
  )
}
function ButtonQuery({text, position, scale, mainColor})
{
    const fontSize = 35;
    const canvas = useMemo(() => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 100;
        canvas.height = fontSize;
        context.textBaseline = 'top';
        context.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif`;
    
        return canvas;
    }, [scale]);
    
    const dataMaterial = useMemo(() => {
        const context = canvas.getContext('2d');
        
        context.lineWidth = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = blue_button;
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = "#ffffff";
        context.fillText(text, 0, 0, canvas.width);

        const texture = new CanvasTexture(canvas);
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

    return(
        <mesh position={position} scale={scale} geometry={backgroundGeometry} material={dataMaterial} />
    );
}

function SelectBuilder({ position, scale, onColSelection }) {
    return (
        <>
            <Box position={[-0.755, 0, -0.5]} scale={[0.5, 1, 0.1]} color={darker_panel}>
                <ButtonQuery position={[position[0]-scale[0]/3,position[1],position[2]]} scale={[scale[0]/4, scale[1], scale[2]]} mainColor={"#BB0B0B"} text={"SELECT"}/>
                <ColumnsField position={[position[0]+scale[0]/8,position[1],position[2]]} scale={[2*scale[0]/3, scale[1], scale[2]]} onColSelection={onColSelection} />
            </Box>
        </>
    )
}

function FilterBuilder({ position, scale, onFilterChange }) {
    const [operator, setOperator] = useState(['==', '!=']);
    const [selectedCol, setSelectedCol] = useState('');
    const [selectedCell, setSelectedCell] = useState('');

    useEffect(() => {
        if(selectedCol!='' && selectedCell!='')
            onFilterChange(selectedCol+' '+operator[0]+' \''+selectedCell+'\'');
        else
            onFilterChange('');
    }, [operator, selectedCell, selectedCol]);

  return (
        <Box position={[0, 0.06, -0.5]} scale={[1, 0.20, 0.1]} color={darker_panel}>
            <ButtonQuery position={[position[0]-scale[0]/3,position[1]-0.15,position[2]]} scale={[scale[0]/4, scale[1]*5, scale[2]]} mainColor={"#096A09"} text={"FILTER"}/>
            <ColumnField position={[position[0]-scale[0]/16,position[1]-0.15,position[2]]} scale={[scale[0]/5, scale[1]*5, scale[2]]} onColSelection={setSelectedCol} />
            <DropDown position={[position[0]-scale[0]/16+scale[0]/5,position[1]-0.15,position[2]]} scale={[3*scale[0]/8, scale[1]*6, scale[2]]} color={0xffffff} onChangeValue={(value) => {setOperator(value)}} dropDownValue={operator} fontSize={0.08} />
            <CellField position={[position[0]-scale[0]/16+2*scale[0]/5,position[1]-0.15,position[2]]} scale={[scale[0]/5, scale[1]*5, scale[2]]} onCellSelection={setSelectedCell} />
        </Box>
  )
}

function GroupByBuilder({ position, scale, onGroupByChange }) {

    return (
        <Box position={[0, -0.15, -0.5]} scale={[1, 0.20, 0.1]} color={darker_panel}>
            <ButtonQuery position={[position[0]-scale[0]/3,position[1],position[2]]} scale={[scale[0]/4, scale[1]*5, scale[2]]} mainColor={"#0080FF"} text={"GROUP BY"}/>
            <ColumnsField position={[position[0]+scale[0]/8,position[1],position[2]]} scale={[2*scale[0]/3, scale[1]*5, scale[2]]} onColSelection={onGroupByChange} />
        </Box>
    )
}

function SummerizeBuilder({ position, scale, onSummariseChange }){
    const [operator, setOperator] = useState(["mean", "sum", "min", "max"]);
    const [selectedCol, setSelectCol] = useState('');

    const onDropDownChange = (op) => {
        let newOperators = operator.slice();
        let idx = newOperators.indexOf(op);
        //swap selected op to first op
        [newOperators[0], newOperators[idx]] = [newOperators[idx], newOperators[0]];
        setOperator(newOperators);
    }

    useEffect(() => {
        if(selectedCol!='')
            onSummariseChange([{"operation": operator[0], "column":selectedCol}])
        else
            onSummariseChange('');
    }, [operator, selectedCol]);

    return (
        <Box position={[0, -0.375, -0.5]} scale={[1, 0.35, 0.1]} color={darker_panel}>
            <ButtonQuery position={[position[0]-scale[0]/3,position[1]/4,position[2]]} scale={[scale[0]/4, scale[1]*2, scale[2]]} mainColor={"#5E2664"} text={"SUMMERIZE"}/>
            <DropDown position={[position[0]-scale[0]/16,position[1]/4,position[2]]} scale={[scale[0]/2, scale[1]*4, scale[2]]} color={0xffffff} onChangeValue={onDropDownChange} dropDownValue={operator} fontSize={0.08} />
            <ColumnField position={[position[0]+scale[0]/4,position[1]/4,position[2]]} scale={[scale[0]/3, scale[1]*2, scale[2]]} onColSelection={setSelectCol} />
        </Box>
      )
}

function Submit({ position, scale, onSubmitSend }){
    return (
        <>
            <Interactive onSelectStart={onSubmitSend} >
                <ButtonQuery position={[position[0]-scale[0]/3,position[1],position[2]]} scale={[scale[0]/4, scale[1], scale[2]]} mainColor={"#582900"} text={"SUBMIT"}/>
            </Interactive>
        </>
      )
}

function QueryBuilder({ position, scale }) {
    const { sendSelectRequest } = useRContext();

    const [selectCols, setSelectCols] = useState(['*']);
    const [filter, setFilter] = useState('');
    const [groupby, setGroupby] = useState([]);
    const [summarize, setSummarize] = useState('');

    function submitRequest() {
        let query = { };
        if (selectCols[0]!='*')
            query.select = selectCols;
        
        if(filter!='')
            query.filter = filter;
        
        if(groupby!='')
            query.group_by = groupby;

        if(groupby!='' && summarize!='')
            query.summarize = summarize;

        sendSelectRequest(query);
    }
    
    return (
        <>
            <SelectBuilder position={[0,-scale[1]/16,1]} scale={[scale[0], scale[1]/8, scale[2]]} onColSelection={setSelectCols} />
            <FilterBuilder position={[0,-scale[1]/8-0.1,1]} scale={[scale[0], scale[1]/8, scale[2]]} onFilterChange={setFilter} />
            <GroupByBuilder position={[0,-scale[1]/4-0.15,1]} scale={[scale[0], scale[1]/8, scale[2]]} onGroupByChange={setGroupby} />
            <SummerizeBuilder position={[0,-scale[1]/2-0.07,1]} scale={[scale[0], scale[1]/8, scale[2]]} onSummariseChange={setSummarize} />
            <Submit position={[0.6,-scale[1]/2-0.3,1]} scale={[scale[0], scale[1]/8, scale[2]]} onSubmitSend={submitRequest}/>
        </>
    )
}

export default QueryBuilder;