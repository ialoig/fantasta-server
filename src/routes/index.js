import { Router } from 'express'
import { default as apis } from './apis/index.js'

let routing = Router()

//----- AUTH APIS -----//
routing.route("/auth/register").post(apis.auth.register)
routing.route("/auth/login").put(apis.auth.login)
routing.route("/auth/token").put(apis.auth.token)
routing.route("/auth/update").put(apis.auth.update)
routing.route("/auth/deleteAccount").delete(apis.auth.deleteAccount)

//----- LEAGUE APIS -----//
routing.route("/league/create").post(apis.league.create)
routing.route("/league/join").put(apis.league.join)
routing.route("/league").get(apis.league.present)

//----- PLAYERS APIS -----//
routing.route("/footballPlayers").get(apis.footballPlayers.get)

//----- METRICS APIS -----//
routing.route("/metrics").get(apis.metrics.get)

export default routing
