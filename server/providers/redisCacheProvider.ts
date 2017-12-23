"use strict";
import appolo = require('appolo-http');
import    Q = require('bluebird');
import    _ = require('lodash');
import {RedisClient} from "redis";
import {IEnv} from "../../config/environments/IEnv";
import {LoggerInstance} from "winston";
import {IClientData} from "../models/IClientData";
import {ICacheProvider} from "./ICacheProvider";

@appolo.define()
@appolo.singleton()
export class RedisCacheProvider implements ICacheProvider{

    @appolo.inject() redis:RedisClient;
    @appolo.inject() logger:LoggerInstance;
    @appolo.inject() env:IEnv;

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