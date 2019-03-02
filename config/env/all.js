"use strict";
module.exports = {
    redis: process.env.REDIS,
    maxMessageCache: 50,
    port: 3000,
    version: require('../../package.json').version,
    socketUrl: 'http://localhost:3000'
};
//# sourceMappingURL=all.js.map