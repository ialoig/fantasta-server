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

## 📌 SOLUZIONE 1: LISTA MERCATO UNICA

* La `Lista statistiche` aggiornata periodicamente da fantagazzetta; Nuovo schema nel DB `Statistics`

* La `Lista completa` aggiornata periodicamente da fantagazzetta; se un giocatore lascia la SerieA è eliminato dalla lista

* La `Lista eliminati` contiene una lista di footballPlayer che vengono eliminati dalla `Lista completa`. Nuovo schema nel DB `FootballPlayersDeleted`

* La `Lista mercato` creata al momento della creazione del mercato, come snapshot della `Lista completa` in quel momento. E' un array di oggetti definito come:

```shell
{
    _id: Number,
    actualPrice: Number
}
```

Quando il mobile parte:

* footballPlayers.get
* footballPlayersDeleted.get (usando la stessa logica con il controllo versione)
* statistics.get (usando la stessa logica con il controllo versione)

Quando il mobile fa Market.create:

* il server crea la `Lista mercato` a partire dalla `Lista completa` e la salva in `market.footballPlayers`

```shell
{
    _id: Number,
    actualPrice: Number
}
```

Dopo che il client fa Market.create/Market.join, nell'oggetto market abbiamo la lista di giocatori congelata al momento della creazione del market.

Con l'ausilio di `Lista completa` e `Lista eliminati` possiamo recuperare tutte le informazioni dei giocatori del market, che giochino ancora in Serie A o meno (basta fare accesso a uno delle due liste)

es:

1. giocatore id = 123
1. Lista completa[123] -> prendo tutte le informazioni
1. Lista eliminati[123] -> prendo tutte le informazioni, solo se non presente in Lista completa
1. betHistory[123] -> prendo le informazioni di team e di valore di acquisto

#### STATISTICHE

Sembrerebbe che i giocatori venduti all'estero non vengono eliminati, quindi abbiamo a disposizione le informazioni di tutti i calciatori.

### ✏️ TODO

⬜️ modificare schema in DB `FootballPlayers`. Contiene la lista dei giocatori anno per anno (aggiungi campo `season: "2020-2021"`). Rimuovere `statistics`

```shell
season: String
version: Number,
list: {
    type: Object
}
```

⬜️ Modificare API `footballPlayers.get` per ottenere solo la lista dei giocatori (senza `statistiche`)

⬜️ creare nuovo schema in DB `Statistics`. Contiene le statistiche anno per anno (aggiungi campo `season: "2020-2021"`)

```shell
season: String
version: Number,
list: {
    type: Object
}
```

⬜️ Creare API `statistics.get` per ottenere la `Lista statistiche`.
Usare logica controllo versione per capire se il client ha bisogno di scaricare la nuova lista.

⬜️ creare nuovo schema in DB `FootballPlayersDeleted`. Contiene i giocatori eliminati anno per anno (aggiungi campo `season: "2020-2021"`).
Popolato come diff tra `FootballPlayers` del DB e `FootballPlayers` nuovo con schema uguale a `FootballPlayers`:

```shell
season: String
version: Number,
list: {
    type: Object
}
```

⬜️ Creare API `footballPlayersDeleted.get` per ottenere la `Lista eliminati`.
Usare logica controllo versione per capire se il client ha bisogno di scaricare la nuova lista.

⬜️ modifica allo schema market con aggiunta del campo `market.footballPlayers` come Array di oggetti.

```shell
{
    id: Number,
    actualPrice: Number
}
```

Popolare il campo `market.footballPlayers` alla creazione del market ordinato in base a `league.auctionType`, ovvero:

* `auctionType=RANDOM` -> ordinamento random
* `auctionType=ALFABETICO` -> ordinamento alfabetico

⬜️ modifica allo schema market con aggiunta del campo `market.footballPlayersIndex` come Number.

Utilizzato dal server come indice di accesso all'array `market.footballPlayers` per capire quale giocatore deve essere lanciato all'asta per i casi
`auctionType=RANDOM` e `auctionType=ALFABETICO`. Altrimenti `market.footballPlayersIndex=null`

⬜️ gestione app meno sicure per l'invio di email tramite google account
<https://support.google.com/accounts/answer/6010255?authuser=1&p=lsa_blocked&hl=it&authuser=1&visit_id=637846110020700193-994282476&rd=1#more-secure-apps&zippy=%2Cse-lopzione-accesso-app-meno-sicure-%C3%A8-attiva-per-il-tuo-account%2Cusare-una-password-per-lapp>

### ❓ Come verificare se un giocatore è disponibile e reperire le informazioni di acquisto

