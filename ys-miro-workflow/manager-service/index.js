//Load .env
require('dotenv').config();

const debug = require('debug')('manager-service');
const package = require('./package.json');
const rabbitBuilder = require('./service/rabbitMQService');
const uuidv4 = require('uuid/v4');

const envalid = require('envalid')
const { str } = envalid

const env = envalid.cleanEnv(process.env, {
    BROKER_HOST:            str(),
    BROKER_QUEUE_EXCHANGE:  str()
});

const workflowConfig = require('./config/workflow');

debug(`Application: ${package.name}`,`Version: ${package.version}`);
debug(`BROKER_HOST: ${env.BROKER_HOST}`);
debug(`BROKER_QUEUE_EXCHANGE: ${env.BROKER_QUEUE_EXCHANGE}`);

debug(`Initialize rabbit connection`);
const broker = new rabbitBuilder(env.BROKER_HOST);
debug(`Start listening on input queue ${env.BROKER_QUEUE_INPUT}`);