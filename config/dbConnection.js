var mysql = require('mysql');


var connection = mysql.createConnection({
    host:'172.17.0.2',
    user:'root',
    password:'keroiraw12',
    database:'admin_myapi',
    port:3306
});


module.exports = connection;