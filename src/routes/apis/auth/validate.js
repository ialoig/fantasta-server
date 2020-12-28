
import { User } from '../../../database'
import { Constants, Response } from '../../../utils'
import { Create, Verify } from '../../../token'

const validate = async ( req, res, next ) =>
{
    let token = req.header('token') || null;
    if ( token )
    {
        let auth = Verify( token, req )
        if ( auth.error )
        {
            console.error(auth)
            res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, auth ) )
        }

        let user = {}
        try
        {
            user = await User.findById( auth.userId )
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
            let newToken = Create(req, user.id || user._id, user.email, user.password)

            delete user.password
            delete user.uuid

            let data = {
                user: user,
                token: newToken
            }
            res.setHeader( 'token', JSON.stringify(newToken) )
            res.setHeader( 'user', JSON.stringify(user) )
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

export default validate