// import Joi from "joi" // validation library
import { EVENT_TYPE, getSocketsInRoom, extractPlayersNames, isLeagueRoom, isMarketRoom, getMarketRoom, getPlayerTurn } from "./common"
import { Schemas } from "./schemas"

//------------------------------------------------------------------------------

/**
 * 
 * @param {*} payload to be validated
 * @param {*} newUser whether the user is joining the league for the first time
 * @returns 
 */
const validateUserNewOrOnline = (payload, newUser) => {
  if (newUser) {
    return Schemas.clientLeagueUserNewSchema.validate(payload)
  }
  else {
    return Schemas.clientLeagueUserOnlineSchema.validate(payload)
  }
}

//------------------------------------------------------------------------------

/**
 * 
 * @param {*} newUser whether the user is joining the league for the first time
 * @returns event type depending on the newUser parameter passed
 */
const eventTypeUserNewOrOnline = (newUser) => {
  if (newUser) {
    return EVENT_TYPE.SERVER.LEAGUE.USER_NEW
  }
  else {
    return EVENT_TYPE.SERVER.LEAGUE.USER_ONLINE
  }
}

//------------------------------------------------------------------------------

/**
 * Add socket to the room passed in the payload. 
 * Enhances socket object with username.
 * Broadcast the list of online users to the room.
 * 
 * @param {*} io        socket server
 * @param {*} socket    socket client
 * @param {*} payload   { room, user }
 * @param {*} callback  sent back to the client as ack/nack
 * @param {*} newUser   whether the user is joining the league for the first time
 * @returns 
 */
const onUserNewOrOnline = async (io, socket, payload, callback, newUser) => {
  // Assert callback is passed
  if (typeof callback !== "function") { return socket.disconnect() }

  // Validate payload
  const payload_validation = validateUserNewOrOnline(payload, newUser)
  if (payload_validation.error) { return callback({ status: "KO", error }) }

  // Extract from payload
  const { room, user } = payload_validation.value

  // Add custom information to the socket object
  socket.user = user

  // Join Room
  socket.join(room)
  console.log(`[leagueHandler] socketID: ${socket.id} - ${user} online in ${room} (newUser=${newUser})`)

  // Response back to client
  callback({ status: "OK" })

  // prepare message
  const socket_list = await getSocketsInRoom(io, room)
  const message_validated = Schemas.serverLeagueUserNewOrOnlineSchema.validate(extractPlayersNames(socket_list))

  // Send message to all sockets in the room
  io.in(room).emit(eventTypeUserNewOrOnline(newUser), message_validated.value)
}

//------------------------------------------------------------------------------

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
    console.log(`[leagueHandler] socketID: ${socket.id} - ${socket.user} deleted from ${room}`)
    socket.leave(room)

    // prepare message
    const socket_list = await getSocketsInRoom(io, room)
    const message = extractPlayersNames(socket_list)
    const message_validated = Schemas.serverUserDeletedSchema.validate(message)
    if (isLeagueRoom(room)) {
      io.in(room).emit(EVENT_TYPE.SERVER.LEAGUE.USER_DELETED, message_validated.value)
    }
  }
}

//------------------------------------------------------------------------------

/**
 * Remove socket from each room.
 * Broadcast the list of online users to the league room.
 * @param {*} io      socket server
 * @param {*} socket  socket client
 */
const onUserOffline = async (io, socket) => {
  const rooms = Array.from(socket.rooms).slice(1) // Set { <socket.id>, "room1", "room2", ... }
  for (const room of rooms) {
    socket.leave(room)
    console.log(`[leagueHandler] socketID: ${socket.id} - ${socket.user} offline in ${room}`)

    // prepare message
    const socket_list = await getSocketsInRoom(io, room)
    const message = extractPlayersNames(socket_list)
    const message_validated = Schemas.serverUserOfflineSchema.validate(message)
    if (isLeagueRoom(room)) {
      io.in(room).emit(EVENT_TYPE.SERVER.LEAGUE.USER_OFFLINE, message_validated.value)
    }
  }
}

//------------------------------------------------------------------------------

