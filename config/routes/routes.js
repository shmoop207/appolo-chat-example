module.exports = [
    {
        path: '/chat/:room/messages/',
        controller: "chat",
        action: "getMessages"
    },

    {
        path: '/*',
        controller: "index",
        action: "index"
    }
];
