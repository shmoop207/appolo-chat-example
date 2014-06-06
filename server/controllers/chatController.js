"use strict";
var appolo  =  require('appolo-express');

module.exports  = appolo.Controller.define({

    $config:{
        id: 'chatController',
        inject: ['log','cacheProvider']
    },

    getMessages:function(req,res){
        this.cacheProvider.getMessagesFromCache(req.param("room"))
            .then(this.jsonSuccess.bind(this))
            .fail(this.serverError.bind(this));
    }
});