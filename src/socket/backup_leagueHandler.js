import Joi from "joi" // validation library
import { EVENT_TYPE, Message } from "./common"

// Payload Schema
const joinPayloadSchema = Joi.object({
  room: Joi.string().max(30).required(),
  player: Joi.string().max(30).required()
})


//----------------------------------------------------------

function extractPlayersNames(socket_list, exclude_socket = null) {
  return socket_list
    .filter(socket => socket !== exclude_socket)
    .map(socket => socket.player)
}

//----------------------------------------------------------

async function getSocketsInRoom(io, room) {
  return io.in(room).fetchSockets()
}

//----------------------------------------------------------

const onDisconnect = function (socket) {
  console.log(`[socketID_1: ${socket}] disconnected`)
  console.log(`[socketID: ${socket.id}] disconnected`)
}

//----------------------------------------------------------

module.exports = (io) => {

  io.on("connection", function (socket) {
    console.log(`[socketID: ${socket.id}] connected`)

    // Disconnect
    // socket.on("disconnect", function () {
    //   console.log(`[socketID_1: ${socket}] disconnected`)
    //   console.log(`[socketID: ${socket.id}] disconnected`)
    // })
    socket.on("disconnect", function() { onDisconnect(socket)} )

    // Disconnecting
    socket.on('disconnecting', async function () {
      const rooms = Array.from(socket.rooms).slice(1) // Set { <socket.id>, "room1", "room2", ... }
      for (const room of rooms) {
        const socket_list = await getSocketsInRoom(io, room)
        const message_content = extractPlayersNames(socket_list, socket)
        const message = new Message(EVENT_TYPE.SERVER.LEAGUE.USER_OFFLINE, message_content)
        io.in(room).emit(room, message)
      }
    });

    // Join League (TODO: check if we really want a callback)
    socket.on(EVENT_TYPE.CLIENT.LEAGUE.USER_ONLINE, async function (payload, callback) {

      // Validate arguments
      if (typeof callback !== "function") {
        return socket.disconnect()
      }
      const { error, value } = joinPayloadSchema.validate(payload)
      if (error) {
        return callback({
          status: "KO",
          error
        })
      }

      // Extract from payload
      const { room, player } = value
      console.log(`[socketID: ${socket.id}] ${player} joined ${room}`)

      // Add custom information to the socket object
      socket.player = player

      // Join Room
      socket.join(room)

      // Response back to client
      callback({
        status: "OK"
      })

      const socket_list = await getSocketsInRoom(io, room)
      const message_content = extractPlayersNames(socket_list)
      const message_obj = new Message(EVENT_TYPE.SERVER.LEAGUE.USER_ONLINE, message_content)
      console.log(message_obj)

      // Send message to all socket in the room
      io.in(room).emit(room, message_obj)
    })

  })

}
