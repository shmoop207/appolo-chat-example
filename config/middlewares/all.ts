"use strict";
import    {App} from "@appolo/core";
import consolidate = require('consolidate');
import    serve = require('serve-static');
import    path = require('path');


export = function (app: App) {


    app.route.use(serve(path.join(__dirname, "../../public")))


};
