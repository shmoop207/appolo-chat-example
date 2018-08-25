"use strict";
import {define,singleton,inject} from 'appolo';
import    Q = require('bluebird');
import    _ = require('lodash');
import {RedisClient} from "redis";
import {IEnv} from "../../config/env/IEnv";
import {Logger} from "winston";
import {IClientData} from "../models/IClientData";
import {ICacheProvider} from "./ICacheProvider";

@define()
@singleton()
export class RedisCacheProvider implements ICacheProvider{

    @inject() redis:RedisClient;
    @inject() logger:Logger;
    @inject() env:IEnv;

    public async addMessageToCache (room:string, clientData:IClientData, message:string):Promise<void> {

        let data = {
            message: message,
            clientData: clientData
        };

        await Q.fromCallback(c=>this.redis.lpush(room, JSON.stringify(data),c));

        await Q.fromCallback(c=>this.redis.ltrim(room, 0, this.env.maxMessageCache,c));
    }

    public async getMessagesFromCache (room:string):Promise<{message:string,clientData:IClientData}[]> {
        try{
            let data  = await Q.fromCallback(c=>this.redis.lrange(room,0,this.env.maxMessageCache,c))

            let messages   = _.map(data,(msg:string)=>JSON.parse(msg));

            return messages;
        }catch (e){
            this.logger.error("failed to get messages from redis",e);
           throw e;
        }

    }

}