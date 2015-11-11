var credentials = require('../credentials.js'),
    sqlite3 = require('sqlite3')(); //.verbose(),
    dbFile = './mnsupport.db',
    db;

module.exports = {
    createDb: function(callback) {
        db = new sqlite3.Database(dbFile, function(err) {
            if (err) {
                //console.log(err);
                this.closeDb();
                if (callback) callback(err, null);
            } else {
                db.run('CREATE TABLE IF NOT EXISTS users (username TEXT not null, password TEXT not null, full_name TEXT, last_login_date TEXT)', function(err) {
                    if (err) {
                        //console.log(err);
                        if (callback) callback(err, null);
                    } else {
                        if (callback) callback(null, true);
                    }
                    this.closeDb();
                });
            }
        });
    },
    createSampleUsers: function() {
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
        db.run("INSERT INTO users (username, password) VALUES ($username, $password)",
            { $username: user.username, $password: user.password }, function(err) {
                if (err) {
                    console.log(err);
                    this.closeDb();
                } else {
                    if (callback) callback();
                }
            }
        );
    },
    getUser: function(db, username, callback) {
        db.get("SELECT rowid AS id, username, password FROM users WHERE username = $username",
            {$username: username}, function(err, row) {
                if (err) {
                    console.log(err);
                    this.closeDb();
                } else {
                    if (row) {
                        callback({username: row.username, password: row.password});
                    } else {
                        callback(null);
                    }
                }
            }
        );
    },
    openDb: function(callback) {
        db = new sqlite3.Database(dbFile, function(err) {
            if (err) {
                //console.log(err);
                if (callback) callback(err, null);
            } else {
                if (callback) callback(null, true);
            }
        });
    },
    closeDb: function() {
        db.close();
    },
};
