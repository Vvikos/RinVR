import { useMemo, useState, useEffect } from 'react';
import { MeshBasicMaterial, DoubleSide, PlaneBufferGeometry, CanvasTexture, LinearFilter, RepeatWrapping } from 'three';
import { Interactive } from '@react-three/xr';
import { useRContext } from '../RContextProvider';
import Box from './Box';
import DropDown from './DropDown';
import { normal_light, normal_darker, selected_light, normal_hovered } from '../helpers/colors';

const backgroundGeometry = new PlaneBufferGeometry(1, 1);

function ColumnsField({ position, rotation, scale, selectedColsValue, onColSelection }) {
    const { csv, selectedCols, setSelectedCols, colSelectionMode, cellSelectionMode, setColSelectionMode } = useRContext();
    const [inSelection, setInSelection] = useState(false);
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
            let selection = [];
            if(selectedCols.length>0){
                selectedCols.forEach((colid) => { selection.push(csv.length>colid && csv[0].length>0 ? csv[colid][0] : '?')});
            } else if (selectedColsValue.length>0){
                selectedColsValue.forEach((colid) => { selection.push(csv.length>colid && csv[0].length>0 ? csv[colid][0] : '?')});
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
        } else if (selectedColsValue.length>0){
            selectedColsValue.forEach((colid) => { selection += (csv.length>colid && csv[0].length>0 ? csv[colid][0] : '?')+', '});
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

function ColumnField({ position, rotation, scale, selectedColValue, onColSelection }) {
    const { csv, selectedCols, setSelectedCols, colSelectionMode, cellSelectionMode, setColSelectionMode } = useRContext();
    const [inSelection, setInSelection] = useState(false);
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

        let text = selectedColValue;
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

    }, [canvas, hovered, selectedColValue]);
    
  return (
    <Interactive onSelectStart={changeSelectionMode} onHover={hoverCell} onBlur={blurCell} >
        <mesh rotation={rotation} scale={scale} position={position} geometry={backgroundGeometry} material={dataMaterial} />
    </Interactive>
  )
}

function CellField({ position, rotation, scale, selectedCellValue, onCellSelection }) {
    const { csv, selectedCells, setSelectedCells, colSelectionMode, cellSelectionMode, setCellSelectionMode } = useRContext();
    const [inSelection, setInSelection] = useState(false);
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

        let text = selectedCellValue;
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

    }, [canvas, hovered, selectedCellValue]);
    
  return (
    <Interactive onSelectStart={changeSelectionMode} onHover={hoverCell} onBlur={blurCell} >
        <mesh rotation={rotation} scale={scale} position={position} geometry={backgroundGeometry} material={dataMaterial} />
    </Interactive>
  )
}
function ButtonQuery({text, position, scale, mainColor, backColor='#ffffff'})
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

        context.fillStyle = backColor;
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.lineWidth = 4;
        context.strokeStyle= mainColor;
        context.strokeRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = mainColor;
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

function SelectBuilder({ position, scale, selectedCols, onColSelection }) {
    return (
        <>
            <ButtonQuery position={[position[0]-scale[0]/3,position[1],position[2]]} scale={[scale[0]/4, scale[1], scale[2]]} mainColor={"#BB0B0B"} text={"SELECT"}/>
            <ColumnsField position={[position[0]+scale[0]/8,position[1],position[2]]} scale={[2*scale[0]/3, scale[1], scale[2]]} selectedColsValue={selectedCols} onColSelection={onColSelection} />
        </>
    )
}

function FilterBuilder({ position, scale, operatorFilter, setOperatorFilter, selectedColFilter, setSelectedColFilter, selectedCellFilter, setSelectedCellFilter={setSelectedCellFilter} }) {
    const [hovered, setHovered] = useState(false);
    const [activated, setActivated] = useState(false);

    function hoverCell() {
        setHovered(true);
    }

    function blurCell() {
        setHovered(false);
    }

    return (
    <>
        <Interactive onSelectStart={() => setActivated(!activated)} onHover={hoverCell} onBlur={blurCell}>
            <ButtonQuery 
                position={[position[0]-scale[0]/3,position[1],position[2]]} 
                scale={[scale[0]/4, scale[1], scale[2]]} 
                mainColor={activated ? '#096A09' : '#666565'}
                backColor={hovered ? normal_hovered : '#ffffff'}
                text={'FILTER'}
            />
        </Interactive>
        {activated ?
        <>
            <ColumnField position={[position[0]-scale[0]/16,position[1],position[2]]} scale={[scale[0]/5, scale[1], scale[2]]} selectedColValue={selectedColFilter} onColSelection={setSelectedColFilter} />
            <DropDown position={[position[0]-scale[0]/16+scale[0]/5,position[1],position[2]]} scale={[3*scale[0]/8, scale[1]*3, scale[2]]} color={0xffffff} onChangeValue={(value) => {setOperatorFilter(value)}} dropDownValue={operatorFilter} fontSize={0.08} />
            <CellField position={[position[0]-scale[0]/16+2*scale[0]/5,position[1],position[2]]} scale={[scale[0]/5, scale[1], scale[2]]} selectedCellValue={selectedCellFilter} onCellSelection={setSelectedCellFilter} />
        </>
        : 
            null
        }
    </>
  )
}

