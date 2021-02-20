
import { Constants, Response, userUtils } from '../../../utils'

/** 
 * @route DELETE api/auth/deleteAccount
* */
const deleteAccount = async (req, res, next) =>
{
    const { password } = req.body
    if ( password )
    {
        try
        {
            const auth = await userUtils.userFromToken(req);
            const user = auth.user;
            console.log("[deleteAccount] - found userID=" +user._id)
            
            if ( user.password != password  ) {
                console.error("[deleteAccount] - ", Constants.WRONG_PASSWORD)
                res.status(404).send( Response.reject( Constants.BAD_REQUEST, Constants.WRONG_PASSWORD, null, req.headers.language ) )
            } 
            else {
                //user.remove();
            }
        }
        catch (error)
        {
            console.log("Auth Delete: ", error)
            res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, error, req.headers.language ) )
        }
    }
    else
    {
        console.error('Auth Delete: PARAMS_ERROR')
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.PARAMS_ERROR, null, req.headers.language ) )
    }
}

export default deleteAccount