require('dotenv').config();

var path = require('path');
var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

var app = express();
require('./app/config/passport')(passport);

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

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log('Node.js listening on port ' + port + '...');
});
