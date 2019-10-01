
import { Router } from 'express';
import { default as apis } from './apis';

let routing = Router()

//----- MIDDLEWARE FUNCTION TO AUTHENTICATE THE API CALLS -----//
// const middleAuth = async (req, res, next) =>
// {
//     console.log('Request URL: ', req.originalUrl);
//     console.log('Request Type: ', req.method);
//     console.log('Request Path: ', req.path);
//     let token = req.query && req.query.token || '';
//     console.log('Request Token: ', token);
//     const host = req.get('host');
//     console.log('Request Host: ', host);
//     const apiConfig = {
//         url: `${host}${req.path}`,
//         method: req.method
//     };
//     const authConfig = {
//         url: `http://${host}/fantasta/api/auth/vallidate`,
//         method: 'POST',
//         body: {
//             token: token
//         },
//         json: true
//     };
//     if (req.method === 'POST' || req.method === 'PUT') {
//         apiConfig.body =  JSON.stringify(req.body);
//     }
//     // if ( process.env.NODE_ENV=='dev' )
//     // {
//     //     next()
//     // }
//     let auth = {}
//     try
//     {
//         request(authConfig, (error, response, body) => {
//             if(error) {
//                 console.error(error)
//                 next(error);
//             }
//             else {
//                 console.log(response)
//                 console.log(body)
//                 res.status(response.statusCode).send(body);
//             }
//         });
//         // auth = await rp(authConfig)
//         // console.log(auth)
//         request(apiConfig, (error, response, body) => {
//             if(error) {
//                 console.error(error)
//                 next(error);
//             }
//             else {
//                 res.status(response.statusCode).send(body);
//             }
//         });
//     }
//     catch (error)
//     {
//         console.error(error)
//         err.type = 'NOT_AUTHORIZED_TOKEN';
//         next(err);
//     }
//     next();
// }
// routing.use(middleAuth);


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
