//Load .env
require('dotenv').config();

const debug = require('debug')('intake-service');
const package = require('./package.json');
const rabbitBuilder = require('./service/rabbitMQService');
const uuidv4 = require('uuid/v4');

const envalid = require('envalid')
const { str, host } = envalid

const env = envalid.cleanEnv(process.env, {
    BROKER_HOST:            host(),
    BROKER_QUEUE_INPUT:        str(),
    BROKER_QUEUE_EXCHANGE:  str()
});

const workflowConfig = require('./config/workflow');

debug(`Application: ${package.name}`,`Version: ${package.version}`);
debug(`BROKER_HOST: ${env.BROKER_HOST}`);
debug(`BROKER_QUEUE_INPUT: ${env.BROKER_QUEUE_INPUT}`);
debug(`BROKER_QUEUE_EXCHANGE: ${env.BROKER_QUEUE_EXCHANGE}`);

debug(`Initialize rabbit connection`);
const broker = new rabbitBuilder(env.BROKER_HOST);
debug(`Start listening on input queue ${env.BROKER_QUEUE_INPUT}`);
broker.listen(env.BROKER_QUEUE_INPUT,handleIncomingMessage);

function handleIncomingMessage(obj){
    return new Promise((resolve,reject)=>{
        //Handle incoming message
        debug(`Handle incoming message`);
        //  Is message valid
        if (!isMessageValid(obj)){ reject('Invallid message structure'); }
        if (!obj.id){ obj.id = uuidv4(); }
        debug(`Message ID ${obj.id}`,obj.id);
        //  Is the workflow known?
        if (!workflowConfig[obj.workflow.name]) {
            debug(`Workflow [${obj.workflow.name}] is not known in config`);
            reject('Workflow is not known');
        }
        //  Append workflow step(s)
        debug(`Append workflow tasks`,obj.id);
        obj.workflow.tasks = workflowConfig[obj.workflow.name].tasks;
        //  Sanitize the data
        obj.output = {}
        //  Publish on exchange queue
        debug(`Publish for execution to exchange queue ${env.BROKER_QUEUE_EXCHANGE}`,obj.id);
        broker.send(env.BROKER_QUEUE_EXCHANGE,obj);
    });
}

function isMessageValid(obj){
    debug(`Validate incoming message`);
    if (!obj.workflow) { 
        debug(`Workflow data missing in request`);
        return false; 
    }
    if (!obj.workflow.name) { 
        debug(`Workflow name missing in request`);
        return false; 
    }
    return true;
}