//'use strict';
const config = require('./config.json');

var ibmdb = require('ibm_db');


var conn_str=process.env.IBMDB2_CONN_STRING||config.database.db2connString;

let connection=ibmdb.open(conn_str, function (err,conn) {
  if (err) return console.log(err);
  db=conn;
 
});



module.exports = connection;

