var redisUrl = require('redis'),
    appolo = require('appolo-express'),
    logger =  require('../logger/logger'),
    redis=require("redis"),
    url=require("url");

var redisURL = url.parse(appolo.environment.redis);
var client = redis.createClient(redisURL.port, redisURL.hostname);
//client.auth(redisURL.auth.split(":")[1]);


client.on("error", function (err) {
    logger.error("Error " + err);
});

client.on("connect", function (err) {
    logger.info("Redis connected");
});

appolo.inject.addObject('redis', client);
module.exports = client;