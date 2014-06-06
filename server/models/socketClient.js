"use strict";
var EventDispatcher = require('appolo-express').EventDispatcher,
    _ = require('lodash');


module.exports = EventDispatcher.define({

    $config: {
        id: 'socketClient',
        initMethod: 'initialize',
        inject: ['log', 'redis', 'io', 'roomManager','cacheProvider']
    },

    constructor: function (socket) {
        this._socket = socket;
        this._id = _.uniqueId();

        this.clientData = {
            clientId :this._id
        };

        this.rooms = {};

    },

    initialize: function () {

        this._socket.on('nickname', this._onNickname.bind(this));
        this._socket.on('chatmessage', this._chatMessage.bind(this));
        this._socket.on('subscribe', this._subscribe.bind(this));
        this._socket.on('unsubscribe', this._unSubscribe.bind(this));
        this._socket.on('disconnect', this._disconnect.bind(this));

    },

    _onNickname: function (data) {

        this.clientData.nickname = data.nickname;

        this._socket.emit('ready', { clientId: this._id });

        this._subscribe({ room: 'lobby' });

        this._socket.emit('roomslist', { rooms: this.roomManager.getRoomsList() });
    },

    getId: function () {
        return this._id
    },

    getNickname: function () {
        return this.clientData.nickname;
    },

    _chatMessage: function (data) {
        this._socket.broadcast.to(data.room).emit('chatmessage', { client: this.clientData, message: data.message, room: data.room });

        this.cacheProvider.addMessageToCache(data.room,this.clientData,data.message);
    },

    _subscribe: function (data) {

        this.roomManager.addClientToRoom(data.room, this);

        // subscribe the client to the room
        this._socket.join(data.room);

        // update all other clients about the online
        this._updatePresence(data.room, 'online');

        // send to the client a list of all subscribed clients in this room
        var clients = [];
        _.forEach(this.roomManager.getClientsInRoom(data.room), function (client) {
            if (client.getId() != this._id) {
                clients.push(client.clientData)
            }
        }, this);

        this._socket.emit('roomclients', { room: data.room, clients: clients });

        this.cacheProvider.getMessagesFromCache(data.room).then(this._onCacheMessagesLoad.bind(this,data.room));

    },

    _onCacheMessagesLoad:function(room,messages){
        _.forEach(messages,function(msgData){
            this._socket.emit('chatmessage', { client: msgData.clientData, message: msgData.message, room: room });
        },this)
    },

    _unSubscribe: function (data) {
        // update all other clients about the offline
        // presence
        this._updatePresence(data.room, 'offline');

        // remove the client from socket.io room
        this._socket.leave(data.room);

        this.roomManager.removeClientFromRoom(data.room, this);

    },

    _disconnect: function (data) {

        _.forEach(this.roomManager.getRoomsByClientId(this._id), function (roomName) {
            this._unSubscribe({ room: roomName });
        }, this);

        this.fireEvent('disconnect', this);
    },

    _updatePresence: function (room, state) {

        // by using 'socket.broadcast' we can send/emit
        // a message/event to all other clients except
        // the sender himself
        this._socket.broadcast.to(room).emit('presence', { client: this.clientData, state: state, room: room });
    }


});