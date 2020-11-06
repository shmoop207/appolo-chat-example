import {App} from "@appolo/core";
import {LoggerModule} from "@appolo/logger";
import {ViewModule, ViewEngines} from "@appolo/view";
import {SocketModule} from "@appolo/socket";
import {RedisModule} from "@appolo/redis";
import {IEnv} from "../env/IEnv";


export = async function (app: App, env: IEnv) {
    app.module.use(LoggerModule)
        .use(ViewModule.for({viewEngine: ViewEngines.nunjucks}),
            SocketModule.for({redis: env.redis}),
            RedisModule.for({connection: env.redis}))

}
