import Validator from 'validator'
import config from 'config'

import { Constants, Response, userUtils, tokenUtils } from '../../../utils'

/** 
 * @route PUT api/auth/update
 * 
* */
const update = async ( req, res, next ) => {
    let body = req.body || {}
    const { email, username } = body
    console.log("[update] - params: email=" +email+ ", username="+username);
    
    try {
        const auth = await userUtils.userFromToken(req);
        const user = auth.user;
        const userID = user._id
        console.log("[update] - found userID=" +userID)
        
        //check email validity
        if ( email && !Validator.isEmail(email)) {
            console.error("[update] - email["+email+"] is not valid")
            res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, null ) )
        }
        
        let response = {
            user: user,
            token: auth.token
        }
        let newValues = {};
        let isEmail = false;
        //setting variable to be udapted and verifing that values are different from actual
        if (email) {
            if (user.email != email) {
                newValues = { email: email }
                isEmail = true;
            } else {
                console.log("[update] - no update needed. return");
                return res.status(200).send(Response.resolve(Constants.OK, response))
            }
        } else if (username) {
            if (user.name != username) {
                newValues = { name: username }
            } else {
                console.log("[update] - no update needed. return")
                return res.status(200).send(Response.resolve(Constants.OK, response))
            }
        } else if (email && username) {
            if ((email && email != user.email) && (username && user.name != username)) {
                isEmail = true;
                newValues = {
                    email: email,
                    name: username
                }
            } else {
                console.log("[update] - no update needed. return")
                return res.status(200).send(Response.resolve(Constants.OK, response))
            }
        }
        
        let updatedUser = await userUtils.findAndUpdateUser(userID, newValues);
        console.log("[update] - returning updated user=" +updatedUser.email+ ", "+updatedUser.name)
        //creating response: token must refreshed cause email has been updated
        response = {
            user: updatedUser,
            token: tokenUtils.Create( config.token.kid, updatedUser.email, updatedUser.password )
        }
        if (isEmail) {
            console.log("\tcreating new token (cause email is changed) ...")
            response = {
                user: updatedUser,
                token: tokenUtils.Create( config.token.kid, email, updatedUser.password )
            }
        }
        return res.json( Response.resolve( Constants.OK, response ) )
        
    } catch (error) {
        console.log("[update] - error while updating user : " +error)
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, error ) )
    }
}


export default update