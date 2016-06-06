var expect  = require('chai').expect;
var nconf = require('nconf');

nconf.file('./config.json');

var users = require('../services/user');

// var index = require('../index');
//
// nconf.defaults({
//     database: {
//         filename: "test.db"
//     }
// });
//

describe("Services", function() {
    describe("Login", function() {
        it("returns status 200", function(done) {
            users.getUserByName('username', function(err, user) {
                console.log(user);
                done();
            });
        });
    });
});