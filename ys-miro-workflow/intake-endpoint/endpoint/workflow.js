const debug = require('debug')('workflowEndpoint');
function workflowEndpoint(broker,exchange,topic){
    const _broker = broker;
    const _exchange = exchange;
    const _topic = topic;
    return {
        intake
    };
    function intake(req, res) {
        const workflowName = req.params.workflow;
        debug('intake', `Message for ${workflowName}`);
        
        const inputObj = {
            input: req.body,
            workflow: {
                name: workflowName
            }
        };
        debug('intake', `Publishing on ${_exchange} on topic ${_topic}`, inputObj);
        _broker.sentToTopicExchange(_exchange,_topic,inputObj);

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(
            {
                message: 'Published succesfully'
            }));        
    }
}
module.exports = workflowEndpoint;