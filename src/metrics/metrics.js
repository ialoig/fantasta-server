
export const prometheusClient = require('prom-client')

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

export const metricApiError = (name, msg, duration_start) => {
    api_duration_seconds.observe(
        {
            name: name,
            status: METRIC_STATUS.ERROR,
            msg: msg
        },
        secondsFrom(duration_start))
}
