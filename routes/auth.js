var jwt = require('jwt-simple');
var express = require('express');
var app = express();

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

var auth = {
    /******************************/
    // Login method - Check db    //
    // POST method when called    // 
    //*****************************/   
  login: function(req, res) {
    var username = req.body.username || '';
    var password = req.body.password || '';
 
    if (username == '' || password == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
 
    // Fire a query and check if the credentials are valid
      var dbUserObj = db.collection('users').findOne({username:username, password:password}, function(err, data){
            if (!data) {
                res.status(401);
                res.json({
                    "status" : 401,
                    "message" : "Invalid credentials"
                });
            } else {
                res.json(genToken(data));   
            }  
        }); 
  },
    
    validateUser: function(username) {
        var dbUserObj = {};
        db.collection('users').findOne({username:username}, function(err, data){
            if (!data) {
                res.status(401);
                res.json({
                    "status" : 401,
                    "message" : "Invalid credentials"
                });
            } else {
                dbUserObj = data;
            }
         });
     
        return dbUserObj;  
    }
}
 
// private method
    function genToken(user) {
        console.log("GENERATING TOKEN");
        var expires = expiresIn(7); // 7 days
        var token = jwt.encode({
            exp: expires
        }, require('../config/secret.js')());
 
      return {
        token: token,
        expires: expires,
        user: user
      };
    }
 
    function expiresIn(numDays) {
        var dateObj = new Date();
        return dateObj.setDate(dateObj.getDate() + numDays);
    }
 
module.exports = auth;