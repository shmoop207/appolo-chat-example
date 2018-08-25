"use strict";
const tslib_1 = require("tslib");
const logger = require("./logger/logger");
const socketIo = require("./io/socket.io");
const redis = require("./redis/redis");
module.exports = function (app) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield app.module(logger());
        yield app.module(redis());
        yield app.module(socketIo());
    });
};
//# sourceMappingURL=all.js.map