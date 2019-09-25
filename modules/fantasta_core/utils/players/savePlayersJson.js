
var database = require('../../database/database');
var xlsx = require('../xlsx');
var _ = require('underscore');

module.exports = function ()
{
    var xlsxJson = xlsx.readFile('statistiche.xlsx');
    var players = getPlayersJsonFromXlsx(xlsxJson);
    
    database.players.getPlayers()
    .then(
        function (entry)
        {
            if ( entry && entry.players )
            {
                var equals = _.isEqual( entry.players, players );
                if ( !equals )
                {
                    var update = { $set: {'players': players, 'version': ++entry.version, 'updated_at': (new Date()).toISOString()} };
                    database.db.update( entry, update )
                    .then(
                        function (data)
                        {
                            console.log(data);
                        },
                        function (error)
                        {
                            console.log(error);
                        }
                    )
                }
            }
            else
            {
                var newPlayers = database.players.create( players );
                database.db.save( newPlayers )
                .then(
                    function (data)
                    {
                        console.log(data);
                    },
                    function (error)
                    {
                        console.log(error);
                    }
                )
            }
        }
    )
}

var getPlayersJsonFromXlsx = function ( xlsxJson )
{
    var obj = {};
    for ( var i in xlsxJson )
    {
        var sheet = xlsxJson[i]

        if ( sheet && sheet.length )
        {
            if ( !obj[i] )
            {
                obj[i] = {};
            }
    
            for ( var j in sheet )
            {
                var player = sheet[j];
                var playerId = player['Id'];
                obj[i][playerId] = player;
            }
        }
    }
    return obj;
}