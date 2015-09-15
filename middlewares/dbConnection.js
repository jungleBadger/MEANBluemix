var express = require('express');
var app = express();
var mongoose = require('mongoose');

    var mongo = process.env.VCAP_SERVICES;
    var port = process.env.PORT || 3030;
    var conn_str = "";

    if (mongo) {
      var env = JSON.parse(mongo);
      if (env['mongodb-2.2']) {
        mongo = env['mongodb-2.2'][0]['credentials'];
        if (mongo.url) {
          conn_str = mongo.url;
        } else {
          console.log("No mongo found");
        }  
      } else {
        conn_str = 'mongodb://localhost:27017';
      }
    } else {
      conn_str = 'mongodb://localhost:27017';
    }



    //mongoose.connect(conn_str);

    var MongoClient = require('mongodb').MongoClient;
    var db; 
    MongoClient.connect(conn_str, function(err, database) {
      if(err) throw err;
      db = database;
    }); 

    app.use(function(req,res,next){
        req.db = db;
        next();
    });

    
    module.exports = db;