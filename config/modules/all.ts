import    {App} from "appolo";
import    {LoggerModule} from "@appolo/logger";
import    {ViewModule,ViewEngines} from "@appolo/view";
import    {SocketModule} from "@appolo/socket";
import    {RedisModule} from "@appolo/redis";
import {IEnv} from "../env/IEnv";


export = async function (app:App,env:IEnv) {
    await app.module(LoggerModule);
    await app.module(new ViewModule({viewEngine:ViewEngines.nunjucks}));
    await app.module(new SocketModule({redis:env.redis}));
    await app.module(new RedisModule({connection:env.redis}));
}