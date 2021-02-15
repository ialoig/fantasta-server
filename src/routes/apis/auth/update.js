import { Constants, Response, userUtils } from '../../../utils'

const update = async ( req, res, next ) => {
    let body = req.body || {}
    const { id, email, username } = body

    //check if email exists and then modify email 
    if (id && email) {
        console.log("trying to update id["+id+"] with newEmail["+email+"]");
        //calling find and update function: it returns user updated if found
        userUtils.findAndUpdateEmailUser(id, email, (err, updatedUser) => {
            if (err) {
                console.log("Error: " +err)
                return next(err)
            }
            if (!updatedUser) {
                console.log("Callback function not found!")
                return next("Callback function not found!")
            }
            console.log("returning updated user =" +updatedUser)
            res.json( Response.resolve( Constants.OK, updatedUser ) )
        });
    }

    //check if username exists and then modify email 
    if (id && username) {
        console.log("trying to update id["+id+"] with newUsername["+username+"]");
        //calling find and update function: it returns user updated if found
        userUtils.findAndUpdateNameUser(id, username, (err, updatedUser) => {
            if (err) {
                console.log("Error: " +err)
                return next(err)
            }
            if (!updatedUser) {
                console.log("Callback function not found!")
                return next("Callback function not found!")
            }
            console.log("returning updated user =" +updatedUser)
            res.json( Response.resolve( Constants.OK, updatedUser ) )
        });
    }
}


export default update