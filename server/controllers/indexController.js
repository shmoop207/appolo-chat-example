"use strict";
var appolo  =  require('appolo-express');

module.exports  = appolo.Controller.define({

    $config:{
        id: 'indexController',
        inject: ['log']
    },

    index:function(req,res){
        res.render("../../public/index.html");
    }
});