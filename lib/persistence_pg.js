var credentials = require('../credentials.js'),
    conStr = 'postgres://' + credentials.databaseUser + ':' +
             credentials.databasePassword + '@localhost:5432/mnsupport',
    pg = require('pg');

module.exports = {
    createUsersTable: function() {
        pg.connect(conStr, function(err, client, done) {
            client.query('CREATE TABLE users(id SERIAL PRIMARY KEY,' +
                'username VARCHAR(50) not null, password VARCHAR(100) not null, ' +
                'full_name VARCHAR(100), last_login_date TIMESTAMP with time zone);', [],
                function(err, result) {
                    if (err) console.log(err.message);
                    done();
                }
            );
        });
    },
    createUser: function(user) {
        pg.connect(conStr, function(err, client, done) {
            client.query('INSERT INTO users(username, password, full_name) ' +
                    'VALUES ($1, $2, $3);', [user.username, user.password, user.full_name],
                function(err, result) {
                    if (err) console.log(err.message);
                    done();
                }
            );
        });
    },
    createSampleUsers: function(user) {
        this.createUser({username: user.username, password: user.password});
    },
    getUser: function(username, callback) {
        pg.connect(conStr, function(err, client, done) {
            client.query('SELECT * FROM users WHERE username = $1;', [username],
                function(err, result) {
                    if (err) {
                        console.log(err.message);
                    } else {
                        if (result.rows && result.rows.length > 0) {
                            callback(result.rows[0]);
                        } else {
                            callback(null);
                        }
                    }
                    done();
                }
            );
        });
    }
};
