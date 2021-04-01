import config from 'config'
import { populate, User, League, Team } from '../database'
import { default as Token } from './token.js'
import { Errors, tokenUtils } from '../utils'
import mongoose from 'mongoose'

const userFromToken = async (req) => {
    try {

        const token = Token.Get(req) || ''
        let auth = Token.Verify(token, config.token.kid)

        if (auth.error) {
            throw Errors.TOKEN_NOT_VALID // todo: non ci stampa l'errore corretto nella catch perche' fa un throw di object
        }
        else {
            let user = await User.findOne({ email: auth.email })

            if (!user || user.$isEmpty() || !user.$isValid()) {
                throw Errors.EMAIL_NOT_FOUND // todo: non ci stampa l'errore corretto nella catch perche' fa un throw di object
            }
            else if (user.password && user.password == auth.password) {
                let data = {
                    user,
                    token: auth.token
                }
                return Promise.resolve(data)
            }
            else {
                throw Errors.WRONG_PASSWORD // todo: non ci stampa l'errore corretto nella catch perche' fa un throw di object
            }
        }
    }
    catch (error) {
        console.error(`[api] UserFromToken: ${error}`)
        return Promise.reject(error)
    }
}

const getUser = async (user) => {
    let usr1 = await populate.user(user)

    return parseUser(usr1)
}

const parseUser = (user) => {
    let usr = {
        _id: user._id.toString(),
        email: user.email,
        username: user.username || '',
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        leagues: [],
    }

    for (let i in user.leagues) {
        let league = user.leagues[i]

        let tm = league.teams && league.teams.find((item) => {
            return item.user._id.toString() == user._id.toString()
        })

        usr.leagues.push({
            _id: league._id.toString(),
            name: league.name,
            createdAt: league.createdAt.toISOString(),
            updatedAt: league.updatedAt.toISOString(),
            team: {
                _id: tm && tm._id.toString() || '',
                name: tm && tm.name || ''
            }
        })
    }

    return usr
}

const createAuthResponse = async (user, password) => {
    let usr = await getUser(user)

    let response = {
        user: usr,
        token: tokenUtils.Create(config.token.kid, usr.email, password, usr.username)
    }

    return Promise.resolve(response)
}


/**
 * 
 * @param {*} arr array to scan and modify
 * @param {*} value to remove
 * @returns whether the value was removed or not
 */
function removeElementFromArray(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
        return true
    }
    return false
}


/**
     * It removes the User document from DB. It also deletes user teams from DB and removes the reference from the related leagues.
     * @param {*} user object to remove
     * @returns true/false
     */
const removeUserAndReferences = async (user) => {
    let res = {
        userRemoved: [],
        teamRemoved: [],
        leagueRemoved: [],
    }
    try {
        console.log(`[removeUserAndReferences]: deleting user "${user._id}"`)

        // Remove user
        res.userRemoved.push(user._id)
        await user.deleteOne();

        const league_ids = user.leagues

        // Parse all leagues the user is participating 
        for (let league_index = 0; league_index < league_ids.length; league_index++) {
            const league_id = league_ids[league_index]

            // Check if "league_id" is a valid ObjectId
            if (!league_id instanceof mongoose.Types.ObjectId) {
                console.error(`[removeUserAndReferences]: "${league_id}" is not a valid ObjectId`)
                continue // parse next league
            }

            // Find league
            const league = await League.findById(league_id)
            if (!league) {
                console.error(`[removeUserAndReferences]: "${league_id}" does not match any "League" document in mongoDB`)
                continue // parse next league
            }

            // Parse all teams in the league
            const teams_ids = league.teams
            for (let team_index = 0; team_index < teams_ids.length; team_index++) {
                const team_id = teams_ids[team_index]

                // Check if "team_id" is a valid ObjectId
                if (!team_id instanceof mongoose.Types.ObjectId) {
                    console.error(`[removeUserAndReferences]: "${team_id}" is not a valid ObjectId`)
                    continue // parse next team
                }

                // find team
                const team = await Team.findById(team_id)
                if (!team) {
                    console.error(`[removeUserAndReferences]: "${team_id}" does not match any "Team" document is mongoDB`)
                    continue // parse next team
                }

                // Check if "team.user" is a valid ObjectId
                if (!team.user instanceof mongoose.Types.ObjectId) {
                    console.error(`[removeUserAndReferences]: "${team.user}" is not a valid ObjectId`)
                    continue // parse next team
                }

                // Check if team belongs to the user
                if (team.user.equals(user._id)) {

                    // Remove team
                    console.log(`[removeUserAndReferences]: deleting team "${team._id}"`)
                    res.teamRemoved.push(team._id)
                    await team.deleteOne();

                    // If only team in league -> delete league
                    if (league.teams.length == 1) {
                        console.log(`[removeUserAndReferences]: deleting league "${league._id}" (user "${user._id}" was the only participant)`)
                        res.leagueRemoved.push(league._id)
                        await league.deleteOne()
                    }
                    else {
                        // Remove team from league
                        removeElementFromArray(league.teams, team._id)

                        // If user was the admin -> make a new admin
                        if (league.admin.equals(user._id)) {
                            const new_admin_team = await Team.findById(league.teams[0])
                            const new_admin = await User.findById(new_admin_team.user)
                            league.admin = new_admin._id
                            console.log(`[removeUserAndReferences]: new admin: "${new_admin._id}" for league "${league._id}"`)
                        }
                        await league.save();
                    }
                }
            }
        }
        return Promise.resolve(res)
    }
    catch (error) {
        console.error(`[removeUserAndReferences]: error "${error}"`)
        return Promise.reject(res)
    }
}

export default {
    userFromToken,
    getUser,
    parseUser,
    createAuthResponse,
    removeUserAndReferences
}
