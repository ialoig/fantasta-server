
export const prometheusClient = require('prom-client')

// Possible status values for labeling a metric
const METRIC_STATUS = {
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
const load_footballPlayer_duration_seconds = new prometheusClient.Histogram({
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

export const saveMetric = ( name, msg, start ) =>
{
    api_duration_seconds.observe(
        {
            name: name,
            status: METRIC_STATUS.SUCCESS,
            msg: msg
        },
        secondsFrom(start)
    )
}

export const errorMetric = ( name, msg, start ) =>
{
    api_duration_seconds.observe(
        {
            name: name,
            status: METRIC_STATUS.ERROR,
            msg
        },
        secondsFrom(start)
    )
}

export const loadPlayersMetric = ( start ) =>
{
    load_footballPlayer_duration_seconds.observe(
        {
            status: METRIC_STATUS.SUCCESS,
            msg: ""
        },
        secondsFrom(start)
    )
}

export const errorPlayersMetric = ( error, start ) =>
{
    load_footballPlayer_duration_seconds.observe(
        {
            status: METRIC_STATUS.ERROR,
            msg: error
        }, secondsFrom(start))
}
