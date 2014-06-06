"use strict";
var appolo = require('appolo-express');

module.exports = appolo.Class.define({
    $config: {
        id: 'cacheProviderFactory',
        singleton: true,
        inject: ['log','redisCacheProvider']
    },

    get:function(){
        return this.redisCacheProvider;
    }
});