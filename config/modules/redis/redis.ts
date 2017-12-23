
import    appolo = require('appolo-http');
import    redis=require("redis");
import {LoggerInstance} from "winston";
import {IEnv} from "../../environments/IEnv";


export = function () {

    return function (env:IEnv,injector: appolo.Injector,logger:LoggerInstance) {

        return new Promise((resolve, reject) => {
            let client = redis.createClient(env.redis);

            client.on("error",  (err)=> {
                logger.error("Error " + err);

                reject(err)
            });

            client.on("connect", function () {
                logger.info("Redis connected");
                resolve();
            });

            injector.addObject('redis', client);
        })



    }
}

