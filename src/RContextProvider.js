/**
 * @module RContextProviders
 */
import { createContext, useContext, useState, useEffect } from 'react';
import Papa from 'papaparse';

const API_R = 'https://vr.achencraft.fr';
//const API_R = 'http://localhost:8000';

const RContext = createContext({
    csvFiles: [],
    setCsvFiles: () => { },
    csv: [],
    setCsv: () => { },
    selectedCols: [],
    setSelectedCols: () => { },
    selectedCells: [],
    setSelectedCells: () => { },
    rowInterval: [],
    incrementRowInterval: () => { },
    decrementRowInterval: () => { },
    colInterval: [],
    incrementColInterval: () => { },
    decrementColInterval: () => { },
    setColInterval: () => { },
    fetchInterval: [],
    setFetchInterval: () => { },
    gridSize: [],
    setGridSize: () => { },
    incrementColGrid: () => { },
    decrementColGrid: () => { },
    incrementRowGrid: () => { },
    decrementRowGrid: () => { },
    displayAngles: [],
    setDisplayAngles: () =>{ },
    clearColSelection: () =>{ },
    colSelectionMode: false,
    setColSelectionMode: () => { },
    clearCellSelection: () => { },
    cellSelectionMode: false,
    setCellSelectionMode: () => { },
    sendSelectRequest: () => { },
    sessionCodeId: null,
    setSessionCodeId: () => { },
    setSessionState: () => { }

});

/**
 * Wrapper du provider
 * @returns {} - Context de fonctions et variables R
 */
function useRContext() {
    return useContext(RContext);
}

/**
 * Provider R
 * @param {} - Elements enfants du contexte
 * @returns {} - Provider pour le R contexte
 */
