const mqClass = require('./rabbitMQService');
const broker = new mqClass('localhost');




async function doALittleTest(){
    return new Promise((resolve,reject)=> {
        await broker.listenOnExchange('my.exchange','my.topic.test',myExchangeMessage);
        
    });
}


function myExchangeMessage(obj,exchange,topic){
    return new Promise((resolve,reject) => {
        resolve(true);
    });
}