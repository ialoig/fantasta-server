
import config from 'config'

import { populate, User } from '../database'
import { default as Token } from './token'

const userFromToken = async ( req ) =>
{
    try
    {
        
        const token = Token.Get( req )
        if ( token )
        {
            let auth = Token.Verify( token, config.token.kid )
            let user = await User.findOne({ email: auth.email })

            if ( user && auth && user.password && user.password==auth.password )
            {
                let data = {
                    user,
                    token: auth.token
                }
                return Promise.resolve( data )
            }
        }
        return Promise.reject('UserFromToken -> EMPTY_TOKEN')
    }
    catch (error)
    {
        console.error('UserFromToken: ', error)

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
        name: user.name || '',
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

const findAndUpdateUser = async (id, newValues) => {
    let updatedUser = await User.findByIdAndUpdate({_id: id}, newValues, {new: true, useFindAndModify: false});

    //TODO : user da parsare? con parseUSer
    return updatedUser;
}


export default {
    userFromToken,
    getUser,
    parseUser,
    findAndUpdateUser
}