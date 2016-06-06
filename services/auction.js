var database = require('../database');
var broadcast = require('../services/broadcast');

var STATUS = {
    NEW: 0,
    ACTIVE: 1,
    DONE: 2
};

exports.STATUS = STATUS;

exports.pushAuction = function (userId, itemId, count, bid, cb) {
    database.runQuery(function(err, db) {
        db.run('INSERT INTO auction VALUES (NULL, ?, ?, ?, ?, ?, ?, NULL, NULL)', [STATUS.NEW, new Date(), userId, itemId, count, bid], function(err) {
            if (err) {
                console.log(err);
                cb(err);
                return;
            }

            cb(null);
        });
    });
};

exports.getActiveAuction = function (cb) {
    database.runQuery(function(err, db) {
        db.get('SELECT a.*, i.img, i.name itemName, u.name userName from auction a LEFT JOIN user u ON a.owner_id = u.id LEFT JOIN item i ON a.item_id = i.id WHERE status = ?', [STATUS.ACTIVE], function(err, row) {
            if (err) {
                console.log(err);
                cb(err);
                return;
            }

            if (row) {
                var timer = Math.max(90000 - (new Date() - row.created), 10000 - (new Date() - row.bid_time));
                row.timer = Math.round(timer / 1000);
                row.active = timer > 0;
            }

            cb(null, row);
        });
    });
};

exports.postBid = function (auctionId, userId, bid, cb) {
    database.runQuery(function(err, db) {
        db.run('UPDATE auction SET bid_user_id = ?, bid = ?, bid_time = ? WHERE id = ?', [userId, bid, new Date(), auctionId], function(err) {
            if (err) {
                console.log(err);
                cb(err);
                return;
            }

            broadcast.broadcast({code: 'update auction'});

            cb(null);
        });
    });
};
