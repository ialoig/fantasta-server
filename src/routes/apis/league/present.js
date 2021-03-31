import { League } from '../../../database'
import { Errors, Response, userUtils } from '../../../utils'
import { metricApiError, metricApiSuccess } from '../../../metrics'

const present = async (req, res, next) => {
    const duration_start = process.hrtime()

    const { leaguename = '' } = req.query

    if (leaguename) {
        try {
            await userUtils.userFromToken(req)
            let present = await League.findOne({ name: leaguename })
            metricApiSuccess("league.present", '', duration_start)
            res.json(!!present)
        }
        catch (error) {
            console.error(`[api] league.present: ${error}`)
            metricApiError("league.present", error, duration_start)
            res.status(400).send(Response.reject(error, req.headers.language))
        }
    }
    else {
        console.error(`[api] league.present: ${Errors.PARAMS_ERROR.status}`)
        metricApiError("league.present", Errors.PARAMS_ERROR, duration_start)
        res.status(400).send(Response.reject(Errors.PARAMS_ERROR, req.headers.language))
    }

}

export default present
