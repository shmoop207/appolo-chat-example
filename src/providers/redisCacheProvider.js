"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo_1 = require("appolo");
const Q = require("bluebird");
const _ = require("lodash");
let RedisCacheProvider = class RedisCacheProvider {
    addMessageToCache(room, clientData, message) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = {
                message: message,
                clientData: clientData
            };
            yield Q.fromCallback(c => this.redis.lpush(room, JSON.stringify(data), c));
            yield Q.fromCallback(c => this.redis.ltrim(room, 0, this.env.maxMessageCache, c));
        });
    }
    getMessagesFromCache(room) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield Q.fromCallback(c => this.redis.lrange(room, 0, this.env.maxMessageCache, c));
                let messages = _.map(data, (msg) => JSON.parse(msg));
                return messages;
            }
            catch (e) {
                this.logger.error("failed to get messages from redis", e);
                throw e;
            }
        });
    }
};
tslib_1.__decorate([
    appolo_1.inject()
], RedisCacheProvider.prototype, "redis", void 0);
tslib_1.__decorate([
    appolo_1.inject()
], RedisCacheProvider.prototype, "logger", void 0);
tslib_1.__decorate([
    appolo_1.inject()
], RedisCacheProvider.prototype, "env", void 0);
RedisCacheProvider = tslib_1.__decorate([
    appolo_1.define(),
    appolo_1.singleton()
], RedisCacheProvider);
exports.RedisCacheProvider = RedisCacheProvider;
//# sourceMappingURL=redisCacheProvider.js.map