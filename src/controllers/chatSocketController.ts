"use strict";
import {inject} from '@appolo/inject';
import {SocketController,socket,action} from '@appolo/socket';
import    _ = require('lodash');
import {IClientData} from "../models/IClientData";
import {RoomsManager} from "../managers/roomsManager";
import {IMessage} from "../models/IMessage";
import {ICacheProvider} from "../providers/ICacheProvider";

@socket()
export class ChatSocketController extends SocketController {



    private _clientData: IClientData;

    @inject() private roomsManager: RoomsManager;

    @inject() private cacheProvider: ICacheProvider;


    protected async onInitialized() {

        this._clientData = {
            clientId: this.id,
        };

    }

    @action("nickname")
    private _onNickname(data: { nickname: string }) {

        this._clientData.nickname = data.nickname;

        this.socket.emit('ready', {clientId: this.id});

        this._subscribe({room: 'lobby'});

        this.socket.emit('roomslist', {rooms: this.roomsManager.getRoomsList()});
    }


    public get clientData():IClientData{
        return this._clientData
    }

    public getNickname(): string {
        return this._clientData.nickname;
    }

    @action("chatmessage")
    private async _chatMessage(data:IMessage) {
        this.socket.broadcast.to(data.room).emit('chatmessage', {
            client: this._clientData,
            message: data.message,
            room: data.room
        });

        await this.cacheProvider.addMessageToCache(data.room, this._clientData, data.message);
    }

    @action("subscribe")
    public async _subscribe(data:{room:string}) {

        this.roomsManager.addClientToRoom(data.room, this);

        // subscribe the client to the room
        this.socket.join(data.room);

        // update all other clients about the online
        this._updatePresence(data.room, 'online');

        // send to the client a list of all subscribed clients in this room
        let clients = [];
        _.forEach(this.roomsManager.getClientsInRoom(data.room),  (client)=> {
            if (client.id != this.id) {
                clients.push(client.clientData)
            }
        });

        this.socket.emit('roomclients', {room: data.room, clients: clients});

        let messages = await this.cacheProvider.getMessagesFromCache(data.room);

        messages.reverse();

        let output = _.map(messages,  (msgData)=> {

            return {client: msgData.clientData, message: msgData.message, room: data.room}
        });

        this.socket.emit('roomChatMessages', output);
    }

    @action("unsubscribe")
    public _unSubscribe(data:{room:string}) {
        // update all other clients about the offline
        // presence
        this._updatePresence(data.room, 'offline');

        // remove the client from socket.io room
        this.socket.leave(data.room);

        this.roomsManager.removeClientFromRoom(data.room, this);

    }

    @action("disconnect")
    private _disconnect() {

        _.forEach(this.roomsManager.getRoomsByClientId(this.id),  (roomName)=> {
            this._unSubscribe({room: roomName});
        });

    }

    private _updatePresence(room:string, state:string) {

        // by using 'socket.broadcast' we can send/emit
        // a message/event to all other clients except
        // the sender himself
        this.socket.broadcast.to(room).emit('presence', {client: this.clientData, state: state, room: room});
    }


}
