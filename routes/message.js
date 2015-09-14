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


var user = {

    home:  function (req, res) {
        res.render('../ngClient/views/index.html', {title: 'Daniel Progress'});

      res.end();
        
    },

    insert: function (req, res) {
    var teste = req.body.test;
        console.log(teste);
      var message = { 'message': 'Hello, Bluemix', 'ts': new Date() };
      if (db && db !== "null" && db !== "undefined") {
        db.collection('messages').insert(message, {safe:true}, function(err){
          if (err) { 
            console.log(err.stack);
            res.write('mongodb message insert failed');
            res.end(); 
          } else {
            res.write('following messages has been inserted into database' + "\n" 
            + JSON.stringify(message));
            res.end();
              
          }
        });    
      } else {
        res.write('No mongo found');
        res.end();
      } 
    },
    
    display: function (req, res) {
      if (db && db !== "null" && db !== "undefined") {
        // list messages
        db.collection('messages').find({}, {sort:[['_id', 'desc']]}, function(err, cursor) {
          if (err) {
            console.log(err.stack); 
            res.write('mongodb message list failed');
            res.end();
          } else {
            cursor.toArray(function(err, items) {
              if (err) {
                console.log(err.stack); 
                res.write('mongodb cursor to array failed');
                res.end();
              } else {
                res.send(items);

                res.end();
              }
            });
          }
        });     
      } else {
        res.write('No mongo found');
        res.end();  
      }
    },
    


    delete: function (req, res) {
        if (db && db !== "null" && db !== "undefined") {
        db.collection('messages').remove({}, function (err, cursor) {
            if (err) {
             console.log(err.stack);
                res.write('delete failed');
                res.end();
            } else {
                 res.writeHead(200, {'Content-Type': 'text/plain'});
               
                  res.write(JSON.stringify(cursor) + "\n");
                
                res.end();
            }
        });


        }
    

    }

}

module.exports = user;