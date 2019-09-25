
import { Router } from 'express';
import { auction, league, players } from './apis';

let routing = Router()

routing.route('/auction')
    .get(auction.get);

routing.route('/league')
    .get(league.present);

routing.route('/league')
    .post(league.create);

routing.route('/league')
    .post(league.join);

routing.route('/players')
    .get(players.get);

routing.use('/asta', routing);

export default routing;
