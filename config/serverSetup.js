//local files
//'use strict';
const config = require('./config.json');

const connection=require('./dbSetup');



// environment setup
process.env.NODE_ENV=process.env.NODE_ENV||config.server.environment;


console.log("Current Environment ******** ",process.env.NODE_ENV,config.server.environment);

/* code generator */
codeGeneratorMethod=(code,id) =>{
    var res=code;
    for(i=0;i<15-(code.length+id.toString().length);i++){
        res+='0';
    }
    res+=id.toString();
    return res;
} 


module.exports = {config,codeGeneratorMethod};





