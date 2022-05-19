/**
 * @module QueryBuilder
 */
import { useMemo, useState, useEffect } from 'react';
import { MeshBasicMaterial, DoubleSide, PlaneBufferGeometry, CanvasTexture, LinearFilter, RepeatWrapping } from 'three';
import { Interactive } from '@react-three/xr';
import { useRContext } from '../RContextProvider';
import Box from './Box';
import DropDown from './DropDown';
import { normal_darker, selected_light, normal_hovered, disabled_button, darker_panel, blue_button, hovered_button } from '../helpers/colors';

const backgroundGeometry = new PlaneBufferGeometry(1, 1);

/**
 * Récuperer des noms de colonne 
 * @param {} position - Position
 * @param {} rotation - Rotation
 * @param {} scale - Echelle
 * @param {} maxLines - Nombre maximum de ligne
 * @param {} selectedColsValue - Colonnes selectionnées
 * @param {} onColSelection - Fonction qui met à jour les données
 * @returns {} - Renvoie les différents noms de colonnes
 */
function ColumnsField({ position, rotation, scale, maxLines, selectedColsValue, onColSelection }) {
    const { csv, selectedCols, setSelectedCols, colSelectionMode, cellSelectionMode, setColSelectionMode } = useRContext();
    const [inSelection, setInSelection] = useState(false);
    const [hovered, setHovered] = useState(false);

    const fontSize = 18;

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
            let selection = [];
            if(selectedCols.length>0){
                selectedCols.forEach((colid) => { selection.push(csv.length>colid && csv[colid].length>0 ? csv[colid][0] : '?')});
            } else {
                selection.push('*');
            }
            onColSelection(selection);
            setSelectedCols([]);
            setInSelection(false);
            setColSelectionMode(false);
        }
    }

    useEffect(() => {
        if(inSelection && colSelectionMode && selectedCols.length>maxLines-1){
            setInSelection(false);
            setColSelectionMode(false);
        }
    }, [selectedCols, inSelection, colSelectionMode])

    const canvas = useMemo(() => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = maxLines*50;
        canvas.height = fontSize*maxLines;
        context.textBaseline = 'top';
        context.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif`;
    
        return canvas;
    }, []);
    
    const dataMaterial = useMemo(() => {
        const context = canvas.getContext('2d');
        const maxChar = canvas.width/fontSize*15;

        context.lineWidth = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);

        const backgroundColor = inSelection ? selected_light : (hovered ? normal_hovered : normal_darker);
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);

        let selection = [];
        if(inSelection){
            selectedCols.forEach((colid) => { selection .push(csv.length>colid && csv[colid].length>0 && csv[colid][0]!='*' ? csv[colid][0] : '?')});
        } else if (selectedColsValue.length>0){
            selectedColsValue.forEach((colname) => selection.push(colname));
        } else {
            selection.push('*');
        }

        let lineHeight = canvas.height/maxLines;

        context.fillStyle = '#000000';
        selection.forEach((colname, idx) => {
            context.fillText(colname.slice(0, maxChar), 0, idx*lineHeight, colname.length*fontSize);
        })

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

    }, [canvas, hovered, inSelection, selectedColsValue]);
    
  return (
    <Interactive onSelectStart={changeSelectionMode} onHover={hoverCell} onBlur={blurCell} >
        <mesh rotation={rotation} scale={scale} position={position} geometry={backgroundGeometry} material={dataMaterial} />
    </Interactive>
  )
}

/**
 * Récuperer un nom de colonne 
 * @param {} position - Position
 * @param {} rotation - Rotation
 * @param {} scale - Echelle
 * @param {} selectedColValue - Colonne selectionnée
 * @param {} onColSelection - Fonction qui met à jour les données
 * @returns {} - Renvoie une colonne
 */
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
        canvas.width = scale[0]*500;
        canvas.height = fontSize;
        context.textBaseline = 'top';
        context.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif`;
    
        return canvas;
    }, []);
    
    const dataMaterial = useMemo(() => {
        const context = canvas.getContext('2d');
        const maxChar = canvas.width/fontSize;

        context.lineWidth = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);

        const backgroundColor = inSelection ? selected_light : (hovered ? normal_hovered : normal_darker);
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, canvas.width, fontSize);

        let text = selectedColValue.slice(0,20);
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

