
import { User } from '../../../database'
import { Constants, Response } from '../../../utils'
import { Create } from '../../../token'

const register = async ( req, res, next ) =>
{
    let body = req.body;
    if ( body && body.name && body.email && body.password && body.uuid )
    {
        let newUser = User({
            name: body.name,
            email: body.email,
            password: body.password,
            uuid: body.uuid
        });

        let user = {}
        try
        {
            user = await newUser.save()
        }
        catch (error)
        {
            console.error(error)
            res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.USER_PRESENT, error ) )
        }

        delete user.password
        delete user.uuid
        
        let data = {
            user: user,
            token: Create(req, newUser.id, body.email, body.password)
        }
        res.json( Response.resolve( Constants.OK, data) )
    }
    else
    {
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, null ) )
    }
}

export default register