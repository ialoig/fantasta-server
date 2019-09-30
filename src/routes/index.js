
import { Router } from 'express';
import { default as apis } from './apis';

let routing = Router()

//----- MIDDLEWARE FUNCTION TO AUTHENTICATE THE API CALLS -----//
routing.use((req, res, next) =>
{
    console.log('Request URL: ', req.originalUrl);

    console.log('Request Type: ', req.method);

    let token = req.query && req.query.token || '';
    console.log('Request Token: ', token);
    
    next();
});

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

routing.use('/asta', routing);

export default routing;
