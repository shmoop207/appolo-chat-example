import    {App} from "appolo";
import    logger = require('./logger/logger');
import    socketIo = require('./io/socket.io');
import    redis = require('./redis/redis');


export = async function (app:App) {
    await app.module(logger());
    await app.module(redis());
    await app.module(socketIo());
}