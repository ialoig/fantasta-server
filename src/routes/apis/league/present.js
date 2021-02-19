
import { League } from '../../../database'
import { Constants, Response, userUtils } from '../../../utils'

const present = async ( req, res, next ) =>
{
    const { leaguename='' } = req.query

    if ( leaguename )
    {
        try
        {
            const auth = await userUtils.userFromToken( req )
            let user = auth.user
            const userId = user._id

            let present = await League.findOne({ name: leaguename })
        
            res.json( !!present )
        }
        catch (error)
        {
            console.error('League Valid: ', error)
            res.status(500).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, error ) )
        }
    }
    else
    {
        console.error('League Valid: PARAMS_ERROR')
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, null ) )
    }

}

export default present