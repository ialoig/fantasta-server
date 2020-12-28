
import { createServer } from 'http'
import Socket from 'socket.io'

import * as a from './socket'

const init = ( app ) => {
    
    const server = createServer(app)
    const io = Socket(server)

    io.on( 'connection', () => {
        console.log("Socket.io connected")
    })

    io.on( 'connect', () => {
        console.log("Socket.io connect")
    })
    
    app.set('io', io)

    return server
}

export { init }