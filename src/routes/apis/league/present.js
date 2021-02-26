
import { League } from '../../../database'
import { Constants, Response, userUtils } from '../../../utils'
import { errorMetric, saveMetric } from "../../../metrics"

const present = async ( req, res, next ) =>
{
    const duration_start = process.hrtime()

    const { leaguename='' } = req.query

    if ( leaguename )
    {
        try
        {
            await userUtils.userFromToken( req )

            let present = await League.findOne({ name: leaguename })
        
            saveMetric( "league.present", '', duration_start )

            res.json( !!present )
        }
        catch (error)
        {
            errorMetric( "league.present", Constants[error] || Constants.BAD_REQUEST, duration_start )

            console.error('League Present: ', error)
            res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants[error] || Constants.BAD_REQUEST, error, req.headers.language ) )
        }
    }
    else
    {
        errorMetric( "league.present", Constants.PARAMS_ERROR, duration_start )

        console.error('League Present: PARAMS_ERROR')
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.PARAMS_ERROR, null, req.headers.language ) )
    }

}

export default present