"use strict";
import    {App} from "appolo";
import consolidate = require('consolidate');
import    serve = require('serve-static');
import    path = require('path');


export = function (app: App) {

    app.viewEngine(consolidate.nunjucks);
    app.use(serve(path.join(__dirname, "../../public")))


};