/**
 * Add socket to the market room.
 * Broadcast the list of online users to the league room.
 * 
 * @param {*} io      socket server
 * @param {*} socket  socket client
 */
const onMarketOpen = async (io, socket) => {
  // retrieve league room
  const league_room = Array.from(socket.rooms).slice(1).find(room => isLeagueRoom(room))

  // socket didn't join the league room
  if (!league_room) {
    console.error(`[leagueHandler] socketID: ${socket.id} - try to open market but did not joined the league room`)
    // TODO: maybe a callback to inform the client?
  }
  else {
    const market_room = getMarketRoom(league_room)

    // Join Market room
    socket.join(market_room)
    console.log(`[leagueHandler] socketID: ${socket.id} - ${socket.user} open market ${market_room}`)

    // prepare message
    const socket_list = await getSocketsInRoom(io, market_room)
    const message = extractPlayersNames(socket_list)
    message["user"] = socket.user // add user information to the message
    const message_validated = Schemas.serverMarketOpenSchema.validate(message)
    if (message_validated.error) {
      console.log(`[leagueHandler] socketID: ${socket.id} - validation error: ${message_validated.error}`)
    }
    else {
      // Send message to all sockets in the room
      io.in(league_room).emit(EVENT_TYPE.SERVER.MARKET.OPEN, message_validated.value)
    }
  }
}

//------------------------------------------------------------------------------

/**
 * Add socket to the market room.
 * Broadcast the list of online users to the market room.
 * @param {*} io 
 * @param {*} socket 
 */
const onMarketUserOnline = async (io, socket) => {
  // retrieve league room
  const league_room = Array.from(socket.rooms).slice(1).find(room => isLeagueRoom(room))

  // socket didn't join the league room
  if (!league_room) {
    console.error(`[leagueHandler] socketID: ${socket.id} - try to join market room but did not joined the league room`)
    // TODO: maybe a callback to inform the client?
  }
  else {
    const market_room = getMarketRoom(league_room)

    // market room do not exists
    if (!io.sockets.adapter.rooms.get(market_room)) {
      console.error(`[leagueHandler] socketID: ${socket.id} - ${socket.user} try to join ${market_room} but the market is not open yet`)
      // TODO: maybe a callback to inform the client?
    }
    else {
      // Join Market room
      socket.join(market_room)
      console.log(`[leagueHandler] socketID: ${socket.id} - ${socket.user} join market ${market_room}`)

      // prepare message
      const socket_list = await getSocketsInRoom(io, market_room)
      const message = extractPlayersNames(socket_list)
      const message_validated = Schemas.serverMarketUserOnlineSchema.validate(message)

      if (message_validated.error) {
        console.log(`[leagueHandler] socketID: ${socket.id} - validation error: ${message_validated.error}`)
      }
      else {
        // Send message to all sockets in the room
        io.in(league_room).emit(EVENT_TYPE.SERVER.MARKET.USER_ONLINE, message_validated.value)
      }
    }
  }
}

//------------------------------------------------------------------------------

const onMarketStart = async (io, socket) => {
  // retrieve league room
  const league_room = Array.from(socket.rooms).slice(1).find(room => isLeagueRoom(room))

  // socket didn't join the league room
  if (!league_room) {
    console.error(`[leagueHandler] socketID: ${socket.id} - ${socket.user} try to start market but did not joined the league room`)
    // TODO: maybe a callback to inform the client?
  }
  else {
    const market_room = Array.from(socket.rooms).slice(1).find(room => isMarketRoom(room))

    // socket didn't join the market room
    if (!market_room) {
      console.error(`[leagueHandler] socketID: ${socket.id} - ${socket.user} try to start market but did not joined the market room`)
      // TODO: maybe a callback to inform the client?
    }
    else {
      // prepare message
      const socket_list = await getSocketsInRoom(io, market_room)
      const message = extractPlayersNames(socket_list)
      const message_validated = Schemas.serverMarketUserOnlineSchema.validate(message)

      if (message_validated.error) {
        console.log(`[leagueHandler] socketID: ${socket.id} - validation error: ${message_validated.error}`)
      }
      else {

        // Send message to all sockets in the room
        io.in(league_room).emit(EVENT_TYPE.SERVER.MARKET.START, message_validated.value)

        // prepare message
        const message_turn = getPlayerTurn(message)
        const message_turn_validated = Schemas.serverMarketSearchSchema.validate(message_turn)

        if (message_turn_validated.error) {
          console.log(`[leagueHandler] socketID: ${socket.id} - validation error: ${message_turn_validated.error}`)
        }
        else {
          io.in(market_room).emit(EVENT_TYPE.SERVER.MARKET.SEARCH, message_turn_validated.value)
        }
      }
    }
  }
}

