var credentials = require('../credentials.js'),
    sqlite3 = require('sqlite3').verbose(),
    dbFile = './mnsupport.db',
    db;

var util = require('util');

function checkCallbackArgument(callback) {
    if (!callback) {
        throw new Error('Argument missing');
    } else if (!util.isFunction(callback)) {
        throw new Error('Argument is not a function');
    }
}

module.exports = {
    openDb: function(callback) {
        checkCallbackArgument(callback);
        db = new sqlite3.Database(dbFile, function(err) {
            if (err) {
                //console.log(err);
                callback(err, null);
            } else {
                callback(null, true);
            }
        });
    },
    createUsersTable: function(callback) {
        checkCallbackArgument(callback);
        db.run('CREATE TABLE IF NOT EXISTS users (username TEXT not null, password TEXT not null, full_name TEXT, last_login_date TEXT)', function(err) {
            if (err) {
                //console.log(err);
                callback(err, null);
            } else {
                callback(null, true);
            }
        });
    },
    createSampleUsers: function(callback) {
        checkCallbackArgument(callback);
        db = new sqlite3.Database(dbFile, function(err) {
            if (err) {
                console.log(err)
            } else {
                db.serialize(function() {
                    this.createUsersTable(this.closeDb);
                });
            }
        });
    },
    createUser: function(user, callback) {
        checkCallbackArgument(callback);
        db.run("INSERT INTO users (username, password) VALUES ($username, $password)",
            { $username: user.username, $password: user.password }, function(err) {
                if (err) {
                    //console.log(err);
                    callback(err, null);
                } else {
                    callback(null, true);
                }
            }
        );
    },
    getUser: function(username, callback) {
        checkCallbackArgument(callback);
        db.get("SELECT rowid AS id, username, password FROM users WHERE username = $username",
            {$username: username}, function(err, row) {
                if (err) {
                    //console.log(err);
                    callback(err, null);
                } else {
                    if (row) {
                        callback(null, {username: row.username, password: row.password});
                    } else {
                        callback(null, null);
                    }
                }
            }
        );
    },
    closeDb: function() {
        db.close();
    },
};
