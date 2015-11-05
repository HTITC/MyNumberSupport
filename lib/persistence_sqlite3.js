var credentials = require('../credentials.js'),
    sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database('./mnsupport.db');

module.exports = {
    createUsersTable: function() {
        db.serialize(function() {
            db.run('CREATE TABLE IF NOT EXISTS users (username TEXT not null, password TEXT not null, full_name TEXT, last_login_date TEXT)');
        });
        //db.close();
    },
    createUser: function(user) {
        db.serialize(function() {
            var stmt = db.prepare("INSERT INTO users (username, password) VALUES ($username, $password)", function(err) {
                if (err) {
                    console.log(err);
                }
            });
            stmt.run({$username: user.username, $password: user.password}, function(err) {
                if (err) {
                    console.log(err);
                }
            });
        });
        //db.close();
    },
    createSampleUsers: function(user) {
        this.createUser({username: 'jandos', password: 'janpass'});
    },
    getUser: function(username, callback) {
        db.each("SELECT rowid AS id, username, password FROM users WHERE username = $username",
            {$username: username}, function(err, row) {
                if (err) {
                    console.log(err);
                } else {
                    callback({username: row.username, password: row.password});
                }
            }
        );
    }
};
