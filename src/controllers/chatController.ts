"use strict";
import {controller, Controller, get, IRequest, IResponse, params} from '@appolo/route';
import {inject} from '@appolo/inject';
import {IEnv} from "../../config/env/IEnv";
import {ICacheProvider} from "../providers/ICacheProvider";

@controller()
export class ChatController extends Controller {
    @inject() private cacheProvider: ICacheProvider;

    @get("/chat/:room/messages/")
    public async getMessages(@params("room") room: string) {

        let messages = await this.cacheProvider.getMessagesFromCache(room);

        return messages

    }
}
