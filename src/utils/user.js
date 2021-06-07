import config from 'config'
import { populate, User, League, Team, deletedUserObj } from '../database'
import { default as Token } from './token.js'
import { Errors, tokenUtils } from '../utils'
import mongoose from 'mongoose'

const userFromToken = async (req) => {

    let ret = {}

    try {
        const token = Token.Get(req) || ''
        let auth = Token.Verify(token, config.token.kid)

        if (auth.error) {
            return Promise.reject(Errors.TOKEN_NOT_VALID)
        }
        else {
            let user = await User.findOne({ email: auth.email })

            if (!user || user.$isEmpty() || !user.$isValid()) {
                return Promise.reject(Errors.EMAIL_NOT_FOUND)
            }
            else if (user.password && user.password == auth.password) {
                let data = {
                    user,
                    token: auth.token
                }
                return Promise.resolve(data)
            }
            else {
                return Promise.reject(Errors.WRONG_PASSWORD)
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
 * 
 * @param {*} teams_ids list of team id to analize
 * @returns team_id of the first active user, null otherwise
 */
const getNewAdmin = async (teams_ids, userToDelete, deletedUser) => {

    for (let team_index = 0; team_index < teams_ids.length; team_index++) {

        const team_id = teams_ids[team_index]

        // Check if "team_id" is a valid ObjectId
        if (!team_id instanceof mongoose.Types.ObjectId) {
            console.error(`[getNewAdmin]: "${team_id}" is not a valid ObjectId`)
            continue // parse next team
        }

        // find team
        const team = await Team.findById(team_id)
        if (!team) {
            console.error(`[getNewAdmin]: "${team_id}" does not match any "Team" document is mongoDB`)
            continue // parse next team
        }

        // Check if "team.user" is a valid ObjectId
        if (!team.user instanceof mongoose.Types.ObjectId) {
            console.error(`[getNewAdmin]: "${team.user}" is not a valid ObjectId`)
            continue // parse next team
        }

        // deletedUser and userToDelete are not eligible to be admin
        if (team.user.equals(deletedUser._id) || team.user.equals(userToDelete._id)) {
            continue
        }
        else {
            return team.user
        }
    }
    console.error(`[getNewAdmin]: no active user found in league. "deletedUser" will be the admin`)
    return deletedUser._id
}

/**
 * It removes the User document from DB. It also moves user teams and league references to the userDeleted user.
 * @param {*} user object to remove
 * @returns true/false
 */
const removeUser = async (userToDelete) => {
    console.log(`[removeUser]: deleting user ${JSON.stringify(userToDelete, null, 2)}`)
    try {
        const deletedUser = await User.findOne({ email: deletedUserObj.email })
        const league_ids = userToDelete.leagues

        // Parse all leagues the user is participating 
        for (let league_index = 0; league_index < league_ids.length; league_index++) {
            const league_id = league_ids[league_index]

            // Check if "league_id" is a valid ObjectId
            if (!league_id instanceof mongoose.Types.ObjectId) {
                console.error(`[removeUser]: "${league_id}" is not a valid ObjectId`)
                continue // parse next league
            }

            // Find league
            const league = await League.findById(league_id)
            if (!league) {
                console.error(`[removeUser]: "${league_id}" does not match any "League" document in mongoDB`)
                continue // parse next league
            }

            // Assign league to deletedUser
            if (!deletedUser.leagues.includes(league_id)) {
                deletedUser.leagues.push(league_id)
            }

            // Counter for teams in League belonging to deletedUser user
            let deletedUserTeamsInLeague = 0

            // Parse all teams in the league
            const teams_ids = league.teams
            for (let team_index = 0; team_index < teams_ids.length; team_index++) {

                const team_id = teams_ids[team_index]

                // Check if "team_id" is a valid ObjectId
                if (!team_id instanceof mongoose.Types.ObjectId) {
                    console.error(`[removeUser]: "${team_id}" is not a valid ObjectId`)
                    continue // parse next team
                }

                // find team
                const team = await Team.findById(team_id)
                if (!team) {
                    console.error(`[removeUser]: "${team_id}" does not match any "Team" document is mongoDB`)
                    continue // parse next team
                }

                // Check if "team.user" is a valid ObjectId
                if (!team.user instanceof mongoose.Types.ObjectId) {
                    console.error(`[removeUser]: "${team.user}" is not a valid ObjectId`)
                    continue // parse next team
                }

                // Check if team belongs to the userToDelete
                if (team.user.equals(userToDelete._id)) {
                    deletedUserTeamsInLeague++

                    // If user was the admin -> make a new admin
                    if (league.admin.equals(userToDelete._id)) {
                        const new_admin = await getNewAdmin(teams_ids, userToDelete, deletedUser)
                        league.admin = new_admin
                        console.log(`[removeUser]: new admin "${new_admin}" for league "${league._id}"`)
                    }

                    // Assign team to deletedUser
                    team.user = deletedUser._id
                    // Save modified team
                    await team.save();
                }
            }

            // check if league contains only deletedUser teams
            if (league.teams.length == deletedUserTeamsInLeague) {
                console.log(`[removeUser]: setting isDeleted for league "${league_id}"`)
                league.isDeleted = true
            }

            // Save modified league
            await league.save();
        }

        // Save modified deletedUser
        await deletedUser.save()

        // Delete user
        await userToDelete.deleteOne();
        return Promise.resolve(true)

    }
    catch (error) {
        console.error(`[removeUser]: error "${error}"`)
        return Promise.reject(false)
    }
}

export default {
    userFromToken,
    getUser,
    parseUser,
    createAuthResponse,
    removeUser
}
