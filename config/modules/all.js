"use strict";
const tslib_1 = require("tslib");
const logger_1 = require("@appolo/logger");
const view_1 = require("@appolo/view");
const socket_1 = require("@appolo/socket");
const redis_1 = require("@appolo/redis");
module.exports = function (app, env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield app.module(logger_1.LoggerModule);
        yield app.module(new view_1.ViewModule({ viewEngine: view_1.ViewEngines.nunjucks }));
        yield app.module(new socket_1.SocketModule({ redis: env.redis }));
        yield app.module(new redis_1.RedisModule({ connection: env.redis }));
    });
};
//# sourceMappingURL=all.js.map