/**
 * Récuperer une cellule 
 * @param {} position - Position
 * @param {} rotation - Rotation
 * @param {} scale - Echelle
 * @param {} selectedCellValue - Cellule selectionnée
 * @param {} onCellSelection - Fonction qui met à jour les données
 * @returns {} - Renvoie une cellule
 */
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
        canvas.width = scale[0]*500;
        canvas.height = fontSize;
        context.textBaseline = 'top';
        context.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif`;
    
        return canvas;
    }, []);
    
    const dataMaterial = useMemo(() => {
        const context = canvas.getContext('2d');
        const maxChar = canvas.width/fontSize;

        context.lineWidth = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);

        const backgroundColor = inSelection ? selected_light : (hovered ? normal_hovered : normal_darker);
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, canvas.width, fontSize);

        let text = selectedCellValue.slice(0,20);
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

/**
 * Créer un bouton sous forme de canva
 * @param {} text - Texte
 * @param {} position - Position
 * @param {} scale - Echelle
 * @param {} textColor - Couleur du texte
 * @param {} backColor - Couleur de l'arrière plan
 * @returns {} - Renvoie un mesh contient un bouton
 */
function ButtonQuery({text, position, scale, textColor='#000000', backColor='#ffffff'})
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
    }, []);
    
    const dataMaterial = useMemo(() => {
        const context = canvas.getContext('2d');
        
        context.lineWidth = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = backColor;
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = textColor;
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

    }, [canvas, backColor, textColor]);

    return(
        <mesh position={position} scale={scale} geometry={backgroundGeometry} material={dataMaterial} />
    );
}

/**
 * Gérer le "select"
 * @param {} position - Position
 * @param {} scale - Echelle
 * @param {} selectedCols - Colonnes selectionnées
 * @param {} onColSelection - Fonction qui met à jour les données
 * @returns {} - Renvoie un ensemble de composants
 */
function SelectBuilder({ position, scale, selectedCols, onColSelection }) {
    return (
        <Box position={position} scale={scale} color={darker_panel}>
            <ButtonQuery position={[0,position[1]+0.05,position[2]]} scale={[0.3, 0.15, scale[2]]} backColor={blue_button} textColor={'#ffffff'} text={"SELECT"}/>
            <ColumnsField position={[0, 0.39-0.9, position[2]]} scale={[0.9, 0.75, scale[2]]} maxLines={8} selectedColsValue={selectedCols} onColSelection={onColSelection} />
        </Box>
    )
}

/**
 * Gérer le "filter"
 * @param {} position - Position
 * @param {} scale - Echelle
 * @param {} operatorFilter - Opérateurs (==, !=)
 * @param {} setOperatorFilter - Fonction qui met à jour les données
 * @param {} selectedColFilter - Colonnes selectionnées
 * @param {} setSelectedColFilter - Fonction qui met à jour les données
 * @param {} selectedCellFilter - Cellules selectionnées
 * @param {} setSelectedCellFilter - Fonction qui met à jour les données
 * @returns {} - Renvoie un ensemble de composants
 */
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
        <Box position={position} scale={scale} color={darker_panel}>
            <Interactive onSelectStart={() => setActivated(!activated)} onHover={hoverCell} onBlur={blurCell}>
                <ButtonQuery 
                    position={[position[0]-scale[0]/3,-0.4,position[2]]} 
                    scale={[scale[0]/4, 0.6, scale[2]]}  
                    textColor={'#ffffff'}
                    backColor={hovered ? hovered_button : (activated ? blue_button : disabled_button)}
                    text={'FILTER'}
                />
            </Interactive>
            {activated ?
            <>
                <ColumnField position={[position[0]-scale[0]/16,-0.4,position[2]]} scale={[scale[0]/4, 0.8, scale[2]]}  selectedColValue={selectedColFilter} onColSelection={setSelectedColFilter} />
                <DropDown position={[position[0]-scale[0]/16+scale[0]/5,-0.4,position[2]]} scale={[0.15, 0.8, scale[2]]}  color={0xffffff} onChangeValue={(value) => {setOperatorFilter(value)}} dropDownValue={operatorFilter} fontSize={0.08} />
                <CellField position={[position[0]-scale[0]/16+2*scale[0]/5,-0.4,position[2]]} scale={[scale[0]/4, 0.8, scale[2]]}  selectedCellValue={selectedCellFilter} onCellSelection={setSelectedCellFilter} />
            </>
            : 
                null
            }
        </Box>
    )
}

/**
 * Gérer le "group by"
 * @param {} position - Position
 * @param {} scale - Echelle
 * @param {} groupbyCols - Colonnes selectionées
 * @param {} onGroupByChange - Fonction qui met à jour les données
 * @returns {} - Renvoie un ensemble de composants
 */
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
        <Box position={position} scale={scale} color={darker_panel}>
            <Interactive onSelectStart={() => setActivated(!activated)} onHover={hoverCell} onBlur={blurCell}>
                <ButtonQuery 
                    position={[0, 0, position[2]+0.1]} 
                    scale={[0.5, 0.15, scale[2]]} 
                    textColor={'#ffffff'}
                    backColor={hovered ? hovered_button : (activated ? blue_button : disabled_button)}
                    text={'GROUP BY'}
                />
            </Interactive>
            {activated ?
                <ColumnsField position={[0,-0.50,position[2]+0.1]} scale={[0.95, 0.78, scale[2]]} maxLines={3} selectedColsValue={groupbyCols} onColSelection={onGroupByChange} />
            : 
                null
            }
        </Box>
    )
}

/**
 * Gérer le "summerize"
 * @param {} position - Position
 * @param {} scale - Echelle
 * @param {} summariseOperatorValue - Opérateurs (mean, min, max, sum)
 * @param {} onSummariseOperatorChange - Fonction qui met à jour les données
 * @param {} summariseColValue - Valeurs
 * @param {} onSummariseColChange - Fonction qui met à jour les données
 * @returns {} - Renvoie un ensemble de composants
 */
function SummarizeBuilder({ position, scale, summariseOperatorValue, onSummariseOperatorChange, summariseColValue, onSummariseColChange }){

    const onDropDownChange = (op) => {
        let newOperators = summariseOperatorValue.slice();
        let idx = newOperators.indexOf(op);
        //swap selected op to first op
        [newOperators[0], newOperators[idx]] = [newOperators[idx], newOperators[0]];
        onSummariseOperatorChange(newOperators);
    }

    return (
        <Box position={position} scale={scale} color={darker_panel}>
            <ButtonQuery position={[0,0,position[2]+0.1]} scale={[0.5, 0.15, scale[2]]} textColor={'#ffffff'} backColor={blue_button} text={"SUMMARIZE"}/>
            <DropDown position={[-0.3,-0.25,position[2]+0.1]} scale={[0.35, 0.2, scale[2]]} color={0xffffff} dropDownValue={summariseOperatorValue} onChangeValue={onDropDownChange} fontSize={0.06} />
            <ColumnField position={[0.15, -0.25,position[2]+0.1]} scale={[0.5, 0.2, scale[2]]} selectedColValue={summariseColValue} onColSelection={onSummariseColChange} />
        </Box>
      )
}

/**
 * Gérer l'envoi de la requête'
 * @param {} position - Position
 * @param {} scale - Echelle
 * @param {} onSubmitSend - Fonction qui met à jour les données
 * @returns {} - Renvoie un ensemble de composants
 */
function Submit({ position, scale, onSubmitSend }){
    const [hovered, setHovered] = useState(false);

    function hoverCell() {
        setHovered(true);
    }

    function blurCell() {
        setHovered(false);
    }

    return (
        <Interactive onSelectStart={onSubmitSend} onHover={hoverCell} onBlur={blurCell} >
            <ButtonQuery position={[position[0]-scale[0]/3,position[1],position[2]]} scale={[scale[0]/4, scale[1], scale[2]]} textColor={'#ffffff'} backColor={(hovered ? hovered_button : blue_button)} text={"SUBMIT"}/>
        </Interactive>
      )
}

/**
 * Gérer la reinitialisation de l'affichage/requête
 * @param {} position - Position
 * @param {} scale - Echelle
 * @param {} onReset - Fonction qui met à jour les données
 * @returns {} - Renvoie un ensemble de composants
 */
function Reset({ position, scale, onReset }){
    const [hovered, setHovered] = useState(false);

    function hoverCell() {
        setHovered(true);
    }

    function blurCell() {
        setHovered(false);
    }

    return (
        <Interactive onSelectStart={onReset} onHover={hoverCell} onBlur={blurCell} >
            <ButtonQuery position={[position[0]-scale[0]/3,position[1],position[2]]} scale={[scale[0]/4, scale[1], scale[2]]} textColor={'#ffffff'} backColor={(hovered ? hovered_button : blue_button)} text={"RESET"}/>
        </Interactive>
      )
}

/**
 * Gérer la construction de la requête
 * @param {} position - Position
 * @param {} scale - Echelle
 * @returns {} - Reqûete
 */
function QueryBuilder({ position, scale }) {
    const { sendSelectRequest } = useRContext();

    const [operatorFilter, setOperatorFilter] = useState(["==", "!="]);
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
        
        if(groupbyCols.length>0)
            query.group_by = groupbyCols;

        let summarize = '';
        if(summarizeCol!='')
            summarize = [{"operation": summarizeOperator[0], "column":summarizeCol}];

        if(groupbyCols.length>0 && summarize!='')
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
        sendSelectRequest({});
    }
    
    return (
        <>
            <SelectBuilder position={[position[0]-1,-0.075,1]} scale={[0.99, 1.01, scale[2]]} selectedCols={selectCols} onColSelection={setSelectCols} />
            <FilterBuilder 
                position={[0,0,1]} 
                scale={[1, 0.25, scale[2]+0.2]}  
                operatorFilter={operatorFilter}
                setOperatorFilter={setOperatorFilter}
                selectedColFilter={selectedColFilter}
                setSelectedColFilter={setSelectedColFilter}
                selectedCellFilter={selectedCellFilter}
                setSelectedCellFilter={setSelectedCellFilter}
            />
            <GroupByBuilder position={[-scale[0]/4,-scale[1]/4-0.06,1]} scale={[scale[0]/2, 3*scale[1]/4, scale[2]]} groupbyCols={groupbyCols} onGroupByChange={setGroupbyCols} />
            {groupbyCols.length>0 ?
                <SummarizeBuilder 
                    position={[scale[0]/4,-scale[1]/4-0.06,1]}
                    scale={[scale[0]/2, 3*scale[1]/4, scale[2]]}
                    summariseOperatorValue={summarizeOperator} 
                    onSummariseOperatorChange={setSummarizeOperator} 
                    summariseColValue={summarizeCol} 
                    onSummariseColChange={setSummarizeCol} 
                />
            :
                null
            }
            <Submit position={[0.6,-scale[1]-scale[1]/16,1]} scale={[scale[0], scale[1]/8, scale[2]]} onSubmitSend={submitRequest}/>
            <Reset position={[0.6-scale[0]/2,-scale[1]-scale[1]/16 ,1]} scale={[scale[0], scale[1]/8, scale[2]]} onReset={resetRequest}/>
        </>
    )
}

export default QueryBuilder;