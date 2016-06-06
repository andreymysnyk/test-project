var uuid = require('uuid');
var database = require('../database');
var express = require('express');
var router = express.Router();

router.post('/login', function(req, res) {
    var username = req.body.username;
    getUserByName(username, errorHandler(res, function (err, user) {
        var session_token = uuid.v1();

        if (user) {
            updateSessionToken(username, session_token, errorHandler(res, function(err) {
                res.send(session_token);
            }));
        } else {
            registerUser(username, session_token, errorHandler(res, function(err, userId) {
                initUser(userId, errorHandler(res, function(err) {
                    res.send(session_token);
                }));
            }));
        }
    }));
});

router.post('/get', function(req, res) {
    var session_token = req.body.session_token;
    getUserByToken(session_token, errorHandler(res, function (err, user) {
        if (user) {
            getUserCoins(user.id, errorHandler(res, function(err, coins) {
                user.coins = coins;

                res.send(user);
            }));
        } else {
            res.send({});
        }
    }));
});

router.post('/items', function(req, res) {
    var session_token = req.body.session_token;
    getUserByToken(session_token, errorHandler(res, function (err, user) {
        if (user) {
            getUserItems(user.id, errorHandler(res, function (err, items) {
                res.send(items);
            }));
        } else {
            res.send({});
        }
    }));
});

router.post('/logout', function(req, res) {
    var session_token = req.body.session_token;
    getUserByToken(session_token, errorHandler(res, function (err, user) {
        if (user) {
            updateSessionToken(user.name, '', errorHandler(res, function(err) {
                res.send({});
            }));
        } else {
            res.send({});
        }
    }));
});

function errorHandler(res, cb) {
    return function (err, result) {
        if (err) {
            res.sendStatus(501);
            return;
        }

        cb(err, result);
    }
}

function getUserByName(username, cb) {
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
}

function getUserByToken(session_token, cb) {
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
}

function getUserCoins(userId, cb) {
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
}

function getUserItems(userId, cb) {
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
}

function updateSessionToken(username, session_token, cb) {
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
}

function registerUser(username, session_token, cb) {
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
}

function initUser(userId, cb) {
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
}

module.exports = router;
