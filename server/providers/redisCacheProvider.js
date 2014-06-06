"use strict";
var appolo = require('appolo-express'),
    Q = require('q'),
    _ = require('lodash');

module.exports = appolo.Class.define({

    $config: {
        id: 'redisCacheProvider',
        singleton: true,
        inject: ['log', 'redis','env']
    },

    addMessageToCache: function (room, clientData, message) {

        var data = {
            message: message,
            clientData: clientData
        }

        this.redis.lpush(room, JSON.stringify(data));
        this.redis.ltrim(room, 0, this.env.maxMessageCache);
    },

    getMessagesFromCache: function (room) {
        var deferred = Q.defer();

        this.redis.lrange(room,0,this.env.maxMessageCache,this._onMessageLoad.bind(this,deferred))

        return deferred.promise;
    },
    _onMessageLoad:function(deferred,err,data){
        if(err){
            this.log.err("failed to get messages from redis",err)
            deferred.reject([]);
            return;
        }

        var messages   = _.map(data,function(msg){return JSON.parse(msg)});

        deferred.resolve(messages);
    }


});