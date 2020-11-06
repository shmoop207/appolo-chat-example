"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsManager = void 0;
const tslib_1 = require("tslib");
const inject_1 = require("@appolo/inject");
const _ = require("lodash");
let RoomsManager = class RoomsManager {
    constructor() {
        this._rooms = {};
    }
    initialize() {
    }
    addClientToRoom(room, client) {
        if (!this._rooms[room]) {
            this._rooms[room] = {};
            this.socketProvider.sendToAll('addroom', { room: room });
        }
        this._rooms[room][client.id] = client;
    }
    removeClientFromRoom(room, client) {
        if (this._rooms[room]) {
            delete this._rooms[room][client.id];
            if (_.keys(this._rooms[room]).length == 0) {
                this.socketProvider.sendToAll('removeroom', { room: room });
                delete this._rooms[room];
            }
        }
    }
    getClientsInRoom(room) {
        return this._rooms[room];
    }
    getRoomsByClientId(id) {
        return _.map(this._rooms, (room, roomName) => {
            if (room[id]) {
                return roomName;
            }
        });
    }
    getRoomsList() {
        return _.keys(this._rooms);
    }
};
tslib_1.__decorate([
    inject_1.inject()
], RoomsManager.prototype, "socketProvider", void 0);
RoomsManager = tslib_1.__decorate([
    inject_1.define(),
    inject_1.singleton()
], RoomsManager);
exports.RoomsManager = RoomsManager;
//# sourceMappingURL=roomsManager.js.map