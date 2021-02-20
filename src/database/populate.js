
const user = ( user ) =>
{
    return new Promise((resolve, reject) => {
        user.populate({ path: 'leagues', populate: { path: 'teams' } })
        .execPopulate(
            (err, usr) => {
                if ( err ) {
                    return reject(err)
                }
                return resolve(usr.toJSON())
            }
        )
    })
}

const league = ( league ) =>
{
    return new Promise((resolve, reject) => {
        league.populate({ path: 'admin teams', populate: { path: 'user league' } })
        .execPopulate(
            (err, leg) => {
                if ( err ) {
                    return reject(err)
                }
                return resolve(leg.toJSON())
            }
        )
    })
}

const team = ( team ) =>
{
    return new Promise((resolve, reject) => {
        team.populate('user league')
        .execPopulate(
            (err, tm) => {
                if ( err ) {
                    return reject(err)
                }
                return resolve(tm.toJSON())
            }
        )
    })
}

export default {
    league,
    team,
    user
}