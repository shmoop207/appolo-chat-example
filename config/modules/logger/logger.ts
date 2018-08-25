import {IEnv} from "../../env/IEnv";

import winston = require('winston');
import    {App,Injector} from "appolo";


export = function () {

    return function (env:IEnv,injector: Injector) {
        const logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            transports: [

            ]
        });

        logger.add(new winston.transports.Console({
            format: winston.format.simple()
        }));

        injector.addObject('logger', logger);

    }
}

