"use strict";
const winston = require("winston");
module.exports = function () {
    return function (env, injector) {
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
    };
};
//# sourceMappingURL=logger.js.map