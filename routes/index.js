var express = require('express');
var app = express();
//Externalizing the route logic
var message = require('./message.js');
var auth = require('./auth.js');

//free routes
app.get('/', message.home);
app.post('/login', auth.login);
app.get('/api/render', message.display);
app.post('/api/delete', message.delete);
app.get('/api/insertMessage', message.insert);

//Authenticated routes
app.get('/api/v1/render', message.display);

module.exports = app;
