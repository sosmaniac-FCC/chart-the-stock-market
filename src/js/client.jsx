import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux'; 

import { logger } from 'redux-logger';
import thunk from 'redux-thunk';

import { createStore, applyMiddleware } from 'redux';

import reducer from './redux/stockReducer';
import Layout from './components/Layout';

import { saveState, loadState } from './dbStorage';

const middleware = applyMiddleware(thunk, logger);

/* global $, io */

const socket = io.connect(process.env.APP_URL);

// yyyymmdd date parsing
Date.prototype.yyyymmdd = function() {
  const mm = this.getMonth() + 1; // zero-based
  const dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('');
};

function readyToGo(initialStocks) {
    const store = createStore(reducer, initialStocks == undefined ? undefined : {
        stocks: initialStocks,
        update: true,
        loading: false,
        error: null
    }, middleware);
        
    Promise.resolve(
        store.subscribe(() => {
            if (store.getState().update) {
                saveState(store.getState().stocks); 
            }
        })
    )
    .then(() => {
        ReactDOM.render(
            <Provider store={store}>
                <Layout socket={socket} />
            </Provider>,
            document.getElementById('app')
        );
    });
}

loadState((initialStocks, initialTimestamp) => {
    // console.log('loadState received');
    // console.log(initialStocks);
    
    if (initialStocks != undefined) {
        initialStocks = JSON.parse(JSON.stringify(initialStocks));
        
        initialStocks = initialStocks.filter(ele => ele != null);
        
        // WARNING: this code block has not been tested and may contain errors
        // this code block ensures updated stock information from day to day
        const today = new Date().yyyymmdd();
        if (today != initialTimestamp) {
            let promises = [];
            initialStocks = []; 
            
            for (let i = 0; i < initialStocks.length; i++) {
                promises.push(new Promise((resolve, reject) => {
                    $.get('/retrieve', (stock) => {
                        if (stock != false) {
                            resolve(stock);
                        }
                        else {
                            reject('Failed to load stock ' + i);
                        }
                    });
                }));
            }
            
            Promise.all(promises)
            .then((results) => {
                results.forEach((stock) => {
                    initialStocks.push(stock);
                });
                
                readyToGo(initialStocks);
            })
            .catch((error) => {
                console.error(error);
                
                readyToGo(undefined);
            });
        }
        else {
            readyToGo(initialStocks);
        }
    }
    else {
        readyToGo(undefined);
    }
});