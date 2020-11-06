"use strict";
import {createApp} from '@appolo/core';

(async function init() {

    try {

        await createApp().launch();

    } catch (e) {
        console.error("failed to launch ", e.stack);
        process.exit(1)
    }

})();

