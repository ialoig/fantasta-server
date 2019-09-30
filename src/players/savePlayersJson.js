
import { Commons, Players } from 'database'
import { XLSX } from '@pinkal/central_utilities'

let _ = require('underscore');

const savePlayersJson = async () =>
{
    var xlsxJson = XLSX.readFile( 'statistiche.xlsx' );
    var players = getPlayersJsonFromXlsx(xlsxJson);
    
    let entry = null
    try {
        entry = await Players.getAll()
    }
    catch (error)
    {
        console.error(error)
    }
    
    if ( entry && entry.players )
    {
        var equals = _.isEqual( entry.players, players );
        if ( !equals )
        {
            var update = { $set: {'players': players, 'version': ++entry.version } };
            try
            {
                let data = await Commons.update( entry, update )
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
        let newPlayers = Players({ players: players, version: 1 });
        try
        {
            let data = await newPlayers.save()
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