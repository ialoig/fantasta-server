import { createServer } from 'http'
import { Server } from "socket.io"
const registerEventHandlers = require("./eventHandler")
import { EVENT_TYPE, getSocketsInRoom, extractUserId, isLeagueRoom, isMarketRoom} from "./common"
import { socket_event_counter } from "../metrics"
import { Schemas } from "./schemas"

// --------------------------------------------------

const onDisconnect = function (socket) {
    socket_event_counter.inc({ event_type: "disconnected"})
    console.log(`[socketID: ${socket.id}] disconnected`)
}

// --------------------------------------------------

const onDisconnecting = async function (io, socket) {
    socket_event_counter.inc({ event_type: "disconnecting"})
    const rooms = Array.from(socket.rooms).slice(1) // Set { <socket.id>, "room1", "room2", ... }
    console.log(`[socketID: ${socket.id}] disconnecting from rooms [${rooms}]`)
    for (const room of rooms) {
        const socket_list = await getSocketsInRoom(io, room)
        const message = extractUserId(socket_list, socket)
        const message_validated = Schemas.serverUserOfflineSchema.validate(message)
        if (isLeagueRoom(room)){
            io.in(room).emit(EVENT_TYPE.SERVER.LEAGUE.USER_OFFLINE, message_validated.value)
        }
        else if (isMarketRoom(room)){
            io.in(room).emit(EVENT_TYPE.SERVER.MARKET.USER_OFFLINE, message_validated.value)
        }
        else {
            console.log(`[socketID: ${socket.id}] leaving room ${room} that is not a League nor a Market`)
        }
    }
}

// --------------------------------------------------

const onConnection = (io, socket) => {
    socket_event_counter.inc({ event_type: "connected"})
    console.log(`[socketID: ${socket.id}] connected`)
    
    // Event Handler
    registerEventHandlers(io, socket)

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
