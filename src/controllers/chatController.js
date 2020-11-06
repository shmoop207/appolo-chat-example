"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const tslib_1 = require("tslib");
const route_1 = require("@appolo/route");
const inject_1 = require("@appolo/inject");
let ChatController = class ChatController extends route_1.Controller {
    getMessages(room) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let messages = yield this.cacheProvider.getMessagesFromCache(room);
            return messages;
        });
    }
};
tslib_1.__decorate([
    inject_1.inject()
], ChatController.prototype, "cacheProvider", void 0);
tslib_1.__decorate([
    route_1.get("/chat/:room/messages/"),
    tslib_1.__param(0, route_1.params("room"))
], ChatController.prototype, "getMessages", null);
ChatController = tslib_1.__decorate([
    route_1.controller()
], ChatController);
exports.ChatController = ChatController;
//# sourceMappingURL=chatController.js.map