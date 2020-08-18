//'use strict';
const {config} = require('./config/serverSetup');
const express=require('express');   
const bodyParser=require('body-parser');
const {upTimeFormat} =  require('./config/functions');
const path=require('path');
process.env.ROOT=__dirname;

const app=express();

app.set('port', process.env.PORT || config.server.port);


 
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false }));

app.get('/', (req, res) => {
    var upTime = upTimeFormat(process.uptime());
    res.status(200).send({'Service':'Active','Uptime':upTime});
})


app.get('/dbquery', (req, res) => {    
    db.query('SELECT current date FROM sysibm.sysdummy1 ',function(err,data){
        if(err)     res.send(err);    
        res.send(data);  
        });
});





//app.use('/public',express.static(path.join(__dirname, 'public')));
app.use('/api/distance',require('./routes/api/distance'));



// stop fake get request
app.get('*', function(req, res, next) {
    var err = new Error(`The requested(${req.url}) resource couldn\'t be found`);
    err.status = 404;   
    throw err;
});

// error handler
app.use( (err, req, res, next)=> {	
   // logger.error(err);  
    err.message = err.message || 'Internal Server Error';  
    res.status(err.status || 500).json({message:err.message,status:err.status});    
});


app.listen(app.get('port'),()=>{
   
    console.log(`Server start listening at port ${app.get('port')}`);
});
  


module.exports=app;




