"use strict";
import {define,singleton,inject,IFactory,factory} from '@appolo/inject';
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
