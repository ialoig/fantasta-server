
import { FootballPlayer } from '../../../database'
import { Errors, Response } from '../../../utils'
import { metricApiError, metricApiSuccess, metricApiPayloadSize } from '../../../metrics'

const get = async (req, res, next) => {
    const duration_start = process.hrtime()

    try {
        let footballPlayers = await FootballPlayer.findOne()

        let response = {
            version: '',
            footballPlayers: {},
            updated: false,
        }

        if (!footballPlayers) {
            console.error(`[api] footballPlayer.get: object is empty`)
            metricApiError("footballPlayer.get", "EMPTY_OBJECT", duration_start)
            res.json(Response.resolve(response))
        }
        else {
            let dbVersion = footballPlayers.version ? parseInt(footballPlayers.version) : 0
            let mobileVersion = req.query.version ? parseInt(req.query.version) : 0

            response = {
                version: dbVersion,
                footballPlayers: dbVersion === mobileVersion ? {} : footballPlayers.footballPlayers,
                updated: mobileVersion !== dbVersion,
            }

            metricApiSuccess("footballPlayer.get", '', duration_start)
            metricApiPayloadSize("footballPlayer.get", response)
            res.json(Response.resolve(response))
        }
    }
    catch (error) {
        console.error(`[api] footballPlayer.get: ${error}`)
        metricApiError("footballPlayer.get", error, duration_start)
        res.status(400).send(Response.reject(error, req.headers.language))
    }
}

export default get
