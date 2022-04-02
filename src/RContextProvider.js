import { createContext, useContext, useState, useEffect } from 'react';
import Papa from 'papaparse';

const API_R = 'https://vr.achencraft.fr';
//const API_R = 'http://localhost:8000';

const RContext = createContext({
  csvFiles: [],
  setCsvFiles: () => {},
  csv: [],
  setCsv: () => {},
  selectedCols: [],
  setSelectedCols: () => {},
  rowInterval: [],
  setRowInterval: () => {},
  colInterval: [],
  setColInterval: () => {},
  fetchInterval: [],
  setFetchInterval: () => {},
  gridSize: [],
  setGridSize: () => {}
});

function useRContext(){
    return useContext(RContext);
}

function RContextProvider({children}) {
    const [gridSize, setGridSize] = useState([19, 20]);
    const [csv, setCsv] = useState([]);
    const [selectedCols, setSelectedCols] = useState([]);
    const [csvFiles, setCsvFiles] = useState(['']);
    const [fetchInterval, setFetchInterval] = useState([0, 0]);
    const [rowInterval, setRowInterval] = useState([0, 9]);
    const [colInterval, setColInterval] = useState([0, 9]);

    const FETCH_SIZE = 40;

    useEffect(() => {
        RService.getCsvFiles()
        .then(function(response) {let res = response.slice(); res.splice(res.indexOf('email.csv'), 1);console.log(res);setCsvFiles(res);})
        .catch(error =>  console.log('ERROR', error));
    }, []);

    useEffect(() => {
        if(csvFiles[0]=='') {
          console.log('INFO', 'NO FILE FETCHED BECAUSE NO FILE SELECTED');
          return;
        }
        if(rowInterval[1]+rowInterval[0]>=fetchInterval[0]+fetchInterval[1]){
          setFetchInterval(prevstate => ([prevstate[0], prevstate[1]+FETCH_SIZE]));
        }
    
    }, [rowInterval, csvFiles]);
    
    useEffect(() => {
        if(csvFiles[0]=='') {
            console.log('INFO', 'NO FILE FETCHED BECAUSE NO FILE SELECTED');
            return;
        }

        RService.getCsv(csvFiles[0], fetchInterval)
        .then(response => setCsv(response))
        .catch(error => console.log('ERROR', error));
    }, [fetchInterval]);
    
    useEffect(() => {
        if (csv && csv.length>0 && csv[1].length>0 && csv[1][0].length>0) {
            setRowInterval([0, ((csv[1][0].length < gridSize[1]-1) ? csv[1][0].length : gridSize[1]-1)]);
            setColInterval([0, ((csv[1].length < gridSize[0]-1) ? csv[1].length : gridSize[0]-1)]);
            console.log('INFO', 'REQUEST 200 OK : CSV SIZE ' + csv.length + 'x' + csv[0].length);
        }
        setSelectedCols(Array(csv.length).fill(false));
    }, [csv]);

    return (
        <RContext.Provider value={{
            csvFiles: csvFiles, 
            setCsvFiles: setCsvFiles, 
            csv: csv, 
            setCsv: setCsv, 
            selectedCols: selectedCols,
            setSelectedCols: setSelectedCols,
            rowInterval: rowInterval,
            setRowInterval: setRowInterval,
            colInterval: colInterval,
            setColInterval: setColInterval,
            fetchInterval: fetchInterval,
            setFetchInterval: setFetchInterval,
            gridSize: gridSize,
            setGridSize: setGridSize
        }}>
          {children}
        </RContext.Provider>
    )
  }

class RService {
    static async getCsvFiles() {
        return fetch(API_R + "/csv_names", {mode: 'cors'})
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
    
    static async getCsv(csvName, fetchInterval) {
        return fetch(API_R + "/csv?name="+csvName+"&offset="+fetchInterval[0]+"&limit="+fetchInterval[1], {mode: 'cors'})
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
}
    
export {useRContext, RContextProvider};
    