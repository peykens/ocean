require('dotenv').config();

const debug = require('debug')('intake-endpoint');
const package = require('./package.json');
const rabbitBuilder = require('./service/rabbitMQService');

const envalid = require('envalid')
const { str, host, port } = envalid

const env = envalid.cleanEnv(process.env, {
    BROKER_HOST: host(),
    BROKER_QUEUE_INPUT: str(),
    HTTP_PORT: port(),
    HTTP_CORS: str()
});

const express =  require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

debug(`Application: ${package.name}`,`Version: ${package.version}`);
debug(`BROKER_HOST: ${env.BROKER_HOST}`);
debug(`BROKER_QUEUE_INPUT: ${env.BROKER_QUEUE_INPUT}`);
debug(`HTTP_PORT: ${env.HTTP_PORT}`);
debug(`HTTP_CORS: ${env.HTTP_CORS}`);

debug(`Initialize rabbit connection`);
const broker = new rabbitBuilder(env.BROKER_HOST);

debug(`Initialize HTTP server`);
const webApp = new express();
const handlerRoot = require('./endpoint/root')();
const handlerWorkflow = require('./endpoint/workflow')(broker,env.BROKER_QUEUE_INPUT);

webApp.use(helmet());
webApp.use(cors({origin: env.HTTP_PORT}));
webApp.use(bodyParser.urlencoded({ extended: true }));
webApp.use(bodyParser.json({ strict: false }));

webApp.get('/', handlerRoot.version);
webApp.post('/wf/:workflow/',handlerWorkflow.intake);

webApp.listen(env.HTTP_PORT, function() {
    debug('Started', 'Listening', env.HTTP_PORT);
});