# 💻 Fantasta server

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
mongo
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

## How to drop database

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
fantasta_server    | [seed]  ... done
fantasta_server    | [seed] insert markets (empty): 12
fantasta_server    | [seed]  ... done
fantasta_server    | [seed] insert teams: 14
fantasta_server    | [seed]  ... done
fantasta_server    | [seed] Done. Database seeded!
```

# ESLINT

They are two types of module syntax for nodejs. The `commonJS` syntax, that uses **require** and **module.exports**, and the `ES syntax`, that use **import * from "path"** style of module.

By default, `nodejs` will try to load modules with the CommonJS syntax. If you want to use the ES syntax, you must specify `"type":"module"` in your `package.json`. But you can't mix them up. You can use one syntax, but not both

## [@babel/eslint-parser](https://www.npmjs.com/package/@babel/eslint-parser)

### When should I use @babel/eslint-parser?

ESLint's default parser and core rules [only support the latest final ECMAScript standard](https://github.com/eslint/eslint/blob/a675c89573836adaf108a932696b061946abf1e6/README.md#what-about-experimental-features) and do not support experimental (such as new features) and non-standard (such as Flow or TypeScript types) syntax provided by Babel. @babel/eslint-parser is a parser that allows ESLint to run on source code that is transformed by Babel.

**Note:** You only need to use @babel/eslint-parser if you are using Babel to transform your code. If this is not the case, please use the relevant parser for your chosen flavor of ECMAScript (note that the default parser supports all non-experimental syntax as well as JSX).

### How does it work?

ESLint allows for the use of [custom parsers](https://eslint.org/docs/developer-guide/working-with-custom-parsers). When using this plugin, your code is parsed by Babel's parser (using the configuration specified in your [Babel configuration file](https://babeljs.io/docs/en/configuration)) and the resulting AST is
transformed into an [ESTree](https://github.com/estree/estree)-compliant structure that ESLint can understand. All location info such as line numbers,
columns is also retained so you can track down errors with ease.

**Note:** ESLint's core rules do not support experimental syntax and may therefore not work as expected when using `@babel/eslint-parser`. Please use the companion [`@babel/eslint-plugin`](https://github.com/babel/babel/tree/main/eslint/babel-eslint-plugin) plugin for core rules that you have issues with.

## [@babel/eslint-plugin](https://github.com/babel/babel/tree/main/eslint/babel-eslint-plugin)

Companion rules for `@babel/eslint-parser`. `@babel/eslint-parser` does a great job at adapting `eslint`
for use with Babel, but it can't change the built-in rules to support experimental features.
`@babel/eslint-plugin` re-implements problematic rules so they do not give false positives or negatives.

# 📑 NOTES

Il tema è la gestione della lista giocatori all'interno del Market

### SOLUZIONE PROPOSTA

### 📌 LISTA MERCATO UNICA

* La `Lista mercato` viene creata al momento della creazione del mercato, a partire dalla `Lista completa` aggiornata ogni giorno dal server.

* La `Lista completa` recepisce tutti gli aggiornamenti; se un giocatore viene trasferito è eliminato dalla lista

* La `Lista mercato` viene salvata nel db market nel campo "footballPlayers" come un array di oggetti definito come sotto:

```shell
{
    _id: Number,
    name: String,
    actualPrice: Number
}
```

### 👍 PRO

* l'asta parte con una lista bloccata che non recepisce nessun tipo di aggiornamento

### 👎 CONTRO

* se l'asta dura più giorni, la lista è aggiornata alla data di inizio del mercato
* se per qualche motivo risulta necessario avere ulteriori informazioni del giocatore, e questo è stato eliminato, non è possibile averle

### 🙌 ASSUNZIONI

* il mercato ha un unica lista generata al momento della creazione del mercato stesso
* la lista rimane invariata fino alla chiusura del mercato
* se l'id di un giocatore è presente nella `Lista mercato` ma non è presente nella `Lista completa`, viene considerato come eliminato

### ✏️ TODO

⬜️ creazione del campo "market.footballPlayers" come Array di oggetti

⬜️ popolamento del campo "market.footballPlayers" alla creazione del market

⬜️ determinare l'ordinamento del campo "market.footballPlayers" in base a league.auctionType, ovvero:

* auctionType=RANDOM -> ordinamento random

### ❓ OPEN POINTS

1. la "Lista mercato" può non avere tutte le informazioni necessarie; quando un giocatore viene eliminato, le informazioni sono solo quelle presenti nella "Lista mercato" (in quanto nella "Lista completa" il giocatore è stato eliminato).

Ipotesi:

A) mantenera la `Lista completa` con tutti i giocatori compresi quelli eliminati ed effettuareun job di pulizia (da capitre)

B) gestione delle statistiche per i giocatori eliminati; queste vengono visualizzate nellalista giocatori del team (team.footballPlayers)
