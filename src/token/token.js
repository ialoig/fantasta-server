
import { sign, verify } from 'jsonwebtoken'

const Create = ( tokenPassword, email, password ) =>
{
    return sign(
        {
            email,
            password
        },
        tokenPassword,
        {
            algorithm: 'HS256',
            expiresIn: "31d"
        }
    )
}

const Verify = ( token, tokenPassword ) =>
{
    try
    {
        let decoded = verify( token, tokenPassword, { algorithm: 'HS256' } )
        
        /*
            decoded = {
                email: 'ciao',
                password: 'ciao',
                iat: 1490347709,
                exp: 4212561780
            }
        */

        let newToken = Create( tokenPassword, decoded.email, decoded.password )

        decoded.token = newToken

        return decoded
    }
    catch (err)
    {
        /*
            err = {
                name: 'TokenExpiredError',
                message: 'jwt expired',
                expiredAt: 1408621000
            }
        */
        /*
            err = {
                name: 'JsonWebTokenError',
                message: 'jwt malformed'
            }
        */
        /*
            err = {
                name: 'NotBeforeError',
                message: 'jwt not active',
                date: 2018-10-04T16:10:44.000Z
            }
        */

        err.error = true

        return err
    }
    
}

export { Create, Verify }