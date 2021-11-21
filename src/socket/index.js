import { createServer } from 'http'
import { Server } from "socket.io"
const registerLeagueHandlers = require("./leagueHandler")
import { EVENT_TYPE, getSocketsInRoom, extractPlayersNames } from "./common"
import { Schemas } from "./schemas"

// --------------------------------------------------

const onDisconnect = function (socket) {
    console.log(`[socketID: ${socket.id}] disconnected`)
}

// --------------------------------------------------

const onDisconnecting = async function (io, socket) {
    const rooms = Array.from(socket.rooms).slice(1) // Set { <socket.id>, "room1", "room2", ... }
    for (const room of rooms) {
        const socket_list = await getSocketsInRoom(io, room)
        const message_content = extractPlayersNames(socket_list, socket)
        const userOfflineServer_validation = Schemas.userOfflineServerSchema.validate({ event_type: EVENT_TYPE.SERVER.LEAGUE.USER_OFFLINE, data: message_content})
        io.in(room).emit(room, userOfflineServer_validation.value)
    }
}

// --------------------------------------------------

const onConnection = (io, socket) => {
    console.log(`[socketID: ${socket.id}] connected`)
    registerLeagueHandlers(io, socket)

    // Disconnect
    socket.on("disconnect", function () { onDisconnect(socket) })

    // Disconnecting
    socket.on('disconnecting', function () { onDisconnecting(io, socket) })
}

// --------------------------------------------------

export const init = (app) => {

    const httpServer = createServer(app)

    const io = new Server(httpServer, { /* options */ })

    // Handle socket connections
    io.on("connection", function (socket) { onConnection(io, socket) })

    return httpServer

}
