
import { Router } from 'express';
import { default as apis } from './apis';

let routing = Router()

//----- AUCTION APIS -----//
routing.route('/auction')
    .get(apis.auction.get);

//----- LEAGUE APIS -----//
routing.route('/league')
    .get(apis.league.present);
routing.route('/league')
    .post(apis.league.create);
routing.route('/league')
    .post(apis.league.join);

//----- PPLAYERS APIS -----//
routing.route('/players')
    .get(apis.players.get);

export default routing;
