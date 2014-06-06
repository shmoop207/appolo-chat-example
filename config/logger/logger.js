var winston = require('winston'),
    appolo = require('appolo-express');

var transports = [];
    transports.push(new (winston.transports.Console)({
        json: true,
        timestamp: true,
        handleExceptions: true
    }));



var logger = new (winston.Logger)({
    transports: transports,
    exitOnError: false
});

appolo.inject.addObject('log', logger);

module.exports = logger;