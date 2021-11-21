import Joi from "joi" // validation library
import { EVENT_TYPE, Message, getSocketsInRoom, extractPlayersNames } from "./common"


// Payload Schema
const joinPayloadSchema = Joi.object({
  room: Joi.string().max(30).required(),
  player: Joi.string().max(30).required()
})

//----------------------------------------------------------

const onUserOnline = async (io, socket, payload, callback) => {

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
  callback({ status: "OK" })

  const socket_list = await getSocketsInRoom(io, room)
  const message_content = extractPlayersNames(socket_list)
  const message_obj = new Message(EVENT_TYPE.SERVER.LEAGUE.USER_ONLINE, message_content)
  console.log(message_obj)

  // Send message to all socket in the room
  io.in(room).emit(room, message_obj)
}

//----------------------------------------------------------

module.exports = (io, socket) => {

  // Join League (TODO: check if we really want a callback)
  socket.on(EVENT_TYPE.CLIENT.LEAGUE.USER_ONLINE, function (payload, callback) { onUserOnline(io, socket, payload, callback) })
}
