var routes = require('./routes');

var options = {
    name: 'Auction server'
};

var server = restify.createServer(options);

// routes

module.exports = server;