import { createServer } from 'http'
import * as socketio from 'socket.io'

export const init = ( app ) => {
    
    const server = createServer(app)
    const io = new socketio.Server();
    io.attach(server);

    io.on( 'connection', () => {
        console.log("Socket.io connected")
    })

    io.on( 'connect', () => {
        console.log("Socket.io connect")
    })
    
    app.set('io', io)

    return server
}
