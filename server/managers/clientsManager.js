"use strict";
var appolo = require('appolo-express');

module.exports = appolo.Class.define({

    $config: {
        id: 'clientsManager',
        initMethod: 'initialize',
        singleton: true,
        inject: ['log','io'],
        properties:[{
            name:'createSocketClient',
            factoryMethod:'socketClient'
        }]
    },

    constructor: function () {
        this._clients = {};
    },

    initialize: function () {

        this.io.sockets.on('connection', this._onSocketConnection.bind(this));
    },

    getClientById:function(id){
        return this._clients[id]
    },

    _onSocketConnection: function (socket) {
        var socketClient = this.createSocketClient(socket);

        socketClient.on('disconnect', this._onSocketDisconnected,this);

        this._clients[socketClient.getId()] = socketClient;

    },

    _onSocketDisconnected: function (socketClient) {

        socketClient.un('disconnect', this._onSocketDisconnected,this);

        var socketId = socketClient.getId();

        this._clients[socketId] =  null;
        delete this._clients[socketId];
    }
});