"use strict";
import appolo = require('appolo-http');
import consolidate = require('consolidate');
import    serve = require('serve-static');
import    path = require('path');


export = function (app: appolo.App) {

    app.viewEngine(consolidate.nunjucks);
    app.use(serve(path.join(__dirname, "../../public")))


};