require('dotenv').config();

const path = require('path');
const socket = require('socket.io');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const logger = require('morgan');
const bodyParser = require('body-parser');

const routes = require('./routes');

const app = express();

app.use(logger('dev'));

app.use(bodyParser.json({
	limit: '50mb'
}));
app.use(bodyParser.urlencoded({ 
	extended: false,
	limit: '50mb'
}));

mongoose.connect(process.env.MONGO_URI, {
	useMongoClient: true
});
mongoose.Promise = require('bluebird');

app.use(express.static(path.join(__dirname, 'src')));

app.use(session({
	secret: 'secretStock',
	resave: true,
	saveUninitialized: true
}));

app.use('/', routes);

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
	console.log('Node.js listening on port ' + port + '...');
});

const io = socket(server);

io.on('connection', (socket) => {
	console.log("Apple Sauce");
	
	socket.on('update', (stocks) => {
		socket.broadcast.emit('update', stocks);
	});
});
