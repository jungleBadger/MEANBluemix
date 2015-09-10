var express = require('express');
var message = require('./message.js');
var app = express();

var auth = require('./auth.js');

//free routes
app.post('/login', auth.login);

app.get('/', message.home);
app.get('/api/insertMessage', message.insert);
app.get('/api/render', message.display);
app.post('/api/delete', message.delete);

app.post('/api/v1/render', message.display);
module.exports = app;
