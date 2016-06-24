var assert = require('chai').assert;
var nconf = require('nconf');

var database = require('../database');
var users = require('../services/user');

describe("Services", function() {
    beforeEach(function (done) {
        // clean up tables except item
        database.runQuery(function(err, db) {
            db.serialize(function () {
                db.run('DELETE FROM user', function (err) {
                    assert.equal(err, null);
                });
                db.run('DELETE FROM user_item', function (err) {
                    assert.equal(err, null);
                });
                db.run('DELETE FROM billing', function (err) {
                    assert.equal(err, null);
                });
                db.run('DELETE FROM auction', function (err) {
                    assert.equal(err, null);
                    done();
                });
            });
        });
    });

    describe("User", function() {
        it("user register", function(done) {
            users.registerUser('username', 'session_token', function(err, userId) {
                assert.equal(err, null);

                users.getUserByName('username', function (err, user) {
                    assert.equal(err, null);
                    assert.equal(userId, user.id);
                    assert.equal('username', user.name);
                    assert.equal('session_token', user.session_token);

                    done();
                });
            });
        });

        it("user init coins", function(done) {
            users.registerUser('username', 'session_token', function(err, userId) {
                assert.equal(err, null);

                users.initUser(userId, function (err) {
                    assert.equal(err, null);

                    users.getUserCoins(userId, function (err, coins) {
                        assert.equal(err, null);
                        assert.equal(coins, 1000);

                        done();
                    });
                });
            });
        });

        it("user init items", function(done) {
            users.registerUser('username', 'session_token', function(err, userId) {
                assert.equal(err, null);

                users.initUser(userId, function (err) {
                    assert.equal(err, null);

                    users.getUserItems(userId, function (err, items) {
                        assert.equal(err, null);
                        assert.equal(items.length, 3);
                        assert.equal(items[1].count, 18);

                        done();
                    });
                });
            });
        });

        it("user get by token", function(done) {
            users.registerUser('username', 'session_token', function(err, userId) {
                assert.equal(err, null);

                users.getUserByToken('session_token', function (err, user) {
                    assert.equal(err, null);
                    assert.equal(userId, user.id);

                    done();
                });
            });
        });

        it("user update token", function(done) {
            users.registerUser('username', 'session_token', function(err, userId) {
                assert.equal(err, null);

                users.updateSessionToken('username', 'session_token_2', function (err) {
                    assert.equal(err, null);

                    users.getUserByToken('session_token_2', function (err, user) {
                        assert.equal(err, null);
                        assert.equal(userId, user.id);

                        done();
                    });
                });
            });
        });
    });
});