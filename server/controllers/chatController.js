"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("appolo-http");
let ChatController = class ChatController extends appolo.Controller {
    getMessages(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let messages = yield this.cacheProvider.getMessagesFromCache(req.params["room"]);
                this.sendOk(messages);
            }
            catch (e) {
                this.sendError(e);
            }
        });
    }
};
tslib_1.__decorate([
    appolo.inject()
], ChatController.prototype, "cacheProvider", void 0);
tslib_1.__decorate([
    appolo.pathGet("/chat/:room/messages/")
], ChatController.prototype, "getMessages", null);
ChatController = tslib_1.__decorate([
    appolo.define()
], ChatController);
exports.ChatController = ChatController;
//# sourceMappingURL=chatController.js.map