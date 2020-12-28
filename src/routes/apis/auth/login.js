
import { User } from '../../../database'
import { Constants, Response } from '../../../utils'
import { Create } from '../../../token'

const login = async ( req, res, next ) =>
{
    let body = req.body;
    if ( body && body.email && body.password )
    {
        try
        {
            let user = await User.findOne({ email: body.email })

            if ( !user )
            {
                res.status(404).send( Response.reject( Constants.NOT_FOUND, Constants.USER_NOT_FOUND, null ) )
            }
            else if ( user && user.password && user.password==body.password )
            {
                delete user.password
                delete user.uuid
                
                let data = {
                    user: user,
                    token: Create( req, user.id, body.email, body.password )
                }
                res.json( Response.resolve( Constants.OK, data ) )
            }
            else
            {
                res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.WRONG_PASSWORD, null ) )
            }
        }
        catch (error)
        {
            console.error(error)
            res.status(404).send( Response.reject( Constants.NOT_FOUND, Constants.USER_NOT_FOUND, error ) )
        }
    }
    else
    {
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, null ) )
    }
};

export default login