
import { Router } from "express"
import { default as apis } from "./apis"

let routing = Router()

//----- AUCTION APIS -----//
routing.route("/auction").get(apis.auction.get)

//----- AUTH APIS -----//
routing.route("/auth/token").post(apis.auth.token)
routing.route("/auth/login").put(apis.auth.login)
routing.route("/auth/register").post(apis.auth.register)

//----- LEAGUE APIS -----//
routing.route("/league").get(apis.league.present)
routing.route("/league").post(apis.league.create)
routing.route("/league").post(apis.league.join)

//----- PLAYERS APIS -----//
routing.route("/footballPlayers").get(apis.footballPlayers.get)

export default routing;