function GroupByBuilder({ position, scale, groupbyCols, onGroupByChange }) {
    const [hovered, setHovered] = useState(false);
    const [activated, setActivated] = useState(false);

    function hoverCell() {
        setHovered(true);
    }

    function blurCell() {
        setHovered(false);
    }

    return (
    <>
        <Interactive onSelectStart={() => setActivated(!activated)} onHover={hoverCell} onBlur={blurCell}>
          <ButtonQuery 
            position={[position[0]-scale[0]/3,position[1],position[2]]} 
            scale={[scale[0]/4, scale[1], scale[2]]} 
            mainColor={activated ? '#0080FF' : '#666565'}
            backColor={hovered ? normal_hovered : '#ffffff'}
            text={'GROUP BY'}
        />
        </Interactive>
        {activated ?
            <ColumnsField position={[position[0]+scale[0]/8,position[1],position[2]]} scale={[2*scale[0]/3, scale[1], scale[2]]} selectedColsValue={groupbyCols} onColSelection={onGroupByChange} />
        : 
            null
        }
    </>
    )
}

function SummarizeBuilder({ position, scale, summariseOperatorValue, onSummariseOperatorChange, summariseColValue, onSummariseColChange }){
    const [selectedCol, setSelectCol] = useState('');

    const onDropDownChange = (op) => {
        let newOperators = summariseOperatorValue.slice();
        let idx = newOperators.indexOf(op);
        //swap selected op to first op
        [newOperators[0], newOperators[idx]] = [newOperators[idx], newOperators[0]];
        onSummariseOperatorChange(newOperators);
    }

    return (
        <>
            <ButtonQuery position={[position[0]-scale[0]/3,position[1],position[2]]} scale={[scale[0]/4, scale[1], scale[2]]} mainColor={"#5E2664"} text={"SUMMARIZE"}/>
            <DropDown position={[position[0]-scale[0]/16,position[1],position[2]]} scale={[scale[0]/2, scale[1]*2, scale[2]]} color={0xffffff} onChangeValue={onDropDownChange} dropDownValue={operator} fontSize={0.08} />
            <ColumnField position={[position[0]+scale[0]/4,position[1],position[2]]} scale={[scale[0]/3, scale[1], scale[2]]} selectedColValue={summariseColValue} onColSelection={onSummariseColChange} />
        </>
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

function Reset({ position, scale, onReset }){
    return (
        <>
            <Interactive onSelectStart={onReset} >
                <ButtonQuery position={[position[0]-scale[0]/3,position[1],position[2]]} scale={[scale[0]/4, scale[1], scale[2]]} mainColor={"#582900"} text={"RESET"}/>
            </Interactive>
        </>
      )
}

function QueryBuilder({ position, scale }) {
    const { sendSelectRequest } = useRContext();

    const [operatorFilter, setOperatorFilter] = useState(['==', '!=']);
    const [selectedColFilter, setSelectedColFilter] = useState('');
    const [selectedCellFilter, setSelectedCellFilter] = useState('');

    const [selectCols, setSelectCols] = useState(['*']);
    const [groupbyCols, setGroupbyCols] = useState([]);
    const [summarizeOperator, setSummarizeOperator] = useState(["mean", "sum", "min", "max"]);
    const [summarizeCol, setSummarizeCol] = useState('');

    function submitRequest() {
        let query = {};
        if (selectCols[0]!='*')
            query.select = selectCols;
        
        let filter = '';
        if(selectedColFilter!='' && selectedCellFilter!='')
            filter = selectedColFilter+' '+operatorFilter[0]+' \''+selectedCellFilter+'\'';
        
        if(filter!='')
            query.filter = filter;
        
        if(groupby!='')
            query.group_by = groupby;

        let summarize = '';
        if(summariseColValue!='')
            summarize = [{"operation": summarizeOperator[0], "column":summariseColValue}];

        if(groupby!='' && summarize!='')
            query.summarize = summarize;

        if(query != {})
            sendSelectRequest(query);
    }

    function resetRequest() {
        setSelectCols(['*']);
        setSelectedCellFilter('');
        setSelectedColFilter('');
        setGroupbyCols([]);
        setSummarizeCol('');
    }
    
    return (
        <Box position={position} scale={scale}>
            <SelectBuilder position={[0,-scale[1]/16,1]} scale={[scale[0], scale[1]/8, scale[2]]} selectedCols={selectCols} onColSelection={setSelectCols} />
            <FilterBuilder 
                position={[0,-scale[1]/8-0.1,1]} 
                scale={[scale[0], scale[1]/8, scale[2]]} 
                operatorFilter={operatorFilter}
                setOperatorFilter={setOperatorFilter}
                selectedColFilter={selectedColFilter}
                setSelectedColFilter={setSelectedColFilter}
                selectedCellFilter={selectedCellFilter}
                setSelectedCellFilter={setSelectedCellFilter}
            />
            <GroupByBuilder position={[0,-scale[1]/4-0.15,1]} scale={[scale[0], scale[1]/8, scale[2]]} groupbyCols={groupbyCols} onGroupByChange={setGroupbyCols} />
            {groupbyCols.length>0 ?
                <SummarizeBuilder 
                    position={[0,-scale[1]/2-0.07,1]} 
                    scale={[scale[0], scale[1]/8, scale[2]]}
                    summariseOperatorValue={summarizeOperator} 
                    onSummariseOperatorChange={setSummarizeOperator} 
                    summariseColValue={summarizeCol} 
                    onSummariseColChange={setSummarizeCol} 
                />
            :
                null
            }
            <Submit position={[0.6,-scale[1]/2-0.3,1]} scale={[scale[0], scale[1]/8, scale[2]]} onSubmitSend={submitRequest}/>
            <Reset position={[0.6-scale[0]/2,-scale[1]/2-0.3,1]} scale={[scale[0], scale[1]/8, scale[2]]} onReset={resetRequest}/>
        </Box>
    )
}

export default QueryBuilder;