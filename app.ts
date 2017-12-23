"use strict";
import appolo  = require('appolo-http');

(async function init() {

    try {

        await appolo.launch();

    } catch (e) {
        console.error("failed to launch ", e.stack);
        process.exit(1)
    }

})();

