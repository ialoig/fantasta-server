// import Joi from "joi" // validation library
import { EVENT_TYPE, getSocketsInRoom, extractPlayersNames, isLeagueRoom, isMarketRoom, getMarketRoom, getPlayerTurn } from "./common"
import { Schemas } from "./schemas"

//------------------------------------------------------------------------------

const callbackSuccessObject = () => {
  return { status: "OK" }
}

const callbackErrorObject = (error) => {
  return { status: "KO", error: error }
}

const getSocketRooms = (socket) => {
  return Array.from(socket.rooms).slice(1) // socket.rooms = Set { <socket.id>, "room1", "room2", ... }
}

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
const onLeagueUserNewOrOnline = async (io, socket, payload, newUser, callback) => {
  // Assert callback is passed
  if (typeof callback !== "function") { return socket.disconnect() }

  // Validate payload
  const payload_validation = validateUserNewOrOnline(payload, newUser)
  if (payload_validation.error) {
    return callback(callbackErrorObject(payload_validation.error))  // TODO: error_code
  }

  // Extract from payload
  const { room, user } = payload_validation.value

  // Add custom information to the socket object
  socket.user = user

  // Join Room
  socket.join(room)
  console.log(`[leagueHandler] socketID: ${socket.id} - ${user} online in ${room} (newUser=${newUser})`)

  // prepare message
  const socket_list = await getSocketsInRoom(io, room)
  const message_validated = Schemas.serverLeagueUserNewOrOnlineSchema.validate(extractPlayersNames(socket_list))

  if (message_validated.error) {
    console.error(`[leagueHandler] socketID: ${socket.id} - validation error: ${message_validated.error}`)
    return callback(callbackErrorObject("INTERNAL SERVER ERROR")) // TODO: error_code
  }
  else {
    // Notify client message is received
    callback(callbackSuccessObject())

    // Send message to all sockets in the room
    io.in(room).emit(eventTypeUserNewOrOnline(newUser), message_validated.value)
  }
}

//------------------------------------------------------------------------------

/**
 * Remove socket from each room.
 * Broadcast the list of online users to the league room.
 * 
 * @param {*} io      socket server
 * @param {*} socket  socket client
 */
