const debug = require('debug')('workflowEndpoint');
function workflowEndpoint(broker,queue){
    const _broker = broker;
    const _queue = queue;
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
        debug('intake', `Publishing on ${_queue}`, inputObj);
        _broker.send(_queue,inputObj);

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(
            {
                message: 'Published succesfully'
            }));        
    }
}
module.exports = workflowEndpoint;