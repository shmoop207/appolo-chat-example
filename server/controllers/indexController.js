"use strict";
var appolo  =  require('appolo-express');

module.exports  = appolo.Controller.define({

    $config:{
        id: 'indexController',
        inject: ['log','env']
    },

    index:function(req,res){
        res.render("../../public/chat.html",{locals:{socketUrl:this.env.socketUrl}});
    }
});