"use strict";
const sio = require("socket.io");
const appolo = require("appolo-http");
const redisIo = require("socket.io-redis");
const url = require("url");
module.exports = function () {
    return function (env, injector, httpServer) {
        let redisURL = url.parse(env.redis);
        let io = sio.listen(httpServer);
        io.adapter(redisIo({ host: redisURL.hostname, port: redisURL.port }));
        appolo.injector.addObject('io', io);
    };
};
//# sourceMappingURL=socket.io.js.map