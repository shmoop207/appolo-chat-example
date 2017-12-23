"use strict";
import appolo = require('appolo-http');
import    _ = require('lodash');
import    * as socketIo  from "socket.io"
import {SocketClient} from "../models/socketClient";


@appolo.define()
@appolo.singleton()
export class RoomsManager{


    @appolo.inject() private io:SocketIO.Server;

    private _rooms:{[index:string]:{[index:string]:SocketClient}};

    constructor () {
        this._rooms = {};
    }

    public initialize () {

    }

    public addClientToRoom (room:string, client:SocketClient) {
        if (!this._rooms[room]) {

            this._rooms[room] = {};

            this.io.sockets.emit('addroom', { room: room });
        }

        this._rooms[room][client.getId()] = client;

    }

    public removeClientFromRoom (room:string, client:SocketClient) {
        if (this._rooms[room]) {
            delete this._rooms[room][client.getId()];

            if (_.keys(this._rooms[room]).length == 0) {
                this.io.sockets.emit('removeroom', { room: room });
                delete this._rooms[room];
            }
        }
    }

    public getClientsInRoom(room:string){
        return this._rooms[room];
    }

    public getRoomsByClientId(id:string):string[]{
        return _.map(this._rooms,(room,roomName)=>{
            if(room[id]){
                return roomName;
            }
        })
    }

    public getRoomsList ():string[] {
        return _.keys(this._rooms);
    }
}