"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("appolo-http");
let IndexController = class IndexController extends appolo.Controller {
    index(req, res) {
        res.render("../../public/chat.html", { socketUrl: this.env.socketUrl });
    }
};
tslib_1.__decorate([
    appolo.inject()
], IndexController.prototype, "env", void 0);
tslib_1.__decorate([
    appolo.pathGet("*")
], IndexController.prototype, "index", null);
IndexController = tslib_1.__decorate([
    appolo.define()
], IndexController);
exports.IndexController = IndexController;
//# sourceMappingURL=indexController.js.map