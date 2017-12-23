"use strict";
import appolo = require('appolo-http');
import {SocketClient} from "../models/socketClient";

@appolo.define()
@appolo.singleton()
export class ClientsManager{
    // $config: {
    //     id: 'clientsManager',
    //     initMethod: 'initialize',
    //     singleton: true,
    //     inject: ['log','io'],
    //     properties:[{
    //         name:'createSocketClient',
    //         factoryMethod:'socketClient'
    //     }]
    // },

    @appolo.inject() private io:SocketIO.Server;
    @appolo.injectFactoryMethod("socketClient") private createSocketClient:(socket:SocketIO.Socket)=>SocketClient;


    private _clients:{[index:string]:SocketClient};

    constructor () {
        this._clients = {};
    }

    @appolo.initMethod()
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