* dato l'ID di un giocatore (es: footballPlayerID=123):
    1. se *betHistory[123]* esiste -> il giocatore e' stato gia' acquistato, mostro il team e il valore di acquisto
    1. se *footballPlayers[123]* esiste -> il giocatore è ancora in SerieA e svincolato, mostro le sue informazioni
    1. se *footballPlayersDeleted[123]* esiste -> il giocatore non e' piu' in serieA, mostro il flag `deleted`
    1. Errore in tutti gli altri casi
    > N.B: i casi sopra sono mutuamente esclusivi

### 🗂 USE CASES

### 1. Pagina `Players` a mercato non esistente

*Voglio visualizzare la lista di giocatori completa e aggiornata*

* mostro tutta la lista giocatori presa da `footballPlayers` e le relative informazioni

### 2. Pagina `Players` a mercato aperto

*Voglio visualizzare i giocatori disponibili nel mercato e non gli eventuali nuovi arrivi, in modo da avere coerenza tra la lista di giocatori che posso selezionare quando c'è l'asta in corso e la lista nella pagina Players.*

* prendo l'oggetto `market` aperto
* prendo la lista giocatori da `market.footballPlayers` che contiene la lista dei giocatori disponibili per quel mercato
* verifica giocatore disponibile e informazioni di acquisto (vedi paragrafo *Come verificare se un giocatore è disponibile e reperire le informazioni di acquisto*)

### 3. Pagina `Players` a mercato chiuso

_Voglio visualizzare la lista completa di giocatori, comprensiva dei nuovi arrivi. I giocatori già acquistati dai partecipanti devono mostrare le informazioni del `nome del Team` e del `valore di acquisto`_

* prendo la lista giocatori da `footballPlayers`
* prendo l'oggetto `market` (ultimo in ordine temporale)
* verifica giocatore disponibile e informazioni di acquisto (vedi paragrafo *Come verificare se un giocatore è disponibile e reperire le informazioni di acquisto*)

### 4. Lista `seleziona giocatore` nell'asta

*Voglio visualizzare la lista giocatori del mercato, esclusi quelli che sono già stati assegnati, ovvero solo gli svincolati*

* prendo l'oggetto `market` aperto
* prendo la lista giocatori da `market.footballPlayers` che contiene la lista dei giocatori disponibili per quel mercato
* verifica giocatore disponibile (vedi paragrafo *Come verificare se un giocatore è disponibile e reperire le informazioni di acquisto*)

### 5. Apertura `nuovo mercato` quando è già stato eseguito un mercato precedentemente (es. apertura mercato di Gennaio)

*Devo creare una nuova lista giocatori e visualizzare le informzioni dei giocatori che sono stati già stati assegnati con la/le asta/e precedente/i*

* inizializzo `market.footballPlayer` con `Lista completa`
* `market.betHistory` non viene cancellato ma contiene lo storico delle aste precedenti
* verifica giocatore disponibile e informazioni di acquisto (vedi paragrafo *Come verificare se un giocatore è disponibile e reperire le informazioni di acquisto*)

## 📌 SOLUZIONE 2: LISTA GIOCATORI CON FLAG DELETED

* La `Lista statistiche` aggiornata periodicamente da fantagazzetta; Nuovo schema nel DB `Statistics`

* La `Lista completa` aggiornata periodicamente da fantagazzetta; se un giocatore lascia la SerieA deve essere flaggato come deleted (`deleted=true`)

* La `Lista mercato` creata al momento della creazione del mercato, come snapshot della `Lista completa` in quel momento dei soli giocatori disponibili `deleted=false`. E' un array di oggetti definito come:

```shell
{
    _id: Number,
    actualPrice: Number
}
```

Quando il mobile parte:

* footballPlayers.get
* statistics.get (usando la stessa logica con il controllo versione)

Quando il mobile fa Market.create:

* il server crea la `Lista mercato` a partire dalla `Lista completa` e la salva in `market.footballPlayers`

```shell
{
    _id: Number,
    actualPrice: Number
}
```

Dopo che il client fa Market.create/Market.join, nell'oggetto market abbiamo la lista di giocatori congelata al momento della creazione del market.

Con l'ausilio di `Lista completa` possiamo recuperare tutte le informazioni dei giocatori del market, che giochino ancora in Serie A o meno

es:

1. giocatore id = 123
1. Lista completa[123] -> prendo tutte le informazioni
1. betHistory[123] -> prendo le informazioni di team e di valore di acquisto

#### STATISTICHE

Sembrerebbe che i giocatori venduti all'estero non vengono eliminati, quindi abbiamo a disposizione le informazioni di tutti i calciatori.

### ✏️ TODO

⬜️ modificare schema in DB `FootballPlayers`. Contiene la lista dei giocatori anno per anno (aggiungi campo `season: "2020-2021"`). Rimuovere `statistics`

```shell
season: String
version: Number,
list: {
    type: Object
}
```

