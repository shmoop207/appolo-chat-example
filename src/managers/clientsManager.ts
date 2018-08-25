"use strict";
import {define,singleton,inject,initMethod,injectFactoryMethod} from 'appolo';
import {SocketClient} from "../models/socketClient";
import   {Server,Socket}  from "socket.io"

@define()
@singleton()
export class ClientsManager{

    @inject() private io:Server;
    @injectFactoryMethod("socketClient") private createSocketClient:(socket:Socket)=>SocketClient;


    private _clients:{[index:string]:SocketClient};

    constructor () {
        this._clients = {};
    }

    @initMethod()
    public initialize () {

        this.io.sockets.on('connection', this._onSocketConnection.bind(this));
    }

    public getClientById(id:string):SocketClient{
        return this._clients[id]
    }

    public _onSocketConnection (socket:SocketIO.Socket) {
        let socketClient = this.createSocketClient(socket);

        socketClient.on('disconnect', this._onSocketDisconnected,this);

        this._clients[socketClient.getId()] = socketClient;

    }

    public _onSocketDisconnected (socketClient:SocketClient) {

        socketClient.un('disconnect', this._onSocketDisconnected,this);

        let socketId = socketClient.getId();

        this._clients[socketId] =  null;
        delete this._clients[socketId];
    }
}