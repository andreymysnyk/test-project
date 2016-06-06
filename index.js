// configurations
var nconf = require('nconf');
nconf.file('./config.json');

// server
var server = require('./server');
server.listen(nconf.get('server_port'), function () {
    console.log('Auction server listening');
});

// start auction schedule
require('./services/auction-schedule');
