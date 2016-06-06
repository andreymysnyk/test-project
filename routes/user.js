var uuid = require('uuid');
var users = require('../services/user');
var express = require('express');
var router = express.Router();

router.post('/login', function(req, res) {
    var username = req.body.username;
    users.getUserByName(username, errorHandler(res, function (err, user) {
        var session_token = uuid.v1();

        if (user) {
            users.updateSessionToken(username, session_token, errorHandler(res, function(err) {
                res.send(session_token);
            }));
        } else {
            users.registerUser(username, session_token, errorHandler(res, function(err, userId) {
                users.initUser(userId, errorHandler(res, function(err) {
                    res.send(session_token);
                }));
            }));
        }
    }));
});

router.post('/get', function(req, res) {
    var session_token = req.body.session_token;
    users.getUserByToken(session_token, errorHandler(res, function (err, user) {
        if (user) {
            users.getUserCoins(user.id, errorHandler(res, function(err, coins) {
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
    users.getUserByToken(session_token, errorHandler(res, function (err, user) {
        if (user) {
            users.getUserItems(user.id, errorHandler(res, function (err, items) {
                res.send(items);
            }));
        } else {
            res.send({});
        }
    }));
});

router.post('/logout', function(req, res) {
    var session_token = req.body.session_token;
    users.getUserByToken(session_token, errorHandler(res, function (err, user) {
        if (user) {
            users.updateSessionToken(user.name, '', errorHandler(res, function(err) {
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

module.exports = router;
