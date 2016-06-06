var auctions = require('./auction');
var database = require('../database');
var broadcast = require('../services/broadcast');

// schedule to manage auctions
setInterval(function() {
    // get current active auction
    auctions.getActiveAuction(function(err, auction) {
        if (err) {
            console.log(err);
            return;
        }
        
        // check active auction
        if (auction) {
            // check evaluation time
            if (auction.timer > -10) {
                // wait and check again on next iteration
                return;
            } else {
                // close auction and move items & coins
                database.runQuery(function(err, db) {
                    db.serialize(function() {
                        // if someone bid auction
                        if (auction.bid_user_id) {
                            // owner lose items
                            db.run('UPDATE user_item SET count = count - ? WHERE user_id = ? AND item_id = ?', [auction.item_count, auction.owner_id, auction.item_id], function (err) {
                                if (err) {
                                    console.log(err);
                                }
                            });

                            // owner get coins
                            db.run('INSERT INTO billing VALUES (NULL, ?, ?)', [auction.owner_id, auction.bid], function (err) {
                                if (err) {
                                    console.log(err);
                                }
                            });

                            // bid_user get items
                            db.run('UPDATE user_item SET count = count + ? WHERE user_id = ? AND item_id = ?', [auction.item_count, auction.bid_user_id, auction.item_id], function (err) {
                                if (err) {
                                    console.log(err);
                                }
                            });

                            // bid_user lose coins
                            db.run('INSERT INTO billing VALUES (NULL, ?, ?)', [auction.bid_user_id, -auction.bid], function (err) {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        }

                        // close auction
                        db.run('UPDATE auction SET status = ? WHERE id = ?', [auctions.STATUS.DONE, auction.id], function (err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    });
                });
            }
        } else {
            // start next auction
            database.runQuery(function(err, db) {
                db.run('UPDATE auction SET status = ?, created = ? WHERE id IN (SELECT id FROM auction WHERE status = ? ORDER BY created LIMIT 1)', [auctions.STATUS.ACTIVE, new Date(), auctions.STATUS.NEW], function(err) {
                    if (err) {
                        console.log(err);
                    }

                    if (this.changes > 0) {
                        broadcast.broadcast({code: 'new action'});
                    }
                });
            });
        }
    });
}, 1000);