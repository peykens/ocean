const mqClass = require('./rabbitMQService');
const broker = new mqClass('localhost');

doALittleTest();


async function doALittleTest(){
    await broker.sentToTopicExchange('my.exchange','my.topic.test',{name: 'test'});
    console.log('send');
    return;
}
