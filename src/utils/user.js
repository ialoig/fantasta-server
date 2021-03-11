import config from 'config'
import { populate, User } from '../database/index.js'
import { default as Token } from './token.js'
import { Constants, tokenUtils } from '../utils/index.js'

const userFromToken = async ( req ) =>
{
    try
    {
        
        const token = Token.Get( req ) || ''
        let auth = Token.Verify( token, config.token.kid )
        
        if ( auth.error )
        {
            throw Constants.TOKEN_NOT_VALID
        }
        else
        {
            let user = await User.findOne({ email: auth.email })

            if ( !user || user.$isEmpty() || !user.$isValid() )
            {
                throw Constants.USER_NOT_FOUND
            }
            else if ( user.password && user.password==auth.password )
            {
                let data = {
                    user,
                    token: auth.token
                }
                return Promise.resolve( data )
            }
            else
            {
                throw Constants.WRONG_USER
            }
        }
    }
    catch (error)
    {
        console.error(`[api] UserFromToken: ${error}`)

        return Promise.reject(error)
    }
}

const getUser = async ( user ) =>
{
    let usr1 = await populate.user( user )
    
    return parseUser( usr1 )
}

const parseUser = ( user ) =>
{
    let usr = {
        _id: user._id.toString(),
        email: user.email,
        username: user.username || '',
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        leagues: [],
    }

    for ( let i in user.leagues )
    {
        let league = user.leagues[i]

        let tm = league.teams && league.teams.find( (item) => {
            return item.user._id.toString()==user._id.toString()
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

const createAuthResponse = async ( user, password ) =>
{
    let usr = await getUser( user )
    
    let response = {
        user: usr,
        token: tokenUtils.Create( config.token.kid, usr.email, password, usr.username )
    }

    return Promise.resolve(response)
}

export default {
    userFromToken,
    getUser,
    parseUser,
    createAuthResponse
}
