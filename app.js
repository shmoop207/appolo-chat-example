"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo_1 = require("appolo");
(function init() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            yield appolo_1.createApp().launch();
        }
        catch (e) {
            console.error("failed to launch ", e.stack);
            process.exit(1);
        }
    });
})();
//# sourceMappingURL=app.js.map