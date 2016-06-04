var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./routes');

var server = express();

server.use(bodyParser.json());       // to support JSON-encoded bodies
server.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

server.use('/user', routes.user);
server.use(express.static('public'));


module.exports = server;