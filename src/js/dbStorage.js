import axios from 'axios';

export function loadState(callback) {
    axios.get('/retrieve')
    .then((response) => {
        const stocks = response.data.stocks;
        
        if (stocks == undefined || stocks == "undefined" || stocks.length == 0 || stocks == false) {
            return callback(undefined, new Date().yyyymmdd());
        }
        else {
            return callback(stocks, response.data.timestamp);
        } 
    })
    .catch((e) => {
        return callback(undefined, new Date().yyyymmdd());
    });
}

export function saveState(stocks) {
    const timestamp = new Date().yyyymmdd();
    
    stocks = JSON.parse(JSON.stringify(stocks));
    stocks = stocks.filter(ele => ele != null);
    
    axios.put('/update', {stocks: stocks, timestamp: timestamp})
    .then((success) => {
        if (success.data) {
            console.log('Store state persisted');
        }
        else {
            console.log('Store state static');
        }
    })
    .catch((e) => {
        console.error('Store state error');
    });
}