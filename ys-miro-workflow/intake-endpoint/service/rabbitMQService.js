"use strict";
const debug = require('debug')('rabbitMQService');
const amqlib = require('amqplib');

class rabbitMQService{
    constructor(host){
        debug('host',host);
        this._rabbitMQHost = host;
        this._rabbitMQConnected = false;
    }

    async open(){
        debug('open','create rabbitmq connection');
        try {
            this._rabbitMQConnection = await amqlib.connect(`amqp://${this._rabbitMQHost}/`);
            debug('open','rabbitmq connected');
            this._rabbitMQConnected = true;
            this._registerListenerOnExit();
            return true;
        } catch (error) {
            debug('open',`error connecting to amqp://${this._rabbitMQHost}/`, error);
            throw error;
        }
    }

    _registerListenerOnExit(){
        process.on('SIGTERM', () => {
            debug('SIGTERM signal received', 'close connection to broker');
            this.close();
        });
    }

    async close(){
        if (!this._rabbitMQConnected) {return;}
        debug('close','close rabbitmq connection');
        return this._rabbitMQConnection.close();
    }

    async listen(queue,callback){
        if (!this._rabbitMQConnected){ await this.open();}
        debug('listen',queue,'creating channel');
        const channel = await this._rabbitMQConnection.createChannel();
        debug('listen',queue,'asserting to queue');
        await channel.assertQueue(queue);
        debug('listen',queue,'start listening');
        channel.consume(queue,(msg)=> {
            if (msg !== null){
                debug('listen',queue,'handle message','invoking callback');
                callback(JSON.parse(msg.content.toString())).then((rsp) => {
                    debug('listen',queue,'handle message','processed succesfully, acknowledging message on broker');
                    channel.ack(msg);
                }).catch((ex)=>{
                    debug('listen',queue,'handle message','error returned from callback, acknowledging message on broker',ex);
                    //channel.nack(msg); 
                    channel.ack(msg);
                });
                
            }
        });
        return;
    }

    async send(queue,obj){
        if (!this._rabbitMQConnected){ await this.open();}
        debug('send',queue,'creating channel');
        const channel = await this._rabbitMQConnection.createChannel();
        debug('send',queue,'asserting to queue');
        await channel.assertQueue(queue);
        debug('send',queue,'sending message', obj);
        await channel.sendToQueue(queue,Buffer.from(JSON.stringify(obj)));
        return;
    }

}

module.exports = rabbitMQService;