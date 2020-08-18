//'use strict';
const config = require('./config.json');

const request = require('request');
const fs = require('fs');

const path = require('path');

const apiHost=process.env.APIHOST||"spcmTest" ;


const querystring = require('querystring');

 const runQuery=(query,paramsValueArray)=>{
    return new Promise((resolve,reject)=>{
       db.query(query,paramsValueArray,function(err,data){

       if(err)  reject(err);
       resolve(data);
          
       });
    });
};   






module.exports={runQuery}











  
