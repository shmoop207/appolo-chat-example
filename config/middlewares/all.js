"use strict";
const consolidate = require("consolidate");
const serve = require("serve-static");
const path = require("path");
module.exports = function (app) {
    app.viewEngine(consolidate.nunjucks);
    app.use(serve(path.join(__dirname, "../../public")));
};
//# sourceMappingURL=all.js.map