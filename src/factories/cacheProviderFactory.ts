"use strict";
import {define,singleton,inject,initMethod,injectFactoryMethod,IFactory,factory} from 'appolo';
import {RedisCacheProvider} from "../providers/redisCacheProvider";
import {ICacheProvider} from "../providers/ICacheProvider";

@define()
@singleton()
@factory()
export class CacheProvider implements IFactory<ICacheProvider>{

    @inject() redisCacheProvider:RedisCacheProvider;

    public get():ICacheProvider{
        return this.redisCacheProvider;
    }
}