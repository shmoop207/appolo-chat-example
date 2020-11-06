"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexController = void 0;
const tslib_1 = require("tslib");
const route_1 = require("@appolo/route");
const inject_1 = require("@appolo/inject");
const view_1 = require("@appolo/view");
let IndexController = class IndexController extends route_1.Controller {
    index(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return { socketUrl: this.env.socketUrl };
        });
    }
};
tslib_1.__decorate([
    inject_1.inject()
], IndexController.prototype, "env", void 0);
tslib_1.__decorate([
    route_1.get("*"),
    view_1.view("../../public/chat.html")
], IndexController.prototype, "index", null);
IndexController = tslib_1.__decorate([
    route_1.controller()
], IndexController);
exports.IndexController = IndexController;
//# sourceMappingURL=indexController.js.map