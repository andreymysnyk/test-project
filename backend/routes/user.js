var uuid = require('uuid');
var database = require('../database');
var express = require('express');
var router = express.Router();

router.post('/login', function(req, res) {
    var username = req.body.username;
    getUserByName(username, function (err, user) {
        if (err) {
            res.sendStatus(501);
            return;
        }

        var session_token = uuid.v1();

        if (user) {
            updateSessionToken(username, session_token, function(err) {
                if (err) {
                    res.sendStatus(501);
                    return;
                }

                res.send(session_token);
            });
        } else {
            registerUser(username, session_token, function(err, userId) {
                if (err) {
                    res.sendStatus(501);
                    return;
                }

                initUser(userId, function(err) {
                    if (err) {
                        res.sendStatus(501);
                        return;
                    }

                    res.send(session_token);
                });
            });
        }
    });
});

router.post('/logout', function(req, res) {
    var session_token = req.body.session_token;
    getUserByToken(session_token, function (err, user) {
        if (err) {
            res.sendStatus(501);
            return;
        }

        if (user) {
            updateSessionToken(user.name, '', function(err) {
                if (err) {
                    res.sendStatus(501);
                    return;
                }

                res.send();
            });
        } else {
            res.send();
        }
    });
});

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
