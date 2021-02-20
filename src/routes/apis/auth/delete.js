import { Constants, Response, userUtils } from '../../../utils'


/** 
 * @route DELETE api/auth/deleteAccount
 * 
* */
const deleteAccount = async (req, res, next) => {
    let body = req.body || {}
    const { password } = body
    console.log("[deleteAccount] - params: email=" +email);
    try {
        
        const auth = await userUtils.userFromToken(req);
        const user = auth.user;
        console.log("[deleteAccount] - found userID=" +user._id)
        if (password) {
            
            if ( user.password != password  ) {
                console.error("[deleteAccount] - ", Constants.WRONG_PASSWORD)
                res.status(404).send( Response.reject( Constants.BAD_REQUEST, Constants.WRONG_PASSWORD, null ) )
            } 
            else {
                //user.remove();
            }
        }
    } catch (error) {
        console.log("[deleteAccount] - error while deleting user : " +error)
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, error ) )
    }
}
