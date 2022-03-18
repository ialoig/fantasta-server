import { prometheusRegister } from "../../../metrics"

// eslint disabled for 'next' params - it has to be defined even if not used
// eslint-disable-next-line no-unused-vars
export const get = async (req, res, next) => {

	// fetch current metrics
	let metrics = await prometheusRegister.metrics()
    
	res.setHeader("Content-Type", prometheusRegister.contentType)
	res.send(metrics)
}
