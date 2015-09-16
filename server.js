//Dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon')
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//Index of the routes
var routes = require('./routes/index');

// setup middleware
var app = express();
//setting up the frameworks
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(cookieParser());
 
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.errorHandler());
app.use(express.static(__dirname + '/public')); //setup static public directory

//Set up the view engine, and ejs to render html
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
//
app.all('/*', function(req, res, next) {
    //Set up CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-type,Accept,X-Access-Token,X-Key');

    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});





//Link the validation control to the routes
app.all('/api/v1/*', [require('./middlewares/validateRequest')]);
app.use('/', routes);

// There are many useful environment variables available in process.env.
// VCAP_APPLICATION contains useful information about a deployed application.
var appInfo = JSON.parse(process.env.VCAP_APPLICATION || "{}");
// TODO: Get application information and use it in your app.

// VCAP_SERVICES contains all the credentials of services bound to
// this application. For details of its content, please refer to
// the document or sample of each service.
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
// TODO: Get service credentials and communicate with bluemix services.

// The IP address of the Cloud Foundry DEA (Droplet Execution Agent) that hosts this application:
var host = (process.env.VCAP_APP_HOST || 'localhost');
// The port on the DEA for communication with the application:
var port = (process.env.VCAP_APP_PORT || 3000);
// Start server
app.listen(port, host);
console.log('App started on port ' + port);