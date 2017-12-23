"use strict";
import appolo = require('appolo-http');
import {RedisCacheProvider} from "../providers/redisCacheProvider";
import {ICacheProvider} from "../providers/ICacheProvider";

@appolo.define()
@appolo.singleton()
export class CacheProviderFactory implements appolo.IFactory<ICacheProvider>{

    @appolo.inject() redisCacheProvider:RedisCacheProvider;

    public get():ICacheProvider{
        return this.redisCacheProvider;
    }
}