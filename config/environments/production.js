"use strict";

module.exports = {
    name:'production',
    db: 'mongodb://heroku:lngNJt9cfr0wtnKfPeZ7P8yK5BMMhtbF8jMHuuWd9RirtcAOrXB_OLEDNModP4wMPvJIdZAs54CbGBS1FoSqGw@dharma.mongohq.com:10002/app16631802',
    radis:'redis://rediscloud:qPzNa8jLSjPORYEo@pub-redis-17672.us-east-1-1.2.ec2.garantiadata.com:17672',


    qwiqServerUrl:'http://qwiq-it-app.herokuapp.com',
    qwiqPluginsUrl:'http://cdn.qwiq.it/static',
    staticUrl:'http://cdn.qwiq.it//static'
};

//heroku config:get MONGOHQ_URL


//mongodb://heroku:lngNJt9cfr0wtnKfPeZ7P8yK5BMMhtbF8jMHuuWd9RirtcAOrXB_OLEDNModP4wMPvJIdZAs54CbGBS1FoSqGw@dharma.mongohq.com:10002/app16631802