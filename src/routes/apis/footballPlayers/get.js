
import { FootballPlayers } from "../../../database"
import { metricApiError, metricApiPayloadSize, metricApiSuccess } from "../../../metrics"
import { Response } from "../../../utils"

const get = async (req, res, next) => {
	const duration_start = process.hrtime()

	try {
		let data = await FootballPlayers.findOne()

		let response = {
			version: "",
			list: {},
			statistics: {},
			updated: false,
		}

		if (!data) {
			console.error("[api] footballPlayers.get: object is empty")
			metricApiError("footballPlayers.get", "EMPTY_OBJECT", duration_start)
			res.json(Response.resolve(response))
		}
		else {
			let dbVersion = data.version ? parseInt(data.version) : 0
			let mobileVersion = req.query.version ? parseInt(req.query.version) : 0

			response = {
				version: dbVersion,
				list: dbVersion === mobileVersion ? {} : data.list,
				statistics: dbVersion === mobileVersion ? {} : data.statistics,
				updated: mobileVersion !== dbVersion,
			}

			metricApiSuccess("footballPlayers.get", "", duration_start)
			metricApiPayloadSize("footballPlayers.get", response)
			res.json(Response.resolve(response))
		}
	}
	catch (error) {
		console.error(`[api] footballPlayers.get: ${error}`)
		metricApiError("footballPlayers.get", error, duration_start)
		res.status(400).send(Response.reject(error, req.headers.language))
	}
}

export default get
