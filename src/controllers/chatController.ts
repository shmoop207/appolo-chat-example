"use strict";
import {controller, Controller, get, inject, IRequest, IResponse} from 'appolo';
import {IEnv} from "../../config/env/IEnv";
import {ICacheProvider} from "../providers/ICacheProvider";

@controller()
export class ChatController extends Controller {
    @inject() private cacheProvider:ICacheProvider;

    @get("/chat/:room/messages/")
    public async getMessages(req: IRequest, res: IResponse) {

        try{
            let messages = await this.cacheProvider.getMessagesFromCache(req.params["room"]);
            this.sendOk(messages);
        }catch (e){
           this.sendError(e);
        }


    }
}