"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("appolo-http");
let CacheProviderFactory = class CacheProviderFactory {
    get() {
        return this.redisCacheProvider;
    }
};
tslib_1.__decorate([
    appolo.inject()
], CacheProviderFactory.prototype, "redisCacheProvider", void 0);
CacheProviderFactory = tslib_1.__decorate([
    appolo.define(),
    appolo.singleton()
], CacheProviderFactory);
exports.CacheProviderFactory = CacheProviderFactory;
//# sourceMappingURL=cacheProviderFactory.js.map