
import { resolve } from 'path'

import { Errors, Response } from '../../../utils'
import { metricApiError, metricApiSuccess } from '../../../metrics'

const get = (req, res, next) => {

    const duration_start = process.hrtime()

    let image = req.params.image || ''
    
    if ( image )
    {
        metricApiSuccess("images.get", '', duration_start)

        res.sendFile(resolve( `./public/${image}`));
    }
    else
    {
        console.error(`[api] images.get: ${Errors.IMAGE_NOT_FOUND.status}`)
        metricApiError("images.get", Errors.IMAGE_NOT_FOUND, duration_start)

        res.status(404).send(Response.reject(Errors.IMAGE_NOT_FOUND, req.headers.language))
    }
}

export default get
