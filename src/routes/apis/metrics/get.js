import { prometheusClient } from "../../../metrics"

export const get = async (req, res, next) => {

    // fetch current metrics
    let metrics = await prometheusClient.register.metrics()
    
    res.setHeader('Content-Type', prometheusClient.register.contentType)
    res.send(metrics)
}