function RContextProvider({ children }) {
    const [gridSize, setGridSize] = useState([5, 5]);
    const [csv, setCsv] = useState([]);
    const [selectedCols, setSelectedCols] = useState([]);
    const [selectedCells, setSelectedCells] = useState([]);
    const [csvFiles, setCsvFiles] = useState(['']);
    const [fetchInterval, setFetchInterval] = useState([0, 0]);
    const [rowInterval, setRowInterval] = useState([0, 9]);
    const [colInterval, setColInterval] = useState([0, 9]);
    const [displayAngles, setDisplayAngles] = useState(["180","360"]);
    const [cellSelectionMode, setCellSelectionMode] = useState(false);
    const [colSelectionMode, setColSelectionMode] = useState(false);
    const [selectQueryPool, setSelectQueryPool] = useState({});
    const [sessionCodeId, setSessionCodeId] = useState(null);
    const [sessionState, setSessionState] = useState('DISCONNECTED');

    const FETCH_SIZE = 20;

    useEffect(() => {
        createSessionCodeId();
        if(sessionState!='DISCONNECTED'){
            connectSessionCodeId(sessionState);
        }
    }, [sessionState]);

    useEffect(() => {
        RService.getCsvFiles()
            .then((res) => setCsvFiles(res))
            .catch(error => console.log('ERROR', error));
    }, []);

    useEffect(() => {
        if (csvFiles[0] == '') {
            console.log('INFO', 'NO FILE FETCHED BECAUSE NO FILE SELECTED');
            return;
        }
        if (rowInterval[1] + rowInterval[0] >= fetchInterval[0] + fetchInterval[1]) {
            setFetchInterval(prevstate => ([prevstate[0], prevstate[1] + FETCH_SIZE]));
        }

    }, [rowInterval, csvFiles]);

    useEffect(() => {
        if (csvFiles[0] == '') {
            console.log('INFO', 'NO FILE FETCHED BECAUSE NO FILE SELECTED');
            return;
        }

        if (!sessionCodeId) {
            console.log('INFO', 'SESSION ID NOT SET');
            return;
        }

        RService.getCsvWithSelect(sessionCodeId, csvFiles[0], fetchInterval, selectQueryPool)
            .then(response => {
                setCsv(response);
            })
            .catch(error => { setSessionCodeId("#00001"); console.log('ERROR', error)});
    }, [fetchInterval, sessionCodeId]);

    useEffect(() => {
        if (csvFiles[0] == '') {
            console.log('INFO', 'NO FILE FETCHED BECAUSE NO FILE SELECTED');
            return;
        }

        RService.getCsvWithSelect(sessionCodeId, csvFiles[0], fetchInterval, selectQueryPool)
            .then(response => {
                setCsv(response);
            })
            .catch(error => console.log('ERROR', error));
    }, [selectQueryPool]);

    useEffect(() => {
        if (csv && csv.length > 0 && csv[0].length > 0) {
            if(rowInterval[0]+rowInterval[1]>=csv[0].length){
                setRowInterval([0, ((csv[0].length < gridSize[1] - 1) ? csv[0].length : gridSize[1] - 1)]);
                setFetchInterval([0, FETCH_SIZE]); 
            }
            
            if(colInterval[0]+colInterval[1]>=csv.length)
                setColInterval([0, ((csv.length < gridSize[0] - 1) ? csv.length : gridSize[0] - 1)]);
        }
    }, [csv]);

    function createSessionCodeId(){
        RService.createSessionCodeId()
            .then(code => setSessionCodeId(code))
            .catch(error => console.log('ERROR', error));
    }

    function connectSessionCodeId(code){
        RService.connectSessionCodeId(code)
            .then(function(response) {
                if (!response.ok) {
                    setSessionCodeId("#00001");
                } else {
                    setSessionCodeId(code);
                }
            })
            .catch(error => setSessionCodeId("#00001"));
    }

    function incrementColInterval() {
        if(colInterval[1] < csv.length)
            setColInterval([colInterval[0]+1, colInterval[1]+1]);
    }

    function decrementColInterval() {
        if(colInterval[0] > 0)
            setColInterval([colInterval[0]-1, colInterval[1]-1]);
    }

    function incrementRowInterval() {
        if(csv.length>0 && rowInterval[1]<csv[0].length)
            setRowInterval([rowInterval[0]+1, rowInterval[1]+1]);
    }

    function decrementRowInterval() {
        if(rowInterval[0] > 0)
            setRowInterval([rowInterval[0]-1, rowInterval[1]-1]);
    }

    function incrementColGrid() {
        if(gridSize[0] < 30)
            setGridSize([gridSize[0]+1, gridSize[1]]);
    }

    function decrementColGrid() {
        if(gridSize[0] > 3)
            setGridSize([gridSize[0]-1, gridSize[1]]);
    }

    function incrementRowGrid() {
        if(gridSize[1] < 50)
            setGridSize([gridSize[0], gridSize[1]+1]);
    }

    function decrementRowGrid() {
        if(gridSize[1] > 10)
            setGridSize([gridSize[0], gridSize[1]-1]);
    }

    function setFirstDisplayAngles(selectedAngle) {
        let newDisplayAngles = displayAngles.slice();
        let idx = displayAngles.indexOf(selectedAngle);
        //swap selected file to first file
        [newDisplayAngles[0], newDisplayAngles[idx]] = [newDisplayAngles[idx], newDisplayAngles[0]];
        setDisplayAngles(newDisplayAngles);
    }

    function clearColSelection() {
        setSelectedCols([]);
    }

    function clearCellSelection() {
        setSelectedCells([]);
    }

    return (
        <RContext.Provider value={{
            csvFiles: csvFiles,
            setCsvFiles: setCsvFiles,
            csv: csv,
            setCsv: setCsv,
            selectedCols: selectedCols,
            setSelectedCols: setSelectedCols,
            selectedCells: selectedCells,
            setSelectedCells: setSelectedCells,
            rowInterval: rowInterval,
            incrementRowInterval: incrementRowInterval,
            decrementRowInterval: decrementRowInterval,
            colInterval: colInterval,
            incrementColInterval: incrementColInterval,
            decrementColInterval: decrementColInterval,
            fetchInterval: fetchInterval,
            setFetchInterval: setFetchInterval,
            gridSize: gridSize,
            setGridSize: setGridSize,
            incrementColGrid: incrementColGrid,
            decrementColGrid: decrementColGrid,
            incrementRowGrid: incrementRowGrid,
            decrementRowGrid: decrementRowGrid,
            displayAngles: displayAngles,
            setDisplayAngles: setFirstDisplayAngles,
            clearColSelection: clearColSelection,
            colSelectionMode: colSelectionMode,
            setColSelectionMode: setColSelectionMode,
            clearCellSelection: clearCellSelection,
            cellSelectionMode: cellSelectionMode,
            setCellSelectionMode: setCellSelectionMode,
            sendSelectRequest: setSelectQueryPool,
            sessionCodeId: sessionCodeId,
            setSessionCodeId: setSessionCodeId,
            setSessionState: setSessionState
        }}>
            {children}
        </RContext.Provider>
    )
}

