var sio = require('socket.io'),
    appolo = require('appolo-express'),
    redis = require('redis'),
    redisIo = require('socket.io-redis'),
    url = require('url'),
    client = require('../redis/redis');

var redisURL = url.parse(appolo.environment.redis);

var pub = redis.createClient(redisURL.port, redisURL.hostname );

var sub = redis.createClient(redisURL.port, redisURL.hostname);

//connect to app server
var io = sio.listen(appolo.launcher.app.server);

io.adapter(redisIo({ host: redisURL.hostname, port: redisURL.port}));

// sets the log level of socket.io, with
// log level 2 we wont see all the heartbits
// of each socket but only the handshakes and
// disconnections
io.set('log level', 2);

// setting the transports by order, if some client
// is not supporting 'websockets' then the server will
// revert to 'xhr-polling' (like Comet/Long polling).
// for more configurations got to:
// https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO
//io.set('transports', [ 'websocket', 'xhr-polling' ]);

//io.set('store', new RedisStore({
//    redis: redis, redisPub: pub, redisSub: sub, redisClient: client
//}));


appolo.inject.addObject('io', io);








