"use strict";
const winston = require("winston");
module.exports = function () {
    return function (env, injector) {
        const logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            transports: []
        });
        logger.add(new winston.transports.Console({
            format: winston.format.simple()
        }));
        injector.addObject('logger', logger);
    };
};
//# sourceMappingURL=logger.js.map