const mqClass = require('./rabbitMQService');
const broker = new mqClass('localhost');


doALittleTest();

async function doALittleTest(){
    await broker.listenOnExchange('my.exchange','my.topic.test',myExchangeMessage);
}


function myExchangeMessage(obj,exchange,topic){
    return new Promise((resolve,reject) => {
        console.log(JSON.stringify(obj),exchange,topic);
        resolve(true);
    });
}