
var Schedule = require('node-schedule');
var savePlayersJson = require('./players/savePlayersJson');

var readPlayerXlsx = function ()
{
    var rule = new Schedule.RecurrenceRule();
    rule.hour = 8;

    var j = Schedule.scheduleJob(rule, function(){
        savePlayersJson();
    });
}

module.exports = {
    readPlayerXlsx
}