module.exports = {
    db: "mongodb://roman:bikini@dharma.mongohq.com:10090/Qwiq",
    redis:'redis://pub-redis-11899.us-east-1-4.1.ec2.garantiadata.com:11899',
    maxMessageCache:50,
    port : 8080,
    version:require('../../package.json').version

};
