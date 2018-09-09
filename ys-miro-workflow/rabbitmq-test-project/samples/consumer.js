#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost/', function(err, conn) {
    if (err){
        console.log('Error',err);
        process.exit(0);
    }
    conn.createChannel(function(err, ch) {
        var q = 'test_queue';
        //Create queue
        ch.assertQueue(q, {durable: true});
        //One message at a time per worker
        ch.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        //Listen to queue
        ch.consume(q, function(msg) {
        var secs = msg.content.toString().split('.').length - 1;

        console.log(" [x] Received %s", msg.content.toString());
        setTimeout(function() {
            console.log(" [x] Done");
            //Acknoledge message is processed (otherwise rabbit will resend)
            ch.ack(msg);
        }, secs * 1000);
        }, {noAck: false});
    });
});