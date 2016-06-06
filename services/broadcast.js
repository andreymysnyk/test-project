var websocket = require('../server-websocket');

exports.broadcast = function (data) {
    websocket.connections.forEach(function (conn) {
        conn.sendText(JSON.stringify(data));
    })
};