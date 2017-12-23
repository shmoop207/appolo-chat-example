"use strict";
import appolo  =  require('appolo-http');
import {IEnv} from "../../config/environments/IEnv";
import {ICacheProvider} from "../providers/ICacheProvider";

@appolo.define()
export class ChatController extends appolo.Controller {
    @appolo.inject() private cacheProvider:ICacheProvider;

    @appolo.pathGet("/chat/:room/messages/")
    public async getMessages(req: appolo.IRequest, res: appolo.IResponse) {

        try{
            let messages = await this.cacheProvider.getMessagesFromCache(req.params["room"]);
            this.sendOk(messages);
        }catch (e){
           this.sendError(e);
        }


    }
}