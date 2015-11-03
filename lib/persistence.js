var conStr = 'postgres://' + credentials.databaseUser + ':' +
             credentials.databasePassword + '@localhost:5432/mnsupport',
    pg = require('pg'),

module.exports = {
    createUsersTable = function() {
        db = new pg.Client(conStr);
        db.connect();
        var query = db.query('CREATE TABLE users(id SERIAL PRIMARY KEY,' +
                'username VARCHAR(50) not null, password VARCHAR(100) not null, ' +
                'full_name VARCHAR(100), last_login_date TIMESTAMP with time zone);');
        query.on('end', function() { db.end(); });
    }
};
