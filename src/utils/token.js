import jsonwebtoken from "jsonwebtoken"
const { sign, verify } = jsonwebtoken

const Create = ( tokenPassword, email, password, username ) =>
{
	return sign(
		{
			email,
			password,
			username
		},
		tokenPassword,
		{
			algorithm: "HS256",
			expiresIn: "31d"
		}
	)
}

const Verify = ( token, tokenPassword ) =>
{
	try
	{
		let decoded = verify( token, tokenPassword, { algorithm: "HS256" } )
		/*
            decoded = {
                email: 'ciao',
                password: 'ciao',
                username: 'ciao',
                iat: 1490347709,
                exp: 4212561780
            }
        */
		let newToken = Create( tokenPassword, decoded.email, decoded.password, decoded.username )
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

const Get = ( req ) =>
{
	let authorization = req.header("Authorization") || req.header("authorization") ||  ""
    
	let auth = authorization && authorization.split && authorization.split(" ")

	return auth[0]=="Bearer" ? auth[1] : auth[0]
}

export default {
	Create,
	Verify,
	Get
}
