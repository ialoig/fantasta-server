
import { default as DB } from 'database'
import { XLSX } from '@pinkal/central_utilities'

let _ = require('underscore');

const savePlayersJson = async () =>
{
    var xlsxJson = XLSX.readFile( 'statistiche.xlsx' );
    var players = getPlayersJsonFromXlsx(xlsxJson);
    
    let entry = await DB.Players.getAll()
    
    if ( entry && entry.players )
    {
        var equals = _.isEqual( entry.players, players );
        if ( !equals )
        {
            var update = { $set: {'players': players, 'version': ++entry.version, 'updated_at': (new Date()).toISOString()} };

            try
            {
                let data = await DB.Commons.update( entry, update )
                console.log(data)
            }
            catch (error)
            {
                console.error(error);
            }
        }
    }
    else
    {
        let newPlayers = DB.Players( players );

        try
        {
            let data = await DB.Commons.save( newPlayers )
            console.log(data)
        }
        catch (error)
        {
            console.error(error);
        }
    }
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

export default savePlayersJson