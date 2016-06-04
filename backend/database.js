var sqlite3 = require('sqlite3').verbose();
var nconf = require('nconf');

var db_conf = nconf.get('database');

var db  = new sqlite3.Database({
    connectionLimit : 2,
    host            : db_conf.host,
    user            : db_conf.write_user,
    password        : db_conf.write_password,
    database        : db_conf.database
});

exports.db = db;
