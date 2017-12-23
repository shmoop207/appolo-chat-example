import    appolo = require('appolo-http');
import    logger = require('./logger/logger');
import    socketIo = require('./io/socket.io');
import    redis = require('./redis/redis');


export = async function () {
    await appolo.load(logger());
    await appolo.load(redis());
    await appolo.load(socketIo());
}