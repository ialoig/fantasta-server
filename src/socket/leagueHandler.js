// import Joi from "joi" // validation library
import { EVENT_TYPE, getSocketsInRoom, extractPlayersNames } from "./common"
import { Schemas } from "./schemas"

//----------------------------------------------------------

function validateUserNewOrOnline(payload, newUser){
  if(newUser){
    return Schemas.clientLeagueUserNewSchema.validate(payload)
  }
  else{
    return Schemas.clientLeagueUserOnlineSchema.validate(payload)
  }
}

//----------------------------------------------------------

function eventTypeUserNewOrOnline(newUser){
  if(newUser){
    return EVENT_TYPE.SERVER.LEAGUE.USER_NEW
  }
  else{
    return EVENT_TYPE.SERVER.LEAGUE.USER_ONLINE
  }
}

//----------------------------------------------------------

const onUserNewOrOnline = async (io, socket, payload, callback, newUser) => {
  // Validate arguments
  if (typeof callback !== "function") {
    return socket.disconnect()
  }
  const payload_validation = validateUserNewOrOnline(payload, newUser)
  if (payload_validation.error) {
    return callback({
      status: "KO",
      error
    })
  }

  // Extract from payload
  const { room, player } = payload_validation.value
  console.log(`[socketID: ${socket.id}] ${player} (newUser=${newUser}) joined ${room}`)

  // Add custom information to the socket object
  socket.player = player

  // Join Room
  socket.join(room)

  // Response back to client
  callback({ status: "OK" })

  const socket_list = await getSocketsInRoom(io, room)
  const message_validated = Schemas.serverLeagueUserOnlineSchema.validate(extractPlayersNames(socket_list))

  // Send message to all socket in the room
  io.in(room).emit(eventTypeUserNewOrOnline(newUser), message_validated.value)
}

//----------------------------------------------------------

const onUserDeleted = async (io, socket, payload, callback) => {/* TODO */}

//----------------------------------------------------------

const onUserOffline = async (io, socket, payload, callback) => {/* TODO */}

//----------------------------------------------------------

module.exports = (io, socket) => {

  // Join League (TODO: check if we really want a callback)
  socket.on(EVENT_TYPE.CLIENT.LEAGUE.USER_NEW, function (payload, callback) { onUserNewOrOnline(io, socket, payload, callback, true) })
  socket.on(EVENT_TYPE.CLIENT.LEAGUE.USER_ONLINE, function (payload, callback) { onUserNewOrOnline(io, socket, payload, callback, false) })
  socket.on(EVENT_TYPE.CLIENT.LEAGUE.USER_DELETED, function (payload, callback) { onUserDeleted(io, socket, payload, callback) })
  socket.on(EVENT_TYPE.CLIENT.LEAGUE.USER_OFFLINE, function (payload, callback) { onUserOffline(io, socket, payload, callback) })
}
