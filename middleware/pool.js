const mysql = require('mysql2/promise');
const config = require('../config/dbconfig.json');

module.exports = mysql.createPool(config);