const onLeagueUserDeleted = async (io, socket, callback) => {
  // Assert callback is passed
  if (typeof callback !== "function") { return socket.disconnect() }

  const rooms = getSocketRooms(socket)

  if (rooms.length == 0){
    console.error(`[leagueHandler] socketID: ${socket.id} - try to delete user but did not joined any room`)
    return callback(callbackErrorObject("try to delete user but did not joined any room")) // TODO: error_code
  }

  for (const room of rooms) {
    console.log(`[leagueHandler] socketID: ${socket.id} - user: ${socket.user} deleted from ${room}`)
    socket.leave(room)

    // prepare message
    const socket_list = await getSocketsInRoom(io, room)
    const message = extractPlayersNames(socket_list)
    const message_validated = Schemas.serverUserDeletedSchema.validate(message)

    if (message_validated.error) {
      console.error(`[leagueHandler] socketID: ${socket.id} - validation error: ${message_validated.error}`)
      return callback(callbackErrorObject("INTERNAL SERVER ERROR")) // TODO: error_code
    }
    else {
      if (isLeagueRoom(room)) {
        // Notify client message is received
        callback(callbackSuccessObject())

        // Send message to all sockets in the room
        io.in(room).emit(EVENT_TYPE.SERVER.LEAGUE.USER_DELETED, message_validated.value)
      }
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
const onLeagueUserOffline = async (io, socket, callback) => {
  // Assert callback is passed
  if (typeof callback !== "function") { return socket.disconnect() }

  const rooms = getSocketRooms(socket)

  if (rooms.length == 0){
    console.error(`[leagueHandler] socketID: ${socket.id} - try to offline user but did not joined any room`)
    return callback(callbackErrorObject("try to offline user but did not joined any room")) // TODO: error_code
  }

  for (const room of rooms) {

    // leave room
    socket.leave(room)
    console.log(`[leagueHandler] socketID: ${socket.id} - user: ${socket.user} offline in ${room}`)

    // prepare message
    const socket_list = await getSocketsInRoom(io, room)
    const message = extractPlayersNames(socket_list)
    const message_validated = Schemas.serverUserOfflineSchema.validate(message)

    if (message_validated.error) {
      console.error(`[leagueHandler] socketID: ${socket.id} - validation error: ${message_validated.error}`)
      return callback(callbackErrorObject("INTERNAL SERVER ERROR")) // TODO: error_code
    }
    else {
      if (isLeagueRoom(room)) {
        // Notify client message is received
        callback(callbackSuccessObject())

        // Send message to all sockets in the room
        io.in(room).emit(EVENT_TYPE.SERVER.LEAGUE.USER_OFFLINE, message_validated.value)
      }
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
const onMarketOpen = async (io, socket, callback) => {
  // Assert callback is passed
  if (typeof callback !== "function") { return socket.disconnect() }

  // retrieve league room
  const league_room = getSocketRooms(socket).find(room => isLeagueRoom(room))

  // socket didn't join the league room
  if (!league_room) {
    console.error(`[leagueHandler] socketID: ${socket.id} - try to open market but did not joined the league room`)
    return callback(callbackErrorObject("try to open market but did not joined the league room")) // TODO: error_code
  }
  else {
    const market_room = getMarketRoom(league_room)

    // Join Market room
    socket.join(market_room)
    console.log(`[leagueHandler] socketID: ${socket.id} - user: ${socket.user} open market ${market_room}`)

    // prepare message
    const socket_list = await getSocketsInRoom(io, market_room)
    const message = extractPlayersNames(socket_list)
    message["user"] = socket.user // add user information to the message
    const message_validated = Schemas.serverMarketOpenSchema.validate(message)
    if (message_validated.error) {
      console.error(`[leagueHandler] socketID: ${socket.id} - validation error: ${message_validated.error}`)
      return callback(callbackErrorObject("INTERNAL SERVER ERROR")) // TODO: error_code
    }
    else {
      // Notify client message is received
      callback(callbackSuccessObject())

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
const onMarketUserOnline = async (io, socket, callback) => {
  // Assert callback is passed
  if (typeof callback !== "function") { return socket.disconnect() }

  // retrieve league room
  const league_room = getSocketRooms(socket).find(room => isLeagueRoom(room))

  // socket didn't join the league room
  if (!league_room) {
    console.error(`[leagueHandler] socketID: ${socket.id} - try to join market room but did not joined the league room`)
    return callback(callbackErrorObject("try to join market room but did not joined the league room")) // TODO: error_code
  }
  else {
    const market_room = getMarketRoom(league_room)

    // market room do not exists
    if (!io.sockets.adapter.rooms.get(market_room)) {
      console.error(`[leagueHandler] socketID: ${socket.id} - user: ${socket.user} try to join ${market_room} but the market is not open yet`)
      return callback(callbackErrorObject(`try to join ${market_room} but the market is not open yet`)) // TODO: error_code
    }
    else {
      // Join Market room
      socket.join(market_room)
      console.log(`[leagueHandler] socketID: ${socket.id} - user: ${socket.user} join market ${market_room}`)

      // prepare message
      const socket_list = await getSocketsInRoom(io, market_room)
      const message = extractPlayersNames(socket_list)
      const message_validated = Schemas.serverMarketUserOnlineSchema.validate(message)

      if (message_validated.error) {
        console.error(`[leagueHandler] socketID: ${socket.id} - validation error: ${message_validated.error}`)
        return callback(callbackErrorObject("INTERNAL SERVER ERROR")) // TODO: error_code
      }
      else {
        // Notify client message is received
        callback(callbackSuccessObject())

        // Send message to all sockets in the room
        io.in(league_room).emit(EVENT_TYPE.SERVER.MARKET.USER_ONLINE, message_validated.value)
      }
    }
  }
}

//------------------------------------------------------------------------------

// TODO: check that market is open:
//       - add open variable to the room object
//       - add field in the database?
const onMarketStart = async (io, socket, callback) => {

  // Assert callback is passed
  if (typeof callback !== "function") { return socket.disconnect() }

  // retrieve league room
  const league_room = getSocketRooms(socket).find(room => isLeagueRoom(room))

  // socket didn't join the league room
  if (!league_room) {
    console.error(`[leagueHandler] socketID: ${socket.id} - user: ${socket.user} try to start market but did not joined the league room`)
    return callback(callbackErrorObject("try to start market but did not joined the league room")) // TODO: error_code
  }
  else {
    const market_room = getSocketRooms(socket).find(room => isMarketRoom(room))

    // socket didn't join the market room
    if (!market_room) {
      console.error(`[leagueHandler] socketID: ${socket.id} - user: ${socket.user} try to start market but did not joined the market room`)
      return callback(callbackErrorObject("try to start market but did not joined the market room")) // TODO: error_code
    }
    else {
      // prepare message
      const socket_list = await getSocketsInRoom(io, market_room)
      const message = extractPlayersNames(socket_list)
      const message_validated = Schemas.serverMarketUserOnlineSchema.validate(message)

      if (message_validated.error) {
        console.error(`[leagueHandler] socketID: ${socket.id} - validation error: ${message_validated.error}`)
        return callback(callbackErrorObject("INTERNAL SERVER ERROR")) // TODO: error_code
      }
      else {
        // prepare message
        const message_turn = getPlayerTurn(message)
        const message_turn_validated = Schemas.serverMarketSearchSchema.validate(message_turn)

        if (message_turn_validated.error) {
          console.error(`[leagueHandler] socketID: ${socket.id} - validation error: ${message_turn_validated.error}`)
          return callback(callbackErrorObject("INTERNAL SERVER ERROR")) // TODO: error_code
        }
        else {
          // Notify client message is received
          callback(callbackSuccessObject())

          // Send message to all sockets in the room
          io.in(league_room).emit(EVENT_TYPE.SERVER.MARKET.START, message_validated.value)
          io.in(market_room).emit(EVENT_TYPE.SERVER.MARKET.SEARCH, message_turn_validated.value)
        }
      }
    }
  }
}

//------------------------------------------------------------------------------

// TODO: check that market is started:
//       - add open variable to the room object ?
//       - add field in the database?
const onMarketFootballPlayerSelectedOrBet = async (io, socket, payload, bet, callback) => {
  // Assert callback is passed
  if (typeof callback !== "function") { return socket.disconnect() }

  // Validate payload
  const payload_validation = Schemas.clientMarketFootballPlayerSelected.validate(payload)
  if (payload_validation.error) {
    console.error(`[leagueHandler] socketID: ${socket.id} - validation error: ${payload_validation.error}`)
    return callback(callbackErrorObject(payload_validation.error))  // TODO: error_code
  }

  // retrieve league room
  const league_room = getSocketRooms(socket).find(room => isLeagueRoom(room))

  // socket didn't join the league room
  if (!league_room) {
    console.error(`[leagueHandler] socketID: ${socket.id} - try to select/bet player but did not joined the league room`)
    return callback(callbackErrorObject("try to select/bet player but did not joined the league room"))  // TODO: error_code
  }
  else {
    const market_room = getSocketRooms(socket).find(room => isMarketRoom(room))

    // socket didn't join the market room
    if (!market_room) {
      console.error(`[leagueHandler] socketID: ${socket.id} - try to select/bet player but did not joined the market room`)
      return callback(callbackErrorObject("try to select/bet player but did not joined the market room"))  // TODO: error_code
    }
    else {
      // prepare message
      const message = payload_validation.value
      message["user"] = socket.user // add user information to the message
      const message_validated = Schemas.serverMarketFootballPlayerSelected.validate(message)

      if (message_validated.error) {
        console.error(`[leagueHandler] socketID: ${socket.id} - validation error: ${message_validated.error}`)
        return callback(callbackErrorObject("INTERNAL SERVER ERROR")) // TODO: error_code
      }
      else {
        // Notify client message is received
        callback(callbackSuccessObject())

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


// TODO: check that market is started:
//       - add open variable to the room object ?
//       - add field in the database?
const onMarketPause = (io, socket, callback) => {

  // Assert callback is passed
  if (typeof callback !== "function") { return socket.disconnect() }

  // retrieve league room
  const league_room = getSocketRooms(socket).find(room => isLeagueRoom(room))

  // socket didn't join the league room
  if (!league_room) {
    console.error(`[leagueHandler] socketID: ${socket.id} - try to pause market room but did not joined the league room`)
    return callback(callbackErrorObject("try to pause market room but did not joined the league room"))  // TODO: error_code
  }
  else {
    const market_room = getSocketRooms(socket).find(room => isMarketRoom(room))

    // socket didn't join the market room
    if (!market_room) {
      console.error(`[leagueHandler] socketID: ${socket.id} - try to pause market room but did not joined the market room`)
      return callback(callbackErrorObject("try to pause market room but did not joined the market room"))  // TODO: error_code
    }
    else {
      // Notify client message is received
      callback(callbackSuccessObject())

      // Send message to all sockets in the market room
      io.in(market_room).emit(EVENT_TYPE.SERVER.MARKET.PAUSE)
    }
  }
}

//------------------------------------------------------------------------------

module.exports = (io, socket) => {

  // TODO: add callback everywhere
  socket.on(EVENT_TYPE.CLIENT.LEAGUE.USER_NEW, (payload, callback) => { onLeagueUserNewOrOnline(io, socket, payload, true, callback) })
  socket.on(EVENT_TYPE.CLIENT.LEAGUE.USER_ONLINE, (payload, callback) => { onLeagueUserNewOrOnline(io, socket, payload, false, callback) })
  socket.on(EVENT_TYPE.CLIENT.LEAGUE.USER_DELETED, (callback) => { onLeagueUserDeleted(io, socket, callback) })
  socket.on(EVENT_TYPE.CLIENT.LEAGUE.USER_OFFLINE, (callback) => { onLeagueUserOffline(io, socket, callback) })
  socket.on(EVENT_TYPE.CLIENT.MARKET.OPEN, (callback) => { onMarketOpen(io, socket, callback) })
  socket.on(EVENT_TYPE.CLIENT.MARKET.USER_ONLINE, (callback) => { onMarketUserOnline(io, socket, callback) })
  socket.on(EVENT_TYPE.CLIENT.MARKET.START, (callback) => { onMarketStart(io, socket, callback) })
  socket.on(EVENT_TYPE.CLIENT.MARKET.PLAYER_SELECTED, (payload, callback) => { onMarketFootballPlayerSelectedOrBet(io, socket, payload, false, callback) })
  socket.on(EVENT_TYPE.CLIENT.MARKET.BET, (payload, callback) => { onMarketFootballPlayerSelectedOrBet(io, socket, payload, true, callback) })
  socket.on(EVENT_TYPE.CLIENT.MARKET.PAUSE, (callback) => { onMarketPause(io, socket, callback) })
}