/**
 * Classe service permettant de lancer des requetes avec le serveur
 */
class RService {
    static async getCsvFiles() {
        return fetch(API_R + "/csv_names", { mode: 'cors' })
            .then(res => {
                const reader = res.body.getReader();
                return reader.read();
            })
            .then(result => {
                const decoder = new TextDecoder('utf-8');
                return decoder.decode(result.value);
            })
            .then(csvStr => {
                const csv_data = JSON.parse(csvStr);
                return csv_data;
            })
            .catch(e => {
                console.log(e);
                return e;
            });
    }

    static async getCsv(sessionCodeId, csvName, fetchInterval) {
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json'}
        };

        return fetch(API_R + "/csv?session_code="+sessionCodeId+"&name="+csvName+"&offset="+fetchInterval[0]+"&limit="+fetchInterval[1], requestOptions)
            .then(res => {
                const reader = res.body.getReader();
                return reader.read();
            })
            .then(result => {
                const decoder = new TextDecoder('utf-8');
                return decoder.decode(result.value);
            })
            .then(csvStr => {
                const csv_data = Papa.parse(csvStr).data;
                const csv_flip = csv_data[0].map((col, i) => csv_data.map(row => row[i]));
                return csv_flip;
            })
            .catch(e => {
                console.log(e);
                return e;
            });
    }

    static async getCsvWithSelect(sessionCodeId, csvName, fetchInterval, selectQuery) {
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(selectQuery)
        };

        return fetch(API_R + "/csv?session_code="+sessionCodeId+"&name="+csvName+"&offset="+fetchInterval[0]+"&limit="+fetchInterval[1], requestOptions)
            .then(res => {
                if(res.ok || res.status==200 || res.status==201){
                    const reader = res.body.getReader();
                    return reader.read();
                }else{
                    const error = (data && data.message) || res.status;
                    return Promise.reject(error);
                }
            })
            .then(result => {
                const decoder = new TextDecoder('utf-8');
                return decoder.decode(result.value);
            })
            .then(csvStr => {
                const csv_data = Papa.parse(csvStr).data;
                const csv_flip = csv_data[0].map((col, i) => csv_data.map(row => row[i]));
                return csv_flip;
            })
            .catch(e => {
                console.log(e);
                return e;
            });
    }

    static async createSessionCodeId() {
        const requestOptions = {
            method: 'POST',
            mode: 'cors'
        };

        return fetch(API_R + "/session", requestOptions)
            .then(res => {
                const reader = res.body.getReader();
                return reader.read();
            })
            .then(result => {
                const decoder = new TextDecoder('utf-8');
                return decoder.decode(result.value);
            })
            .then(body => {
                return JSON.parse(body).session_code;
            })
            .catch(e => {
                console.log(e);
                return e;
            });
    }

    static async connectSessionCodeId(code) {
        const requestOptions = {
            method: 'GET',
            mode: 'cors'
        };

        return fetch(API_R + "/session?session_code="+code, requestOptions);
    }
}

export { useRContext, RContextProvider };
