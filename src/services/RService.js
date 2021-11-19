import Papa from 'papaparse';

const API_R = 'https://vr.achencraft.fr';

class RService {
    getCsvFiles() {
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
            const csv_data = Papa.parse(csvStr).data;
            return csv_data;
            //setCsvFiles([csv_data[0], csv_data]);
        })
        .catch(e => {
            console.log(e);
            return e;
        });
    }
    
    getCsv(csvName, fetchInterval) {
        return fetch(API_R + "/csv?name="+csvName+"&offset="+fetchInterval[0]+"&limit="+(fetchInterval[1]-fetchInterval[0]), {mode: 'cors'})
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
            const csv_flip = csv_data.map((_, colIndex) => csv_data.map(row => row[colIndex]));
            return csv_flip;
            //setCsv(csv_flip);
        })
        .catch(e => {
            console.log(e);
            return e;
        });
    }
}
    
export default new RService();
    