⬜️ Modificare API `footballPlayers.get` per ottenere solo la lista dei giocatori (senza `statistiche`)

⬜️ creare nuovo schema in DB `Statistics`. Contiene le statistiche anno per anno (aggiungi campo `season: "2020-2021"`)

```shell
season: String
version: Number,
list: {
    type: Object
}
```

⬜️ Creare API `statistics.get` per ottenere la `Lista statistiche`.
Usare logica controllo versione per capire se il client ha bisogno di scaricare la nuova lista.

⬜️ modifica allo schema market con aggiunta del campo `market.footballPlayers` come Array di oggetti.

```shell
{
    id: Number,
    actualPrice: Number
}
```

Popolare il campo `market.footballPlayers` alla creazione del market ordinato in base a `league.auctionType`, ovvero:

* `auctionType=RANDOM` -> ordinamento random
* `auctionType=ALFABETICO` -> ordinamento alfabetico

⬜️ modifica allo schema market con aggiunta del campo `market.footballPlayersIndex` come Number.

Utilizzato dal server come indice di accesso all'array `market.footballPlayers` per capire quale giocatore deve essere lanciato all'asta per i casi
`auctionType=RANDOM` e `auctionType=ALFABETICO`. Altrimenti `market.footballPlayersIndex=null`

⬜️ gestione app meno sicure per l'invio di email tramite google account
<https://support.google.com/accounts/answer/6010255?authuser=1&p=lsa_blocked&hl=it&authuser=1&visit_id=637846110020700193-994282476&rd=1#more-secure-apps&zippy=%2Cse-lopzione-accesso-app-meno-sicure-%C3%A8-attiva-per-il-tuo-account%2Cusare-una-password-per-lapp>

### ❓ Come verificare se un giocatore è disponibile e reperire le informazioni di acquisto

* dato l'ID di un giocatore (es: footballPlayerID=123):
    1. se *betHistory[123]* esiste -> il giocatore e' stato gia' acquistato, mostro il team e il valore di acquisto
    1. recupero *footballPlayers[123]* -> se il giocatore ha il flag *deleted=true* significa che non è più in serieA e mostro il flag `deleted`
    1. Errore in tutti gli altri casi
    > N.B: i casi sopra sono mutuamente esclusivi

### 🗂 USE CASES

### 1. Pagina `Players` a mercato non esistente

*Voglio visualizzare la lista di giocatori completa e aggiornata*

* mostro tutta la lista giocatori presa da `footballPlayers` e le relative informazioni

### 2. Pagina `Players` a mercato aperto

*Voglio visualizzare i giocatori disponibili nel mercato e non gli eventuali nuovi arrivi, in modo da avere coerenza tra la lista di giocatori che posso selezionare quando c'è l'asta in corso e la lista nella pagina Players.*

* prendo l'oggetto `market` aperto
* prendo la lista giocatori da `market.footballPlayers` che contiene la lista dei giocatori disponibili per quel mercato
* verifica giocatore disponibile e informazioni di acquisto (vedi paragrafo *Come verificare se un giocatore è disponibile e reperire le informazioni di acquisto*)

### 3. Pagina `Players` a mercato chiuso

_Voglio visualizzare la lista completa di giocatori, comprensiva dei nuovi arrivi. I giocatori già acquistati dai partecipanti devono mostrare le informazioni del `nome del Team` e del `valore di acquisto`_

* prendo la lista giocatori da `footballPlayers`
* prendo l'oggetto `market` (ultimo in ordine temporale)
* verifica giocatore disponibile e informazioni di acquisto (vedi paragrafo *Come verificare se un giocatore è disponibile e reperire le informazioni di acquisto*)

### 4. Lista `seleziona giocatore` nell'asta

*Voglio visualizzare la lista giocatori del mercato, esclusi quelli che sono già stati assegnati, ovvero solo gli svincolati*

* prendo l'oggetto `market` aperto
* prendo la lista giocatori da `market.footballPlayers` che contiene la lista dei giocatori disponibili per quel mercato
* verifica giocatore disponibile (vedi paragrafo *Come verificare se un giocatore è disponibile e reperire le informazioni di acquisto*)

### 5. Apertura `nuovo mercato` quando è già stato eseguito un mercato precedentemente (es. apertura mercato di Gennaio)

*Devo creare una nuova lista giocatori e visualizzare le informzioni dei giocatori che sono stati già stati assegnati con la/le asta/e precedente/i*

* inizializzo `market.footballPlayer` con `Lista completa`
* `market.betHistory` non viene cancellato ma contiene lo storico delle aste precedenti
* verifica giocatore disponibile e informazioni di acquisto (vedi paragrafo *Come verificare se un giocatore è disponibile e reperire le informazioni di acquisto*)
