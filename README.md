# Fantasta server

Server side of the fantasta application. It receives API calls from the mobile application querying the mongodb if necessary. It handles also the football player auction that is running on different devices belonging to the same league.

## Dependencies

1. docker
2. npm
3. node

## Build, Test, Run

We use docker to launch the application in different environments: debug, test, production.

### Docker

#### Test with docker

It spawns the *fantasta_mongo* and *fantasta_server* docker containers. Then run tests in the *fantasta_server* container.

```npm run docker-test```

#### Run with docker (DEBUG)

It spawns the *fantasta_mongo* and *fantasta_server* docker containers in **debug** mode. It mounts local *src* directory in the *fantasta_server* container and run the server with *nodemon* -> any local change in */src* directory will trigger a server restart with the new code.

```npm run docker-debug```

#### Run with docker (PRODUCTION)

It spawns the *fantasta_mongo* and *fantasta_server* docker containers in **production** mode. Run the server as a service in the background.

```npm run docker-prod```

### Local

#### Test locally

Run tests on the local machine (requires docker mongo to be running already)

```npm run test```

#### Run locally (DEBUG)

Run tests on the local machine (requires docker mongo to be running already)

```npm run debug```

## Monitoring

Prometheus and Grafana docker containers are responsible for getting and showing metrics produced by the application. [Prometheus client](https://github.com/siimon/prom-client) is running on the server and it is collecting metrics from the application. The server itself exposes those metrics via API call that prometheus docker container is scraping at regular intervals.
Prometheus containers is later on sending those metrics to the grafana container making them available in the dashboards.

Useful links:

* [Server metric API call](http://localhost:3000/fantasta/metrics)
* [Collected metrics by Prometheus](http://localhost:9090)
* [Grafana](http://localhost:3001)
