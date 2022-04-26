const {Pool} = require('pg');

const dbPool = new Pool({
    database: 'myprojek',
    port: 5432,
    user: 'postgres',
    password: 'root'
});

module.exports = dbPool