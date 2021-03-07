
import { FootballPlayer } from '../../../database/index.js'
import { Constants, Response } from '../../../utils/index.js'
import { metricApiError, metricApiSuccess, metricApiPayloadSize } from '../../../metrics/index.js'

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
            console.error("FootballPlayer object is empty")
            metricApiError("footballPlayer.get", "EMPTY_OBJECT", duration_start)
            res.json(Response.resolve(Constants.OK, response))
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
            res.json(Response.resolve(Constants.OK, response))
        }
    }
    catch (error) {
        console.error('Get FootballPlayers: ', error)
        metricApiError("footballPlayer.get", error, duration_start)
        res.status(400).send(Response.reject(Constants.BAD_REQUEST, Constants[error] || Constants.BAD_REQUEST, error, req.headers.language))
    }
}

export default get
