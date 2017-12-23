import sio = require('socket.io');
import    appolo = require('appolo-http');
import    redisIo = require('socket.io-redis');
import    url = require('url');
import {IEnv} from "../../environments/IEnv";
import  http = require('http');

export = function () {

    return function (env:IEnv,injector: appolo.Injector, httpServer: http.Server) {
        let redisURL = url.parse(env.redis);

        let io = sio.listen(httpServer);

        io.adapter(redisIo({ host: redisURL.hostname, port: redisURL.port}));

        appolo.injector.addObject('io', io);

    }
}












