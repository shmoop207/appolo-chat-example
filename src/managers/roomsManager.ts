"use strict";
import {define,singleton,inject} from '@appolo/inject';
import    _ = require('lodash');
import   {SocketProvider}  from "@appolo/socket"
import {ChatSocketController} from "../controllers/chatSocketController";


@define()
@singleton()
export class RoomsManager{


    @inject() private socketProvider:SocketProvider;

    private _rooms:{[index:string]:{[index:string]:ChatSocketController}};

    constructor () {
        this._rooms = {};
    }

    public initialize () {

    }

    public addClientToRoom (room:string, client:ChatSocketController) {
        if (!this._rooms[room]) {

            this._rooms[room] = {};

            this.socketProvider.sendToAll('addroom', { room: room });
        }

        this._rooms[room][client.id] = client;

    }

    public removeClientFromRoom (room:string, client:ChatSocketController) {
        if (this._rooms[room]) {
            delete this._rooms[room][client.id];

            if (_.keys(this._rooms[room]).length == 0) {
                this.socketProvider.sendToAll('removeroom', { room: room });
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
