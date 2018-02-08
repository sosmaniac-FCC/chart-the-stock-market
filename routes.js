const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const Stock = require('./src/js/models/stock');

const router = express.Router();

router.use(bodyParser.json({
    limit: '50mb'
}));

router.put('/update', (req, res) => {
    console.log("update");
    
    Stock.findOne({})
    .then((dbStocks) => {
        return Stock.remove({});
    })
    .then((result) => {
        return Stock.create({timestamp: req.body.timestamp, stocks: req.body.stocks.filter(ele => ele != null)});
    })
    .then((result) => {
        res.send(true);
    })
    .catch((e) => {
        res.send(false);
    });
});

router.get('/retrieve', (req, res) => {
    console.log("retrieve");
    
    Stock.findOne({})
    .then((result) => {
        console.log(result);
        
        res.send(result);
    })
    .catch((e) => {
        res.send(false);
    });
});

router.get('/barchart', (req, res) => {
    axios.get('https://marketdata.websol.barchart.com/getHistory.json?apikey=' + process.env.BAR_KEY + '&symbol=' + req.query.query + '&type=daily&startDate=' + req.query.start + '&endDate=' + req.query.end + '&maxRecords=182&order=asc&sessionFilter=EFK&splits=true&dividends=true&exchange=NYSE%2CAMEX%2CNASDAQ')
    .then((result) => {
        const range = 100;
        const r = Math.floor(Math.random() * 256), g = Math.floor(Math.random() * range), b = Math.floor((Math.random() * range) + (256 - range));
        result.data.color = 'rgb(' + r + ',' + g + ',' + b + ')';
        res.send(result.data);
    })
    .catch((error) => {
        res.send(false);
    });
});

router.get('/', (req, res) => {
    console.log("send");
	res.sendFile(path.join(__dirname, 'src/html/index.html'));
});


module.exports = router;