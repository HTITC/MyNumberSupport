var pg = require('./persistence_pg');
var sqlite3 = require('./persistence_sqlite3');

module.exports = {
    pg: pg,
    sqlite3: sqlite3,
};
