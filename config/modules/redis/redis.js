"use strict";
const redis = require("redis");
module.exports = function () {
    return function (env, injector, logger) {
        return new Promise((resolve, reject) => {
            let client = redis.createClient(env.redis);
            client.on("error", (err) => {
                logger.error("Error " + err);
                reject(err);
            });
            client.on("connect", function () {
                logger.info("Redis connected");
                resolve();
            });
            injector.addObject('redis', client);
        });
    };
};
//# sourceMappingURL=redis.js.map