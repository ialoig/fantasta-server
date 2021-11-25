// import Joi from "joi" // validation library
import { EVENT_TYPE, getSocketsInRoom, extractPlayersNames, league_prefix, market_prefix, isLeagueRoom, isMarketRoom, getMarketRoom } from "./common"
import { Schemas } from "./schemas"

//----------------------------------------------------------

function validateUserNewOrOnline(payload, newUser) {
  if (newUser) {
    return Schemas.clientLeagueUserNewSchema.validate(payload)
  }
  else {
    return Schemas.clientLeagueUserOnlineSchema.validate(payload)
  }
}

//----------------------------------------------------------

function eventTypeUserNewOrOnline(newUser) {
  if (newUser) {
    return EVENT_TYPE.SERVER.LEAGUE.USER_NEW
  }
  else {
    return EVENT_TYPE.SERVER.LEAGUE.USER_ONLINE
  }
}

/**
 * Add socket to the room passed in the payload. 
 * Enhances socket object with username.
 * Broadcast the list of online users to the room.
 * 
 * @param {*} io        socket server
 * @param {*} socket    socket client
 * @param {*} payload   { room, player }
 * @param {*} callback  sent back to the client as ack/nack
 * @param {*} newUser   whether the user is joining the league for the first time
 * @returns 
 */
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
  console.log(`[socketID: ${socket.id}] ${player} online in ${room} (newUser=${newUser})`)

  // Add custom information to the socket object
  socket.player = player

  // Join Room
  socket.join(room)

  // Response back to client
  callback({ status: "OK" })

  const socket_list = await getSocketsInRoom(io, room)
  const message_validated = Schemas.serverLeagueUserNewOrOnlineSchema.validate(extractPlayersNames(socket_list))

  // Send message to all socket in the room
  io.in(room).emit(eventTypeUserNewOrOnline(newUser), message_validated.value)
}

/**
 * Remove socket from each room.
 * Broadcast the list of online users to the league room.
 * 
 * @param {*} io      socket server
 * @param {*} socket  socket client
 */
const onUserDeleted = async (io, socket) => {
  const rooms = Array.from(socket.rooms).slice(1) // Set { <socket.id>, "room1", "room2", ... }
  for (const room of rooms) {
    console.log(`[socketID: ${socket.id}] ${socket.player} deleted from ${room}`)
    socket.leave(room)
    const socket_list = await getSocketsInRoom(io, room)
    const message = extractPlayersNames(socket_list)
    const message_validated = Schemas.serverUserDeletedSchema.validate(message)
    if (isLeagueRoom(room)) {
      io.in(room).emit(EVENT_TYPE.SERVER.LEAGUE.USER_DELETED, message_validated.value)
    }
  }
}

/**
 * Remove socket from each room.
 * Broadcast the list of online users to the league room.
 * @param {*} io      socket server
 * @param {*} socket  socket client
 */
const onUserOffline = async (io, socket) => {
  const rooms = Array.from(socket.rooms).slice(1) // Set { <socket.id>, "room1", "room2", ... }
  for (const room of rooms) {
    console.log(`[socketID: ${socket.id}] ${socket.player} offline in ${room}`)
    socket.leave(room)
    const socket_list = await getSocketsInRoom(io, room)
    const message = extractPlayersNames(socket_list)
    const message_validated = Schemas.serverUserOfflineSchema.validate(message)
    if (isLeagueRoom(room)) {
      io.in(room).emit(EVENT_TYPE.SERVER.LEAGUE.USER_OFFLINE, message_validated.value)
    }
  }
}

/**
 * Add socket to the market room.
 * Broadcast the list of online users to the market room.
 * 
 * @param {*} io      socket server
 * @param {*} socket  socket client
 */
const onMarketOpen = async (io, socket) => {
  // retrieve league room
  const rooms = Array.from(socket.rooms).slice(1) // Set { <socket.id>, "room1", "room2", ... }
  const league_room = rooms.find(room => isLeagueRoom(room))
  if (!league_room) {
    console.error(`[socketID: ${socket.id}] try to open market but did not joined the league room`)
  }
  else{
    const market_room = getMarketRoom(league_room)

    console.log(`[socketID: ${socket.id}] ${socket.player} open market ${market_room}`)

    // Join Market room
    socket.join(market_room)

    const socket_list = await getSocketsInRoom(io, market_room)
    const message = extractPlayersNames(socket_list)
    const message_validated = Schemas.serverMarketOpenSchema.validate(message)

    // Send message to all socket in the room
    io.in(market_room).emit(EVENT_TYPE.SERVER.MARKET.OPEN, message_validated.value)
  }
}


/**
 * 
 * @param {*} io 
 * @param {*} socket 
 */
const onMarketUserOnline = async (io, socket) => {
  // retrieve league room
  const rooms = Array.from(socket.rooms).slice(1) // Set { <socket.id>, "room1", "room2", ... }
  const league_room = rooms.find(room => isLeagueRoom(room))
  const market_room = getMarketRoom(league_room)

  console.log(`[socketID: ${socket.id}] ${socket.player} open market ${market_room}`)

  // Join Market room
  socket.join(market_room)

  const socket_list = await getSocketsInRoom(io, market_room)
  const message = extractPlayersNames(socket_list)
  const message_validated = Schemas.serverMarketUserOnlineSchema.validate(message)

  // Send message to all socket in the room
  io.in(league_room).emit(EVENT_TYPE.SERVER.MARKET.USER_ONLINE, message_validated.value)
}



//----------------------------------------------------------

module.exports = (io, socket) => {

  // Join League (TODO: check if we really want a callback)
  socket.on(EVENT_TYPE.CLIENT.LEAGUE.USER_NEW, (payload, callback) => { onUserNewOrOnline(io, socket, payload, callback, true) })
  socket.on(EVENT_TYPE.CLIENT.LEAGUE.USER_ONLINE, (payload, callback) => { onUserNewOrOnline(io, socket, payload, callback, false) })
  socket.on(EVENT_TYPE.CLIENT.LEAGUE.USER_DELETED, () => { onUserDeleted(io, socket) })
  socket.on(EVENT_TYPE.CLIENT.LEAGUE.USER_OFFLINE, () => { onUserOffline(io, socket) })
  socket.on(EVENT_TYPE.CLIENT.MARKET.OPEN, () => { onMarketOpen(io, socket) })
  socket.on(EVENT_TYPE.CLIENT.MARKET.USER_ONLINE, () => { onMarketUserOnline(io, socket) })
}
