"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("appolo-http");
const _ = require("lodash");
let SocketClient = class SocketClient extends appolo.EventDispatcher {
    constructor(socket) {
        super();
        this._socket = socket;
        this._id = _.uniqueId();
        this._clientData = {
            clientId: this._id,
        };
    }
    initialize() {
        this._socket.on('nickname', this._onNickname.bind(this));
        this._socket.on('chatmessage', this._chatMessage.bind(this));
        this._socket.on('subscribe', this._subscribe.bind(this));
        this._socket.on('unsubscribe', this._unSubscribe.bind(this));
        this._socket.on('disconnect', this._disconnect.bind(this));
    }
    _onNickname(data) {
        this._clientData.nickname = data.nickname;
        this._socket.emit('ready', { clientId: this._id });
        this._subscribe({ room: 'lobby' });
        this._socket.emit('roomslist', { rooms: this.roomsManager.getRoomsList() });
    }
    getId() {
        return this._id;
    }
    get clientData() {
        return this._clientData;
    }
    getNickname() {
        return this._clientData.nickname;
    }
    _chatMessage(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this._socket.broadcast.to(data.room).emit('chatmessage', {
                client: this._clientData,
                message: data.message,
                room: data.room
            });
            yield this.cacheProvider.addMessageToCache(data.room, this._clientData, data.message);
        });
    }
    _subscribe(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.roomsManager.addClientToRoom(data.room, this);
            // subscribe the client to the room
            this._socket.join(data.room);
            // update all other clients about the online
            this._updatePresence(data.room, 'online');
            // send to the client a list of all subscribed clients in this room
            let clients = [];
            _.forEach(this.roomsManager.getClientsInRoom(data.room), (client) => {
                if (client.getId() != this._id) {
                    clients.push(client.clientData);
                }
            });
            this._socket.emit('roomclients', { room: data.room, clients: clients });
            let messages = yield this.cacheProvider.getMessagesFromCache(data.room);
            messages.reverse();
            let output = _.map(messages, (msgData) => {
                return { client: msgData.clientData, message: msgData.message, room: data.room };
            });
            this._socket.emit('roomChatMessages', output);
        });
    }
    _unSubscribe(data) {
        // update all other clients about the offline
        // presence
        this._updatePresence(data.room, 'offline');
        // remove the client from socket.io room
        this._socket.leave(data.room);
        this.roomsManager.removeClientFromRoom(data.room, this);
    }
    _disconnect() {
        _.forEach(this.roomsManager.getRoomsByClientId(this._id), (roomName) => {
            this._unSubscribe({ room: roomName });
        });
        this.fireEvent('disconnect', this);
    }
    _updatePresence(room, state) {
        // by using 'socket.broadcast' we can send/emit
        // a message/event to all other clients except
        // the sender himself
        this._socket.broadcast.to(room).emit('presence', { client: this.clientData, state: state, room: room });
    }
};
tslib_1.__decorate([
    appolo.inject()
], SocketClient.prototype, "roomsManager", void 0);
tslib_1.__decorate([
    appolo.inject()
], SocketClient.prototype, "cacheProvider", void 0);
tslib_1.__decorate([
    appolo.initMethod()
], SocketClient.prototype, "initialize", null);
SocketClient = tslib_1.__decorate([
    appolo.define()
], SocketClient);
exports.SocketClient = SocketClient;
//# sourceMappingURL=socketClient.js.map