"use strict";
var appolo = require('appolo-express'),
    _ = require('lodash');

module.exports = appolo.Class.define({

    $config: {
        id: 'roomsManager',
        initMethod: 'initialize',
        singleton: true,
        inject: ['log', 'io']

    },

    constructor: function () {
        this._rooms = {};
    },

    initialize: function () {


    },

    addClientToRoom: function (room, client) {
        if (!this._rooms[room]) {
            this._rooms[room] = {};

            this.io.sockets.emit('addroom', { room: room });
        }

        this._rooms[room][client.getId()] = client;

    },

    removeClientFromRoom: function (room, client) {
        if (this._rooms[room]) {
            delete this._rooms[room][client.getId()];

            if (_.keys(this._rooms[room]).length == 0) {
                this.io.sockets.emit('removeroom', { room: room });
            }
        }
    },

    getClientsInRoom:function(room){
        return this._rooms[room];
    },

    getRoomsByClientId:function(id){
        return _.map(this._rooms,function(room,roomName){
            if(room[id]){
                return roomName;
            }
        })
    },

    getRoomsList: function () {
        return _.keys(this._rooms);
    }
});