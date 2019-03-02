import {IEnv} from "./IEnv";

export =<IEnv> {
    redis:process.env.REDIS,
    maxMessageCache:50,
    port : 3000,
    version:require('../../package.json').version,
    socketUrl:'http://localhost:3000'

}
