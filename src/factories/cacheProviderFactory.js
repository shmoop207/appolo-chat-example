"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheProvider = void 0;
const tslib_1 = require("tslib");
const inject_1 = require("@appolo/inject");
let CacheProvider = class CacheProvider {
    get() {
        return this.redisCacheProvider;
    }
};
tslib_1.__decorate([
    inject_1.inject()
], CacheProvider.prototype, "redisCacheProvider", void 0);
CacheProvider = tslib_1.__decorate([
    inject_1.define(),
    inject_1.singleton(),
    inject_1.factory()
], CacheProvider);
exports.CacheProvider = CacheProvider;
//# sourceMappingURL=cacheProviderFactory.js.map