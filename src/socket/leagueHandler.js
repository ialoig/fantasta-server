// import Joi from "joi" // validation library
import { EVENT_TYPE, getSocketsInRoom, extractPlayersNames } from "./common"
import { Schemas } from "./schemas"


//----------------------------------------------------------

const onUserNew = async (io, socket, payload, callback) => {/* TODO */}

//----------------------------------------------------------

const onUserDeleted = async (io, socket, payload, callback) => {/* TODO */}

//----------------------------------------------------------

const onUserOnline = async (io, socket, payload, callback) => {

  // Validate arguments
  if (typeof callback !== "function") {
    return socket.disconnect()
  }
  const userOnlineClient_validation = Schemas.userOnlineClientSchema.validate(payload)
  if (userOnlineClient_validation.error) {
    return callback({
      status: "KO",
      error
    })
  }

  // Extract from payload
  const { room, player } = userOnlineClient_validation.value
  console.log(`[socketID: ${socket.id}] ${player} joined ${room}`)

  // Add custom information to the socket object
  socket.player = player

  // Join Room
  socket.join(room)

  // Response back to client
  callback({ status: "OK" })

  const socket_list = await getSocketsInRoom(io, room)
  const message_content = extractPlayersNames(socket_list)
  const userOnlineServer_validation = Schemas.userOnlineServerSchema.validate({ event_type: EVENT_TYPE.SERVER.LEAGUE.USER_ONLINE, data: message_content})

  // Send message to all socket in the room
  io.in(room).emit(room, userOnlineServer_validation.value)
}

//----------------------------------------------------------

const onUserOffline = async (io, socket, payload, callback) => {/* TODO */}

//----------------------------------------------------------

module.exports = (io, socket) => {

  // Join League (TODO: check if we really want a callback)
  socket.on(EVENT_TYPE.CLIENT.LEAGUE.USER_NEW, function (payload, callback) { onUserNew(io, socket, payload, callback) })
  socket.on(EVENT_TYPE.CLIENT.LEAGUE.USER_DELETED, function (payload, callback) { onUserDeleted(io, socket, payload, callback) })
  socket.on(EVENT_TYPE.CLIENT.LEAGUE.USER_ONLINE, function (payload, callback) { onUserOnline(io, socket, payload, callback) })
  socket.on(EVENT_TYPE.CLIENT.LEAGUE.USER_OFFLINE, function (payload, callback) { onUserOffline(io, socket, payload, callback) })
}
