
import config from 'config'

import { User } from '../../../database'
import { Constants, Response } from '../../../utils'
import { Verify } from '../../../token'

const token = async ( req, res, next ) =>
{
    const Authorization = req.header('Authorization') || '';
    const token = Authorization && Authorization.split(' ')[1];

    console.log(token)

    if ( token )
    {
        let auth = {}
        try
        {
            auth = Verify( token, config.token.kid )

            if ( auth.error )
            {
                console.error(auth)
                res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, auth ) )
            }
        }
        catch (error)
        {
            console.error(auth)
            res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, auth ) )
        }

        let user = null
        try
        {
            user = await User.findOne({ email: auth.email })
        }
        catch (error)
        {
            console.error(error)
            res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, error ) )
        }

        if ( !user )
        {
            res.status(404).send( Response.reject( Constants.NOT_FOUND, Constants.USER_NOT_FOUND, null ) )
        }
        else if ( user.password && user.password==auth.password )
        {
            
            let data = {
                user: {
                    leagues: user.leagues,
                    id: user._id,
                    email: user.email
                },
                token: auth.token
            }
            res.json( Response.resolve( Constants.OK, data) )
        }
        else
        {
            console.log("ERRORE: Password non corretta")
            res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, null ) )
        }
    }
    else
    {
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, null ) )
    }
};

export default token