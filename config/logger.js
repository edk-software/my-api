var winston = require('winston');
require('winston-daily-rotate-file');

var transport = new (winston.transports.DailyRotateFile)({
    filename: '/home/oem/edkProd/logs/edk.log',
    datePattern: 'yyyy-MM-dd.',
    prepend: true,
    level: process.env.ENV === 'development' ? 'debug' : 'info',
    handleExceptions: true,
    exitOnError: false
});

module.exports =  new (winston.Logger)({
    transports: [
        transport
    ]
});
