
import    {App,Injector} from "appolo";
import    redis=require("redis");
import {Logger} from "winston";
import {IEnv} from "../../env/IEnv";


export = function () {

    return function (env:IEnv,injector: Injector,logger:Logger) {

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

