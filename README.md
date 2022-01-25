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



# 🌱 MONGO DB

## Useful commands

To open a `MongoDB CLI` run the command:

```shell
$ mongo
```

Show all databases instances:

```shell
> show dbs
```

It will show you all the databases instances.
```shell
admin           0.000GB
config          0.000GB
fantasta_debug  0.000GB
fantasta_test   0.000GB
local           0.000GB
```

You can now select what do you prefer by running:

```shell
> use fantasta_debug
```

The selected instance is now active. You can nwo query tables inside.

`Users` table :

```shell
> db.users.find()
```

`Teams` table :

```shell
> db.teams.find()
```

`Leagues` table :

```shell
> db.leagues.find()
```

Find a `user` with a specific email:

```shell
> db.users.find({email: "user02@email.com"})
```

## Drop database
You can drob entire instance by running the following command:

```shell
> db.dropDatabase()
```

Now all the entries within the db instance are deleted. You can restart the server instance to get a new seed of entries (it will run automatically when it does not found any entries).

> NOTE: Please check server console log to view if Seed has been executed correctyl at startup (it will show you something like below)
```shell
fantasta_server    | [seed] user found in db: 1
fantasta_server    | [seed] starting to seed db ...
fantasta_server    | [seed] insert users: 10
fantasta_server    | [seed] insert leagues: 12
fantasta_server    | [seed] 	... done
fantasta_server    | [seed] insert markets (empty): 12
fantasta_server    | [seed] 	... done
fantasta_server    | [seed] insert teams: 14
fantasta_server    | [seed] 	... done
fantasta_server    | [seed] Done. Database seeded!
```
