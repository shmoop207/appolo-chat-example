"use strict";
const sio = require("socket.io");
const redisIo = require("socket.io-redis");
module.exports = function () {
    return function (app, env, injector, httpServer) {
        let io = sio.listen(app.server);
        io.adapter(redisIo(env.redis));
        injector.addObject('io', io);
    };
};
//# sourceMappingURL=socket.io.js.map