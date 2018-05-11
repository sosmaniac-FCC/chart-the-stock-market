import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux'; 

import { logger } from 'redux-logger';
import thunk from 'redux-thunk';

import { createStore, applyMiddleware } from 'redux';

import reducer from './redux/stockReducer';
import Layout from './components/Layout';

import { saveState, loadState } from './dbStorage';

/* global io */

Date.prototype.yyyymmdd = function() {
  const mm = this.getMonth() + 1; // zero-based
  const dd = this.getDate();

  return [this.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('');
};

function readyToGo(initialStocks) {
    const store = createStore(reducer, initialStocks == undefined ? undefined : {
        stocks: initialStocks,
        update: true,
        loading: false,
        error: null
    }, applyMiddleware(thunk, logger));
        
    Promise.resolve(
        store.subscribe(() => {
            if (store.getState().update) {
                return saveState(store.getState().stocks); 
            }
            else {
                return null;
            }
        })
    )
    .then(() => {
        ReactDOM.render(
            <Provider store={store}>
                <Layout socket={io.connect(process.env.APP_URL)} />
            </Provider>,
            document.getElementById('app')
        );
    });
}

loadState((initialStocks, initialTimestamp) => {
    if (initialStocks != undefined) {
        initialStocks = JSON.parse(JSON.stringify(initialStocks));
        initialStocks = initialStocks.filter(ele => ele != null);
        
        // Reset the stocks daily
        const today = new Date().yyyymmdd();
        
        if (today != initialTimestamp) {
            readyToGo(undefined);
        }
        else {
            readyToGo(initialStocks);
        }
    }
    else {
        readyToGo(undefined);
    }
});