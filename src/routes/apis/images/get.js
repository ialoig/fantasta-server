import { resolve } from "path"
import { metricApiError, metricApiSuccess } from "../../../metrics"
import { Errors, Response } from "../../../utils"

// eslint disabled for 'next' params - it has to be defined even if not used
// eslint-disable-next-line no-unused-vars
const get = (req, res, next) => {

	const duration_start = process.hrtime()

	let image = req.params.image || ""
    
	if ( image )
	{
		metricApiSuccess("images.get", "", duration_start)

		res.sendFile(resolve( `./public/${image}`))
	}
	else
	{
		console.error(`[api] images.get: ${Errors.IMAGE_NOT_FOUND.status}`)
		metricApiError("images.get", Errors.IMAGE_NOT_FOUND, duration_start)

		res.status(404).send(Response.reject(Errors.IMAGE_NOT_FOUND, req.headers.language))
	}
}

export default get
