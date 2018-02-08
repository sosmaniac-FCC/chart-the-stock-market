const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StockSchema = Schema({
    timestamp: {
        type: String
    },
    stocks: [{
        color: {
            type: String  
        },
        status: {
            code: {
                type: Number
            },
            message: {
                type: String
            }
        },
        results: [{
            symbol: {
                type: String
            },
            timestamp: {
                type: String
            },
            tradingDay: {
                type: String
            },
            open: {
                type: Number
            },
            high: {
                type: Number
            },
            low: {
                type: Number
            },
            close: {
                type: Number
            },
            volume: {
                type: Number
            }
        }]
    }]
});

const Stock = mongoose.model('Stock', StockSchema);

module.exports = Stock;