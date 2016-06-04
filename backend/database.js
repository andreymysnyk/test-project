var sqlite3 = require('sqlite3').verbose();
var nconf = require('nconf');
var fs = require('fs');

var db_conf = nconf.get('database');
var db_file = db_conf.filename;
var exists = fs.existsSync(db_file);

// export functions
var runQuery = function (cb) {
    var db =  new sqlite3.Database(db_file);

    db.serialize(function() {
        cb(null, db);
    });

    db.close();
};

var errorHandler = function(err) {
    if (err) {
        console.log(err);
    }
};

// init database
if (!exists) {
    runQuery(function(err, db) {
        // tables
        run(db, 'CREATE TABLE user (id INTEGER PRIMARY KEY, name TEXT, session_token TEXT)');

        run(db, 'CREATE TABLE billing (id INTEGER PRIMARY KEY, user_id INTEGER, amount INTEGER)');

        run(db, 'CREATE TABLE item (id INTEGER PRIMARY KEY, name TEXT, img TEXT, init_count INTEGER)');

        run(db, 'CREATE TABLE user_item (user_id INTEGER, item_id INTEGER, count INTEGER)');

        run(db, 'CREATE TABLE auction (id INTEGER PRIMARY KEY, status INTEGER, created TIMESTAMP, ' +
                'owner_id INTEGER, item_id INTEGER, item_count INTEGER, bid INTEGER, ' +
                'bid_user_id INTEGER, bid_time TIMESTAMP)');

        // fill items
        run(db, 'INSERT INTO item VALUES (NULL, "Bread", "bread.png", 30)');
        run(db, 'INSERT INTO item VALUES (NULL, "Carrot", "carrot.png", 18)');
        run(db, 'INSERT INTO item VALUES (NULL, "Diamond", "diamond.png", 1)');
    });
}

function run(db, query) {
    db.run(query, errorHandler);
}

exports.runQuery = runQuery;
exports.errorHandler = errorHandler;
