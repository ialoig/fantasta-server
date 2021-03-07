import { prometheusRegister } from '../../../metrics/index.js'

export const get = async (req, res, next) => {

    // fetch current metrics
    let metrics = await prometheusRegister.metrics()
    
    res.setHeader('Content-Type', prometheusRegister.contentType)
    res.send(metrics)
}
