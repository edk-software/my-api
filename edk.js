var express = require('express');
const logger = require('./config/logger');

var app = express();
var multer = require('multer')
var constants = require('constants');
var constant = require('./config/constants');

var port = process.env.PORT || 8042;
var passport = require('passport');
var flash = require('connect-flash');
var path = require('path');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var dbConnection = require('./config/dbConnection');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)



dbConnection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('Successfully started connection pool: ', results[0].solution);
});


// routes ======================================================================
require('./config/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


//launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

//catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).send('404 Sorry, page not found');
});

app.use(function (req, res, next) {
    res.status(500).send('500 Internal api error');
});



exports = module.exports = app;