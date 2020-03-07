var mysql = require('mysql');


var connection = mysql.createPool({
    connectionLimit: 10,
    host:'dbHostShouldGoHere',
    user:'dbUserShouldGoHere',
    password:'dbPassShouldGoHere',
    database:'dbSchemaNameShouldGoHere',
    port:3306
});


module.exports = connection;