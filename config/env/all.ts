import {IEnv} from "./IEnv";

export =<IEnv> {
    redis:'redis://rediscloud:0JedGx6JoOwaN6gkxldprsIAKmvlcg4U@redis-17407.c15.us-east-1-2.ec2.cloud.redislabs.com:17407',
    maxMessageCache:50,
    port : 8080,
    version:require('../../package.json').version,
    socketUrl:'http://localhost:8080'

}
