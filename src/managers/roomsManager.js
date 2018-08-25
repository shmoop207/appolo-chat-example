"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo_1 = require("appolo");
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
            this.io.sockets.emit('addroom', { room: room });
        }
        this._rooms[room][client.getId()] = client;
    }
    removeClientFromRoom(room, client) {
        if (this._rooms[room]) {
            delete this._rooms[room][client.getId()];
            if (_.keys(this._rooms[room]).length == 0) {
                this.io.sockets.emit('removeroom', { room: room });
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
    appolo_1.inject()
], RoomsManager.prototype, "io", void 0);
RoomsManager = tslib_1.__decorate([
    appolo_1.define(),
    appolo_1.singleton()
], RoomsManager);
exports.RoomsManager = RoomsManager;
//# sourceMappingURL=roomsManager.js.map