var mysql = require('mysql');


var connection = mysql.createConnection({
    host: 'Tutaj wpisz ip',
    user: 'Tutaj wpisz usera do bazy',
    password: 'Tutaj wpisz haslo do bazy',
    database: 'Tutaj wpisz nazwe bazy',
    port: 3306
});


module.exports = connection;