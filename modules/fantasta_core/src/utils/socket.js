
var leagueCreate = function ( req, leagueName, resp )
{
    var io = req.app.get('io');
    io.emit( leagueName + ".league.complete", leagueName, resp );
}

var addAttendee = function ( req, leagueName, resp )
{
    var io = req.app.get('io');
    io.emit( leagueName + ".attendee.added", leagueName, resp );
}

module.exports = {
    leagueCreate,
    addAttendee
}

