const mqClass = require('../intake-service/service/rabbitMQService');
const producer = new mqClass('localhost');

const obj = require('../intake-service/model/incommingMessage');

producer.open().then(()=>{
    producer.send('miro.workflow.ys.input',obj);

});

