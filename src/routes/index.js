
import { Router } from 'express'
import { default as apis } from './apis'

let routing = Router()

//----- AUCTION APIS -----//
routing.route('/auction')
    .get(apis.auction.get)

//----- LEAGUE APIS -----//
routing.route('/league')
    .get(apis.league.present)
routing.route('/league')
    .post(apis.league.create)
routing.route('/league')
    .post(apis.league.join)

//----- PLAYERS APIS -----//
routing.route('/footballPlayers')
    .get(apis.footballPlayers.get)

routing.route('/footballPlayersVersion')
    .get(apis.footballPlayers.getVersion)


routing.use('/asta', routing)

export default routing
