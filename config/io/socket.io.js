var sio = require('socket.io'),
    appolo = require('appolo-express'),
    redis = require('redis'),
    redisIo = require('socket.io-redis'),
    url = require('url'),
    client = require('../redis/redis');

var redisURL = url.parse(appolo.environment.redis);

//connect to app server
var io = sio.listen(appolo.launcher.app.server);

io.adapter(redisIo({ host: redisURL.hostname, port: redisURL.port}));

// sets the log level of socket.io, with
// log level 2 we wont see all the heartbits
// of each socket but only the handshakes and
// disconnections
io.set('log level', 2);



appolo.inject.addObject('io', io);








