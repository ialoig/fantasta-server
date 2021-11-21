import { createServer } from 'http'
import { Server } from "socket.io"
const registerLeagueHandlers = require("./leagueHandler")

export const init = (app) => {

    const httpServer = createServer(app)

    const io = new Server(httpServer, { /* options */ })
    
    registerLeagueHandlers(io)

    return httpServer

}
