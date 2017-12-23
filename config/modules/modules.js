"use strict";
const tslib_1 = require("tslib");
const appolo = require("appolo-http");
const logger = require("./logger/logger");
const socketIo = require("./io/socket.io");
const redis = require("./redis/redis");
module.exports = function () {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield appolo.load(logger());
        yield appolo.load(redis());
        yield appolo.load(socketIo());
    });
};
//# sourceMappingURL=modules.js.map