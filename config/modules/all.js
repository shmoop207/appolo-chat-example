"use strict";
const tslib_1 = require("tslib");
const logger_1 = require("@appolo/logger");
const view_1 = require("@appolo/view");
const socket_1 = require("@appolo/socket");
const redis_1 = require("@appolo/redis");
module.exports = function (app, env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        app.module.use(logger_1.LoggerModule)
            .use(view_1.ViewModule.for({ viewEngine: view_1.ViewEngines.nunjucks }), socket_1.SocketModule.for({ redis: env.redis }), redis_1.RedisModule.for({ connection: env.redis }));
    });
};
//# sourceMappingURL=all.js.map