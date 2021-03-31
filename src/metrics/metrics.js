import * as prometheusClient from 'prom-client'
import { Errors } from '../utils'

export const prometheusRegister = prometheusClient.register

// Possible status values for labeling a metric
export const METRIC_STATUS = {
    SUCCESS: "success",
    ERROR: "error"
}

// Add a default label which is added to all metrics
prometheusClient.register.setDefaultLabels({
    app: 'fantasta-server'
})

// Enable the collection of default metrics
prometheusClient.collectDefaultMetrics()

// Utility function to extract seconds
export const secondsFrom = (start_time) => {
    let end = process.hrtime(start_time)
    return end[0] + end[1] / 1000000 / 1000
}

// Histograms
export const load_footballPlayer_duration_seconds = new prometheusClient.Histogram({
    name: 'load_footballPlayer_duration_seconds',
    help: 'seconds duration for loading footballPlayers',
    labelNames: ['status', 'msg']
});

const api_duration_seconds = new prometheusClient.Histogram({
    name: 'api_duration_seconds',
    help: 'seconds duration for api calls',
    labelNames: ['name', 'status', 'msg']
})

// Gauges
const api_payload_bytes = new prometheusClient.Gauge({
    name: 'api_payload_bytes',
    help: 'keep track of api response payload size',
    labelNames: ['name']
});


// Counters
export const mongodb_connection_status_counter = new prometheusClient.Counter({
    name: 'mongodb_connection_status_counter',
    help: 'counter for mongodb connection statuses',
    labelNames: ['status']
})

export const email_status_counter = new prometheusClient.Counter({
    name: 'email_status_counter',
    help: 'counter for email sending statuses',
    labelNames: ['status']
})


/**
 * 
 * @param {*} name : API name
 * @param {*} payload : json object
 */
export const metricApiPayloadSize = (name, payload) => {
    const size = Buffer.byteLength(JSON.stringify(payload), 'utf8')
    api_payload_bytes.labels(name = name).set(size);
}

/**
 * 
 * @param {*} name : API name
 * @param {*} msg : metric message
 * @param {*} duration_start : timer start duration
 */
export const metricApiSuccess = (name, msg, duration_start) => {
    api_duration_seconds.observe(
        {
            name: name,
            status: METRIC_STATUS.SUCCESS,
            msg: msg
        },
        secondsFrom(duration_start)
    )
}

/**
 * 
 * @param {*} name : API name
 * @param {*} error : from which extract metric message
 * @param {*} duration_start : timer start duration
 */
export const metricApiError = (name, error, duration_start) => {
    api_duration_seconds.observe(
        {
            name: name,
            status: METRIC_STATUS.ERROR,
            msg: error.status && Errors[error.status] || error // try to extract status from custom error
        },
        secondsFrom(duration_start))
}
