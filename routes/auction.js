var users = require('../services/user');
var auctions = require('../services/auction');
var express = require('express');
var router = express.Router();

router.post('/start', function(req, res) {
    var session_token = req.body.session_token;
    var itemId = req.body.item_id;
    var count = req.body.count;
    var bid = req.body.bid;

    users.getUserByToken(session_token, errorHandler(res, function (err, user) {
        if (user) {
            auctions.pushAuction(user.id, itemId, count, bid, errorHandler(res, function (err) {
                res.send({success: true});
            }));
        } else {
            res.send({success: false});
        }
    }));
});

router.get('/get', function(req, res) {
    auctions.getActiveAuction(errorHandler(res, function (err, auction) {
        res.send(auction);
    }));
});

router.post('/bid', function(req, res) {
    var session_token = req.body.session_token;
    var bid = req.body.bid;

    users.getUserByToken(session_token, errorHandler(res, function (err, user) {
        if (user) {
            auctions.getActiveAuction(errorHandler(res, function (err, auction) {
                if (auction) {
                    auctions.postBid(auction.id, user.id, bid, errorHandler(res, function(err) {
                        res.send({success: true});
                    }));
                } else {
                    res.send({success: false});
                }
            }));
        } else {
            res.send({success: false});
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
