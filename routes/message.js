var express = require('express');
var app = express();
//db connection
var mongo = process.env.VCAP_SERVICES;
var port = process.env.PORT || 3030;
var conn_str = "";

//Wire up database using VCAP (bluemix)
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

var user = {
    home:  function (req, res) {
        res.render('../ngClient/views/index.html', {title: 'Daniel Progress'});
        res.end();
    },
    /******************************/
    // Insert one mock message    //
    // POST method when called    // 
    //*****************************/    
    insert: function (req, res) {
        var teste = req.body.test;
        console.log(teste);
        var message = { 'username': 'mateusp', 'password': '123', 'ts': new Date() };
        if (db && db !== "null" && db !== "undefined") {
            db.collection('users').insert(message, {safe:true}, function(err){
                if (err) { 
                    res.write('mongodb message insert failed' + err.stack);
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
    /******************************/
    // Display all messages       //
    // GET method when called     // 
    //*****************************/  
    display: function (req, res) {
      if (db && db !== "null" && db !== "undefined") {
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
    /******************************/
    // Delete all messages        //
    // POST method when called    // 
    //*****************************/  
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
    },
    

}

module.exports = user;