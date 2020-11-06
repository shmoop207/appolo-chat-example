"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSocketController = void 0;
const tslib_1 = require("tslib");
const inject_1 = require("@appolo/inject");
const socket_1 = require("@appolo/socket");
const _ = require("lodash");
let ChatSocketController = class ChatSocketController extends socket_1.SocketController {
    onInitialized() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this._clientData = {
                clientId: this.id,
            };
        });
    }
    _onNickname(data) {
        this._clientData.nickname = data.nickname;
        this.socket.emit('ready', { clientId: this.id });
        this._subscribe({ room: 'lobby' });
        this.socket.emit('roomslist', { rooms: this.roomsManager.getRoomsList() });
    }
    get clientData() {
        return this._clientData;
    }
    getNickname() {
        return this._clientData.nickname;
    }
    _chatMessage(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.socket.broadcast.to(data.room).emit('chatmessage', {
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
            this.socket.join(data.room);
            // update all other clients about the online
            this._updatePresence(data.room, 'online');
            // send to the client a list of all subscribed clients in this room
            let clients = [];
            _.forEach(this.roomsManager.getClientsInRoom(data.room), (client) => {
                if (client.id != this.id) {
                    clients.push(client.clientData);
                }
            });
            this.socket.emit('roomclients', { room: data.room, clients: clients });
            let messages = yield this.cacheProvider.getMessagesFromCache(data.room);
            messages.reverse();
            let output = _.map(messages, (msgData) => {
                return { client: msgData.clientData, message: msgData.message, room: data.room };
            });
            this.socket.emit('roomChatMessages', output);
        });
    }
    _unSubscribe(data) {
        // update all other clients about the offline
        // presence
        this._updatePresence(data.room, 'offline');
        // remove the client from socket.io room
        this.socket.leave(data.room);
        this.roomsManager.removeClientFromRoom(data.room, this);
    }
    _disconnect() {
        _.forEach(this.roomsManager.getRoomsByClientId(this.id), (roomName) => {
            this._unSubscribe({ room: roomName });
        });
    }
    _updatePresence(room, state) {
        // by using 'socket.broadcast' we can send/emit
        // a message/event to all other clients except
        // the sender himself
        this.socket.broadcast.to(room).emit('presence', { client: this.clientData, state: state, room: room });
    }
};
tslib_1.__decorate([
    inject_1.inject()
], ChatSocketController.prototype, "roomsManager", void 0);
tslib_1.__decorate([
    inject_1.inject()
], ChatSocketController.prototype, "cacheProvider", void 0);
tslib_1.__decorate([
    socket_1.action("nickname")
], ChatSocketController.prototype, "_onNickname", null);
tslib_1.__decorate([
    socket_1.action("chatmessage")
], ChatSocketController.prototype, "_chatMessage", null);
tslib_1.__decorate([
    socket_1.action("subscribe")
], ChatSocketController.prototype, "_subscribe", null);
tslib_1.__decorate([
    socket_1.action("unsubscribe")
], ChatSocketController.prototype, "_unSubscribe", null);
tslib_1.__decorate([
    socket_1.action("disconnect")
], ChatSocketController.prototype, "_disconnect", null);
ChatSocketController = tslib_1.__decorate([
    socket_1.socket()
], ChatSocketController);
exports.ChatSocketController = ChatSocketController;
//# sourceMappingURL=chatSocketController.js.map