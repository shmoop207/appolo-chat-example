"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo_1 = require("appolo");
let CacheProvider = class CacheProvider {
    get() {
        return this.redisCacheProvider;
    }
};
tslib_1.__decorate([
    appolo_1.inject()
], CacheProvider.prototype, "redisCacheProvider", void 0);
CacheProvider = tslib_1.__decorate([
    appolo_1.define(),
    appolo_1.singleton(),
    appolo_1.factory()
], CacheProvider);
exports.CacheProvider = CacheProvider;
//# sourceMappingURL=cacheProviderFactory.js.map