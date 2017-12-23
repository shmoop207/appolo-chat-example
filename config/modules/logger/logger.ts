import {IEnv} from "../../environments/IEnv";

import winston = require('winston');
import    appolo = require('appolo-http');


export = function () {

    return function (env:IEnv,injector: appolo.Injector) {
        let transports = [];
        transports.push(new (winston.transports.Console)({
            json: true,
            timestamp: true,
            handleExceptions: true
        }));

        var logger = new (winston.Logger)({
            transports: transports,
            exitOnError: false
        });

        injector.addObject('logger', logger);

    }
}

