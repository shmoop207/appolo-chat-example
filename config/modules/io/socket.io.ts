import sio = require('socket.io');
import    {App,Injector} from "appolo";
import    redisIo = require('socket.io-redis');
import    url = require('url');
import {IEnv} from "../../env/IEnv";
import  http = require('http');

export = function () {

    return function (app:App,env:IEnv,injector: Injector, httpServer: http.Server) {

        let io = sio.listen(app.server);

        io.adapter(redisIo(env.redis));

        injector.addObject('io', io);

    }
}












