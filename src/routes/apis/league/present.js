
import { League } from '../../../database'
import { Constants, Response, userUtils } from '../../../utils'
import { secondsFrom, METRIC_STATUS, api_duration_seconds } from "../../../metrics"

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
        
            api_duration_seconds.observe({ name: "league.present", status: METRIC_STATUS.SUCCESS, msg: ""}, secondsFrom(duration_start))

            res.json( !!present )
        }
        catch (error)
        {
            api_duration_seconds.observe({ name: "league.present", status: METRIC_STATUS.ERROR, msg: Constants[error] || Constants.BAD_REQUEST}, secondsFrom(duration_start))

            console.error('League Valid: ', error)
            res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants[error] || Constants.BAD_REQUEST, error, req.headers.language ) )
        }
    }
    else
    {
        api_duration_seconds.observe({ name: "league.present", status: METRIC_STATUS.ERROR, msg: Constants.PARAMS_ERROR}, secondsFrom(duration_start))

        console.error('League Valid: PARAMS_ERROR')
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.PARAMS_ERROR, null, req.headers.language ) )
    }

}

export default present