var ws = require('nodejs-websocket');

var websocket = ws.createServer(function (conn) {
    conn.on('error', function (err) {
        console.log(err);
    });
});

module.exports = websocket;