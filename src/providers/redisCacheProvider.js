"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCacheProvider = void 0;
const tslib_1 = require("tslib");
const inject_1 = require("@appolo/inject");
const _ = require("lodash");
let RedisCacheProvider = class RedisCacheProvider {
    addMessageToCache(room, clientData, message) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = {
                message: message,
                clientData: clientData
            };
            yield this.redisProvider.redis.lpush(room, JSON.stringify(data));
            yield this.redisProvider.redis.ltrim(room, 0, this.env.maxMessageCache);
        });
    }
    getMessagesFromCache(room) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield this.redisProvider.redis.lrange(room, 0, this.env.maxMessageCache);
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
    inject_1.inject()
], RedisCacheProvider.prototype, "redisProvider", void 0);
tslib_1.__decorate([
    inject_1.inject()
], RedisCacheProvider.prototype, "logger", void 0);
tslib_1.__decorate([
    inject_1.inject()
], RedisCacheProvider.prototype, "env", void 0);
RedisCacheProvider = tslib_1.__decorate([
    inject_1.define(),
    inject_1.singleton()
], RedisCacheProvider);
exports.RedisCacheProvider = RedisCacheProvider;
//# sourceMappingURL=redisCacheProvider.js.map