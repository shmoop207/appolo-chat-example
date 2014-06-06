var winston = require('winston'),
    appolo = require('appolo-express');

var transports = [];

//if (process.env.NODE_ENV == "production" || process.env.NODE_ENV == "staging") {
//
//    transports.push(new Sentry({
//        level: 'warn',
//        dsn: "https://164679e3b3e44f65821999191bf465ab:263a8b4fde744c8d85c0374f7500c727@app.getsentry.com/18386",
//        json: true,
//        timestamp: true,
//        handleExceptions: true,
//        patchGlobal: true
//    }));
//
//
//
//
//}
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