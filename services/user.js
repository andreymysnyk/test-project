var database = require('../database');

exports.getUserByName = function (username, cb) {
    database.runQuery(function(err, db) {
        db.get('SELECT * from user WHERE name = ?', [username], function(err, row) {
            if (err) {
                console.log(err);
                cb(err);
                return;
            }

            cb(null, row);
        });
    });
};

exports.getUserByToken = function (session_token, cb) {
    database.runQuery(function(err, db) {
        db.get('SELECT * from user WHERE session_token = ?', [session_token], function(err, row) {
            if (err) {
                console.log(err);
                cb(err);
                return;
            }

            cb(null, row);
        });
    });
};

exports.getUserCoins = function (userId, cb) {
    database.runQuery(function(err, db) {
        db.get('SELECT SUM(amount) coins from billing WHERE user_id = ?', [userId], function(err, row) {
            if (err) {
                console.log(err);
                cb(err);
                return;
            }

            cb(null, row.coins);
        });
    });
};

exports.getUserItems = function (userId, cb) {
    database.runQuery(function(err, db) {
        db.all('SELECT id, name, img, count from user_item LEFT JOIN item ON id = item_id WHERE user_id = ?', [userId], function(err, rows) {
            if (err) {
                console.log(err);
                cb(err);
                return;
            }

            cb(null, rows);
        });
    });
};

exports.updateSessionToken = function (username, session_token, cb) {
    database.runQuery(function(err, db) {
        db.run('UPDATE user SET session_token = ? WHERE name = ?', [session_token, username], function(err) {
            if (err) {
                console.log(err);
                cb(err);
                return;
            }

            cb(null);
        });
    });
};

exports.registerUser = function (username, session_token, cb) {
    database.runQuery(function(err, db) {
        db.run('INSERT INTO user VALUES (NULL, ?, ?)', [username, session_token], function(err) {
            if (err) {
                console.log(err);
                cb(err);
                return;
            }

            cb(null, this.lastID);
        });
    });
};

exports.initUser = function (userId, cb) {
    database.runQuery(function(err, db) {
        db.serialize(function() {
            db.run('INSERT INTO billing VALUES (NULL, ?, ?)', [userId, 1000], function (err) {
                if (err) {
                    console.log(err);
                }
            });

            db.run('INSERT INTO user_item SELECT ?, id, init_count FROM item', [userId], function (err) {
                if (err) {
                    console.log(err);
                }
            });

            cb(null);
        });
    });
};
