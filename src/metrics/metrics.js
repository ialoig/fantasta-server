export const prometheusClient = require('prom-client')

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
export const api_duration_seconds = new prometheusClient.Histogram({
    name: 'api_duration_seconds',
    help: 'seconds duration for api calls',
    labelNames: ['name', 'status', 'msg'],
});

export const load_footballPlayer_duration_seconds = new prometheusClient.Histogram({
    name: 'load_footballPlayer_duration_seconds',
    help: 'seconds duration for loading footballPlayers',
    labelNames: ['status', 'msg'],
});
