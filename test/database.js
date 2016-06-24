var assert = require('chai').assert;
var nconf = require('nconf');
var fs = require('fs');

nconf.file('./test/config.json');

// delete database file
var db_file = nconf.get('database').filename;
if (fs.existsSync(db_file)) {
    fs.unlinkSync(db_file);
}

// init database
var database = require('../database');

describe("Database", function() {
    describe("Initial structure", function() {
        it("table user created", function(done) {
            database.runQuery(function(err, db) {
                db.all('SELECT id, name, session_token FROM user', function (err, rows) {
                    assert.equal(err, null);
                    assert.deepEqual(rows, []);
                    done();
                })
            });
        });

        it("table billing created", function(done) {
            database.runQuery(function(err, db) {
                db.all('SELECT id, user_id, amount FROM billing', function (err, rows) {
                    assert.equal(err, null);
                    assert.deepEqual(rows, []);
                    done();
                })
            });
        });

        it("table user_item created", function(done) {
            database.runQuery(function(err, db) {
                db.all('SELECT user_id, item_id, count FROM user_item', function (err, rows) {
                    assert.equal(err, null);
                    assert.deepEqual(rows, []);
                    done();
                })
            });
        });

        it("table item created", function(done) {
            database.runQuery(function(err, db) {
                db.all('SELECT id, name, init_count FROM item', function (err, rows) {
                    assert.equal(err, null);
                    assert.equal(rows.length, 3);
                    assert.equal(rows[0].init_count, 30);
                    done();
                })
            });
        });

        it("table auction created", function(done) {
            database.runQuery(function(err, db) {
                db.all('SELECT id, status, created, item_id, owner_id, item_count, bid_user_id, bid, bid_time FROM auction', function (err, rows) {
                    assert.equal(err, null);
                    assert.deepEqual(rows, []);
                    done();
                })
            });
        });
    });
});