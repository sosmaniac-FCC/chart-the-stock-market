import axios from 'axios';

export function loadState(callback) {
    axios.get('/retrieve')
    .then((response) => {
        // console.log('axios retrieve');
        // console.log(response);
        
        const stocks = response.data.stocks;
        if (stocks == undefined || stocks == "undefined" || stocks.length == 0 || stocks == false) {
            console.log('loadState default');
            
            return callback(undefined);
        }
        else {
            console.log('loadState custom');
            
            return callback(stocks, response.data.timestamp);
        } 
    })
    .catch((e) => {
        return callback(undefined);
    });
}

export function saveState(stocks) {
    console.log('Request body begin');
    
    const timestamp = new Date().yyyymmdd();
    
    stocks = JSON.parse(JSON.stringify(stocks));
    
    stocks = stocks.filter(ele => ele != null);
    
    axios.put('/update', {
        stocks: stocks,
        timestamp: timestamp
    })
    .then((success) => {
        console.log('Request body');
        
        if (success.data) {
            console.log('Store state persisted');
        }
        else {
            console.error('Store state static');
        }
    })
    .catch((e) => {
        console.log('Request body overload');
        
        console.error('Store state error');
    });
}