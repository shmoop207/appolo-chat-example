"use strict";
import {define,singleton,inject,EventDispatcher,initMethod} from 'appolo';
import    _ = require('lodash');
import {IClientData} from "./IClientData";
import {RoomsManager} from "../managers/roomsManager";
import {IMessage} from "./IMessage";
import {Socket} from "socket.io";
import {ICacheProvider} from "../providers/ICacheProvider";

@define()
export class SocketClient extends EventDispatcher {



    private _socket: Socket;
    private _id: string;
    private _clientData: IClientData;

    @inject() private roomsManager: RoomsManager;

    @inject() private cacheProvider: ICacheProvider;


    constructor(socket: Socket) {
        super();
        this._socket = socket;
        this._id = _.uniqueId();

        this._clientData = {
            clientId: this._id,
        };
    }

    @initMethod()
    public initialize() {

        this._socket.on('nickname', this._onNickname.bind(this));
        this._socket.on('chatmessage', this._chatMessage.bind(this));
        this._socket.on('subscribe', this._subscribe.bind(this));
        this._socket.on('unsubscribe', this._unSubscribe.bind(this));
        this._socket.on('disconnect', this._disconnect.bind(this));

    }

    private _onNickname(data: { nickname: string }) {

        this._clientData.nickname = data.nickname;

        this._socket.emit('ready', {clientId: this._id});

        this._subscribe({room: 'lobby'});

        this._socket.emit('roomslist', {rooms: this.roomsManager.getRoomsList()});
    }

    public getId(): string {
        return this._id
    }

    public get clientData():IClientData{
        return this._clientData
    }

    public getNickname(): string {
        return this._clientData.nickname;
    }

    private async _chatMessage(data:IMessage) {
        this._socket.broadcast.to(data.room).emit('chatmessage', {
            client: this._clientData,
            message: data.message,
            room: data.room
        });

        await this.cacheProvider.addMessageToCache(data.room, this._clientData, data.message);
    }

    public async _subscribe(data:{room:string}) {

        this.roomsManager.addClientToRoom(data.room, this);

        // subscribe the client to the room
        this._socket.join(data.room);

        // update all other clients about the online
        this._updatePresence(data.room, 'online');

        // send to the client a list of all subscribed clients in this room
        let clients = [];
        _.forEach(this.roomsManager.getClientsInRoom(data.room),  (client)=> {
            if (client.getId() != this._id) {
                clients.push(client.clientData)
            }
        });

        this._socket.emit('roomclients', {room: data.room, clients: clients});

        let messages = await this.cacheProvider.getMessagesFromCache(data.room);

        messages.reverse();

        let output = _.map(messages,  (msgData)=> {

            return {client: msgData.clientData, message: msgData.message, room: data.room}
        });

        this._socket.emit('roomChatMessages', output);
    }

    public _unSubscribe(data:{room:string}) {
        // update all other clients about the offline
        // presence
        this._updatePresence(data.room, 'offline');

        // remove the client from socket.io room
        this._socket.leave(data.room);

        this.roomsManager.removeClientFromRoom(data.room, this);

    }

    public _disconnect() {

        _.forEach(this.roomsManager.getRoomsByClientId(this._id),  (roomName)=> {
            this._unSubscribe({room: roomName});
        });

        this.fireEvent('disconnect', this);
    }

    public _updatePresence(room:string, state:string) {

        // by using 'socket.broadcast' we can send/emit
        // a message/event to all other clients except
        // the sender himself
        this._socket.broadcast.to(room).emit('presence', {client: this.clientData, state: state, room: room});
    }


}