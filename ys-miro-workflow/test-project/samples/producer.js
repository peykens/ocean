#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'test_queue';
    var msg = process.argv.slice(2).join(' ') || "Hello World!";
    //Create queue - durable:true -> persist queue on rabbit restart
    ch.assertQueue(q, {durable: true});
    //Send message (as buffer) - persistent:true -> presist message on rabbit restart
    ch.sendToQueue(q, new Buffer(msg), {persistent: true});
    console.log(" [x] Sent '%s'", msg);
  });
  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});