//------------------------------------------------------------------------------

// TODO: 
// add callback 
// check that market is open. Add open variable to the room object ??
const onMarketFootballPlayerSelectedOrBet = async (io, socket, payload, bet) => {
  console.log(`[00000] onMarketFootballPlayerSelectedOrBet`)

  // Assert callback is passed
  // if (typeof callback !== "function") { return socket.disconnect() }

  // Validate payload
  const payload_validation = Schemas.clientMarketFootballPlayerSelected.validate(payload)
  if (payload_validation.error) {
    console.log(`[leagueHandler] socketID: ${socket.id} - validation error: ${payload_validation.error}`)
    return
    //return callback({ status: "KO", error })
  }

  // retrieve league room
  const league_room = Array.from(socket.rooms).slice(1).find(room => isLeagueRoom(room))

  // socket didn't join the league room
  if (!league_room) {
    console.error(`[leagueHandler] socketID: ${socket.id} - try to select player but did not joined the league room`)
    // TODO: maybe a callback to inform the client?
  }
  else {
    const market_room = Array.from(socket.rooms).slice(1).find(room => isMarketRoom(room))

    // socket didn't join the market room
    if (!market_room) {
      console.error(`[leagueHandler] socketID: ${socket.id} - try to select player but did not joined the market room`)
      // TODO: maybe a callback to inform the client?
    }
    else {

      // prepare message
      const message = payload_validation.value
      message["user"] = socket.user // add user information to the message
      const message_validated = Schemas.serverMarketFootballPlayerSelected.validate(message)

      if (message_validated.error) {
        console.log(`[leagueHandler] socketID: ${socket.id} - validation error: ${message_validated.error}`)
      }
      else {
        // Send message to all sockets in the market room
        if (bet) {
          io.in(market_room).emit(EVENT_TYPE.SERVER.MARKET.BET, message_validated.value)
        }
        else {
          io.in(market_room).emit(EVENT_TYPE.SERVER.MARKET.PLAYER_SELECTED, message_validated.value)
        }
      }
    }
  }
}

//------------------------------------------------------------------------------

module.exports = (io, socket) => {

  // Join League (TODO: check if we really want a callback)
  socket.on(EVENT_TYPE.CLIENT.LEAGUE.USER_NEW, (payload, callback) => { onUserNewOrOnline(io, socket, payload, callback, true) })
  socket.on(EVENT_TYPE.CLIENT.LEAGUE.USER_ONLINE, (payload, callback) => { onUserNewOrOnline(io, socket, payload, callback, false) })
  socket.on(EVENT_TYPE.CLIENT.LEAGUE.USER_DELETED, () => { onUserDeleted(io, socket) })
  socket.on(EVENT_TYPE.CLIENT.LEAGUE.USER_OFFLINE, () => { onUserOffline(io, socket) })
  socket.on(EVENT_TYPE.CLIENT.MARKET.OPEN, () => { onMarketOpen(io, socket) })
  socket.on(EVENT_TYPE.CLIENT.MARKET.USER_ONLINE, () => { onMarketUserOnline(io, socket) })
  socket.on(EVENT_TYPE.CLIENT.MARKET.START, () => { onMarketStart(io, socket) })
  socket.on(EVENT_TYPE.CLIENT.MARKET.PLAYER_SELECTED, (payload) => { onMarketFootballPlayerSelectedOrBet(io, socket, payload, false) })
  socket.on(EVENT_TYPE.CLIENT.MARKET.BET, (payload) => { onMarketFootballPlayerSelectedOrBet(io, socket, payload, true) })
}
