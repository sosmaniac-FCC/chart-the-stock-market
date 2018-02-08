export default function reducer(state = {
    stocks: [],
    update: true,
    loading: false,
    error: null
}, action) {
    
    switch (action.type) {
        case 'QUERYING_STOCK_START': {
            return {
                ...state,
                update: false,
                stocks: defaultDeepCloneOfStocks(state.stocks),
                loading: true,
                error: null
            };
        }
        case 'QUERYING_STOCK_FULFILLED': {
            return {
                ...state,
                update: false,
                stocks: defaultDeepCloneOfStocks(state.stocks),
                loading: false,
                error: null
            };
        }
        case 'QUERYING_STOCK_ERROR': {
            return {
                ...state,
                stocks: defaultDeepCloneOfStocks(state.stocks),
                update: false,
                loading: false,
                error: action.error
            };
        }
        case 'ADDING_STOCK': {
            let newStocks = [];

            state.stocks.forEach((stock, x) => {
                let newEntries = [];
                
                newStocks[x] = {
                    ...stock
                };
                
                stock.results.forEach((entry, y) => {
                    newEntries[y] = {
                        ...entry
                    };
                });
                
                newStocks[x].results = newEntries;
            });
            
            newStocks.push(action.stock);
            action.socket.emit('update', newStocks);
            
            return {
                ...state,
                stocks: newStocks,
                update: true,
                error: null
            };
        }
        case 'REMOVING_STOCK': {
            let newStocks = [];
            
            state.stocks.forEach((stock, x) => {
                let newEntries = [];
                
                if (stock.results[0].symbol.toUpperCase() != action.symbol.toUpperCase()) {
                    newStocks[x] = {
                        ...stock
                    };
                    
                    stock.results.forEach((entry, y) => {
                        newEntries[y] = {
                            ...entry
                        };
                    });
                    
                    newStocks[x].results = newEntries;
                }
                else {
                    x--; // this might not work
                }
            });
            
            action.socket.emit('update', newStocks);
            
            return {
                ...state,
                stocks: newStocks,
                update: true,
                error: null
            };
        }
        case 'UPDATING_STOCKS': {
            return {
                ...state,
                stocks: action.stocks,
                update: true,
                error: null
            };
        }
        default: return state;
    }
}

function defaultDeepCloneOfStocks(stocks) {
    let newStocks = [];

    stocks.forEach((stock, x) => {
        let newEntries = [];
                
        newStocks[x] = {
            ...stock
        };
        
        stock.results.forEach((entry, y) => {
            newEntries[y] = {
                ...entry
            };
        });
        
        newStocks[x].results = newEntries;
    });
    
    return newStocks;
}
