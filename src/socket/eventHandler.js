import { EVENT_TYPE, getSocketsInRoom, extractTeamId, isLeagueRoom, isMarketRoom, getMarketRoom, getPlayerTurn, league_prefix, market_prefix } from "./common"
import { socket_event_counter } from "../metrics"
import { Schemas } from "./schemas"
import { League, Market } from '../database'
import { Errors } from '../utils'

// TODO: add metrics
//------------------------------------------------------------------------------

const callbackSuccessObject = () => {
  return { status: "OK" }
}

//------------------------------------------------------------------------------

const callbackErrorObject = (error) => {
  return { status: "KO", error: error }
}

//------------------------------------------------------------------------------

const getSocketRooms = (socket) => {
  return Array.from(socket.rooms).slice(1) // socket.rooms = Set { <socket.id>, "room1", "room2", ... }
}

//------------------------------------------------------------------------------

/**
 * 
 * @param {*} payload to be validated
 * @param {*} newUser whether the user is joining the league for the first time
 * @returns result of schema validation
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
 * 
 * @param {*} socket socket client
 * @returns true/false depending on the admin status of the user behind the socket
 */
const isAdmin = async (league_id, user_id) => {
  try {
    const league = await League.findById({ _id: league_id })

    if (!league || !league.$isValid() || league.$isEmpty()) {
      // TODO: send ERROR event and manage failure
      return Promise.reject("error")
    }
    else {
      return Promise.resolve(user_id == league.admin.toString())
    }
  }
  catch (error) {
    // TODO: send ERROR event and manage failure
    return Promise.reject(error)
  }
}

//------------------------------------------------------------------------------

const createMarketObject = async (league_id) => {
  console.log(`[createMarketObject] league_id=${league_id}`)

  try {

    const league = await League.findById({ _id: league_id })

    if (!league || !league.$isValid() || league.$isEmpty()) {
      // TODO: send ERROR event and manage failure
      return Promise.reject("error")
    }
    else {
      // create market in DB
      let marketObj = { leagueId: league_id }
      let market = await Market.create(marketObj)
      
      // add market to league in DB
      league.market.push(market._id)
      league.save()

      return Promise.resolve(market)
    }
  }
  catch (error) {
    // TODO: send ERROR event and manage failure
    return Promise.reject(error)
  }
}

//------------------------------------------------------------------------------
/**
 * 
 * @param {*} market_room market room name in the format "market={league_namefrom_db}"
 * @returns true/false depenging on the market open status
 */
const isMarketOpen = (market_room) => {
  // TODO: implement it
  console.log(`[isMarketOpen] market_room: ${market_room}`)
  return true
}

//------------------------------------------------------------------------------

/**
 * 
 * @param {*} market_room market room name in the format "market={league_namefrom_db}"
 * @returns true/false depenging on the market start status
 */
const isMarketStart = (market_room) => {
  // TODO: implement it
  console.log(`[isMarketStart] market_room: ${market_room}`)
  return true
}

//------------------------------------------------------------------------------

/**
 * 
 * @param {*} market_room market room name in the format "market={league_namefrom_db}"
 * @returns true/false depenging on the result of setting the market status to open
 */
const setMarketOpen = (market_room) => {
  // TODO: implement it
  // we are missing the link between league and market. How can I retrieve the market._id from the socket?
  // at the moment I can retrieve the league.name and then searh for the market name (not very efficient)
  console.log(`[setMarketOpen] market_room: ${market_room}`)
  return true
}

//------------------------------------------------------------------------------

/**
 * 
 * @param {*} market_room market room name in the format "market={league_namefrom_db}"
 * @returns true/false depenging on the result of setting the market status to start
 */
const setMarketStart = (market_room) => {
  // TODO: implement it
  console.log(`[setMarketStart] market_room: ${market_room}`)
  return true
}

//------------------------------------------------------------------------------

/**
 * 
 * @param {*} market_room market room name in the format "market={league_namefrom_db}"
 * @returns true/false depenging on the result of setting the market status to start
 */
const setMarketPause = (market_room) => {
  // TODO: implement it
  console.log(`[setMarketPause] market_room: ${market_room}`)
  return true
}

//------------------------------------------------------------------------------

/**
 * Add socket to the room passed in the payload. 
 * Enhances socket object with username.
 * Broadcast the list of online users to the room.
 * 
 * @param {*} io       socket server
 * @param {*} socket   socket client
 * @param {*} payload  object { room, user }
 * @param {*} newUser  whether the user is joining the league for the first time
 * @param {*} callback sent back to the client
 * @returns 
 */
const onLeagueUserNewOrOnline = async (io, socket, payload, newUser, callback) => {
  // Assert callback is passed
  if (typeof callback !== "function") {
    console.error("No callback is passed. Disconnecting")
    return socket.disconnect()
  }

  // Validate payload
  const payload_validation = validateUserNewOrOnline(payload, newUser)
  if (payload_validation.error) {
    console.error(`[eventHandler] client payload validation failed. ${payload_validation.error}`)
    return callback(callbackErrorObject(payload_validation.error))  // TODO: error_code
  }

  // Extract from payload
  const { user_id, team_id, league_id } = payload_validation.value

  const league_room = `${league_prefix}${league_id}`

  // Add custom information to the socket object
  socket.user_id = user_id
  socket.team_id = team_id
  socket.league_id = league_id
  socket.isAdmin = await isAdmin(league_id, user_id)

  // Join Room
  socket.join(league_room)
  console.log(`[eventHandler] socketID: ${socket.id} - user_id=${user_id} team_id=${team_id} league_id=${league_id} online in ${league_room} (newUser=${newUser})`)

  // prepare response message
  const socket_list = await getSocketsInRoom(io, league_room)
  const message = extractTeamId(socket_list)

  // validate response message
  const message_validated = Schemas.serverLeagueUserNewOrOnlineSchema.validate(message)
  if (message_validated.error) {
    console.error(`[eventHandler] response message validation failed. ${message_validated.error}`)
    return callback(callbackErrorObject("INTERNAL SERVER ERROR")) // TODO: error_code
  }

  // Notify client message is received
  callback(callbackSuccessObject())

  // Send message to all sockets in the room
  io.in(league_room).emit(eventTypeUserNewOrOnline(newUser), message_validated.value)
}

//------------------------------------------------------------------------------

/**
 * Remove socket from each room he has previously joined.
 * Broadcast the list of online users to the league room.
 * 
 * @param {*} io       socket server
 * @param {*} socket   socket client
 * @param {*} callback sent back to the client
 */
const onLeagueUserDeleted = async (io, socket, callback) => {
  // Assert callback is passed
  if (typeof callback !== "function") {
    console.error("No callback function passed. Disconnecting")
    return socket.disconnect()
  }

  const rooms = getSocketRooms(socket)

  if (rooms.length == 0) {
    console.error(`[eventHandler] socketID: ${socket.id} - user_id=${socket.user_id} team_id=${socket.team_id} try to delete but did not joined any room`)
    return callback(callbackErrorObject("try to delete user but did not joined any room")) // TODO: error_code
  }

  // leave all rooms
  for (const room of rooms) {
    socket.leave(room)
    console.log(`[eventHandler] socketID: ${socket.id} - user_id=${socket.user_id} team_id=${socket.team_id} left room ${room}`)

    // prepare response message
    const socket_list = await getSocketsInRoom(io, room)
    const message = extractTeamId(socket_list)

    // validate response message
    const message_validated = Schemas.serverUserDeletedSchema.validate(message)
    if (message_validated.error) {
      console.error(`[eventHandler] response message validation failed. ${message_validated.error}`)
      return callback(callbackErrorObject("INTERNAL SERVER ERROR")) // TODO: error_code
    }

    if (isLeagueRoom(room)) {
      // Send message to all sockets in the League room
      io.in(room).emit(EVENT_TYPE.SERVER.LEAGUE.USER_DELETED, message_validated.value)
    }
    else if (isMarketRoom(room)) {
      // Send message to all sockets in the Market room
      io.in(room).emit(EVENT_TYPE.SERVER.MARKET.USER_OFFLINE, message_validated.value)
    }
    else {
      console.error(`[eventHandler] socketID: ${socket.id} - user_id=${socket.user_id} team_id=${socket.team_id} leaving room ${room} that is not a League nor a Market`)
    }
  }

  // Notify client message is received
  callback(callbackSuccessObject())
}

//------------------------------------------------------------------------------

/**
 * Remove socket from each room he has previously joined.
 * Broadcast the list of online users to the league room.
 * 
 * @param {*} io       socket server
 * @param {*} socket   socket client
 * @param {*} callback sent back to the client
 */
const onLeagueUserOffline = async (io, socket, callback) => {
  // Assert callback is passed
  if (typeof callback !== "function") {
    console.error("No callback function passed. Disconnecting")
    return socket.disconnect()
  }

  const rooms = getSocketRooms(socket)

  if (rooms.length == 0) {
    console.error(`[eventHandler] socketID: ${socket.id} - user_id=${socket.user_id} team_id=${socket.team_id} try to offline but did not joined any room`)
    return callback(callbackErrorObject("try to offline user but did not joined any room")) // TODO: error_code
  }

  // leave all rooms
  for (const room of rooms) {
    socket.leave(room)
    console.log(`[eventHandler] socketID: ${socket.id} - user_id=${socket.user_id} team_id=${socket.team_id} left room ${room}`)

    // prepare response message
    const socket_list = await getSocketsInRoom(io, room)
    const message = extractTeamId(socket_list)

    // validate response message
    const message_validated = Schemas.serverUserOfflineSchema.validate(message)
    if (message_validated.error) {
      console.error(`[eventHandler] response message validation failed. ${message_validated.error}`)
      return callback(callbackErrorObject("INTERNAL SERVER ERROR")) // TODO: error_code
    }

    if (isLeagueRoom(room)) {
      // Send message to all sockets in the League room
      io.in(room).emit(EVENT_TYPE.SERVER.LEAGUE.USER_OFFLINE, message_validated.value)
    }
    else if (isMarketRoom(room)) {
      // Send message to all sockets in the Market room
      io.in(room).emit(EVENT_TYPE.SERVER.MARKET.USER_OFFLINE, message_validated.value)
    }
    else {
      console.error(`[eventHandler] socketID: ${socket.id} - user_id=${socket.user_id} team_id=${socket.team_id} leaving room ${room} that is not a League nor a Market`)
    }
  }

  // Notify client message is received
  callback(callbackSuccessObject())
}

//------------------------------------------------------------------------------

/**
 * Set market status to Open in the database.
 * Broadcast the list of online users to the league room.
 * 
 * @param {*} io       socket server
 * @param {*} socket   socket client
 * @param {*} callback sent back to the client
 */
const onMarketOpen = async (io, socket, callback) => {
  // Assert callback is passed
  if (typeof callback !== "function") {
    console.error("No callback function passed. Disconnecting")
    return socket.disconnect()
  }

  // retrieve league room
  const league_room = getSocketRooms(socket).find(room => isLeagueRoom(room))

  // socket didn't join the league room
  if (!league_room) {
    console.error(`[eventHandler] [onMarketOpen] socketID: ${socket.id} - try to open market but did not joined the league room`)
    return callback(callbackErrorObject("try to open market but did not joined the league room")) // TODO: error_code
  }

  // check admin
  if (!socket.isAdmin) {
    console.error(`[eventHandler] [onMarketOpen] socketID: ${socket.id} - try to open market but user is not admin`)
    return callback(callbackErrorObject("try to open market but user is not admin")) // TODO: error_code
  }

  // Create Market object in DB
  await createMarketObject(socket.league_id) //TODO: error handling?

  const market_room = getMarketRoom(league_room)

  // Join Market room
  socket.join(market_room)
  console.log(`[eventHandler] [onMarketOpen] socketID: ${socket.id} - user: ${socket.user_id} open market ${market_room}`)

  // prepare response message
  const socket_list = await getSocketsInRoom(io, market_room)
  const message = extractTeamId(socket_list)

  // validate response message
  const message_validated = Schemas.serverMarketOpenSchema.validate(message)
  if (message_validated.error) {
    console.error(`[eventHandler] response message validation failed. ${message_validated.error}`)
    return callback(callbackErrorObject("INTERNAL SERVER ERROR")) // TODO: error_code
  }

  // Notify client message is received
  callback(callbackSuccessObject())

  // Send message to all sockets in the room
  io.in(league_room).emit(EVENT_TYPE.SERVER.LEAGUE.MARKET_OPEN, message_validated.value)
}

//------------------------------------------------------------------------------

/**
 * Add socket to the market room.
 * Broadcast the list of online users to the market room.
 * @param {*} io       socket server
 * @param {*} socket   socket client
 * @param {*} callback sent back to the client
 */
const onMarketUserOnline = async (io, socket, callback) => {
  // Assert callback is passed
  if (typeof callback !== "function") {
    console.error("No callback function passed. Disconnecting")
    return socket.disconnect()
  }

  // retrieve league room
  const league_room = getSocketRooms(socket).find(room => isLeagueRoom(room))

  // socket didn't join the league room
  if (!league_room) {
    console.error(`[eventHandler] socketID: ${socket.id} - try to join market room but did not joined the league room`)
    return callback(callbackErrorObject("try to join market room but did not joined the league room")) // TODO: error_code
  }

  const market_room = getMarketRoom(league_room)

  // Check market is open
  if (!isMarketOpen(market_room)) {
    console.error(`[eventHandler] socketID: ${socket.id} - user: ${socket.user_id} try to join ${market_room} but the market is not open yet XXX`)
    return callback(callbackErrorObject(`try to join ${market_room} but the market is not open yet XXX`)) // TODO: error_code
  }

  // Join Market room
  socket.join(market_room)
  console.log(`[eventHandler] socketID: ${socket.id} - user: ${socket.user_id} join market ${market_room}`)

  // prepare response message
  const socket_list = await getSocketsInRoom(io, market_room)
  const message = extractTeamId(socket_list)

  // validate response message
  const message_validated = Schemas.serverMarketUserOnlineSchema.validate(message)
  if (message_validated.error) {
    console.error(`[eventHandler] response message validation failed. ${message_validated.error}`)
    return callback(callbackErrorObject("INTERNAL SERVER ERROR")) // TODO: error_code
  }

  // Notify client with success callback
  callback(callbackSuccessObject())

  // Send message to all sockets in the room
  io.in(league_room).emit(EVENT_TYPE.SERVER.MARKET.USER_ONLINE, message_validated.value)

}

//------------------------------------------------------------------------------

/**
 * Set market status to Start in the database.
 * Broadcast new status to all users in the market room.
 * 
 * @param {*} io       socket server
 * @param {*} socket   socket client
 * @param {*} callback sent back to the client
 * @returns 
 */
const onMarketStart = async (io, socket, callback) => {

  // Assert callback is passed
  if (typeof callback !== "function") {
    console.error("No callback function passed. Disconnecting")
    return socket.disconnect()
  }

  // retrieve league room
  const league_room = getSocketRooms(socket).find(room => isLeagueRoom(room))

  // socket didn't join the league room
  if (!league_room) {
    console.error(`[eventHandler] socketID: ${socket.id} - user: ${socket.user_id} try to start market but did not joined the league room`)
    return callback(callbackErrorObject("try to start market but did not joined the league room")) // TODO: error_code
  }

  const market_room = getSocketRooms(socket).find(room => isMarketRoom(room))

  // socket didn't join the market room
  if (!market_room) {
    console.error(`[eventHandler] socketID: ${socket.id} - user: ${socket.user_id} try to start market but did not joined the market room`)
    return callback(callbackErrorObject("try to start market but did not joined the market room")) // TODO: error_code
  }

  // Check admin
  if (!isAdmin(socket)) {
    console.error(`[eventHandler] socketID: ${socket.id} - try to start market but user is not admin`)
    return callback(callbackErrorObject("try to start market but user is not admin")) // TODO: error_code
  }

  // Check market is open
  if (!isMarketOpen(market_room)) {
    console.error(`[eventHandler] socketID: ${socket.id} - try to start market but market is not open`)
    return callback(callbackErrorObject("try to start market but market is not open")) // TODO: error_code
  }

  // prepare response message
  const socket_list = await getSocketsInRoom(io, market_room)
  const message = extractTeamId(socket_list)

  // validate response message
  const message_validated = Schemas.serverMarketUserOnlineSchema.validate(message)
  if (message_validated.error) {
    console.error(`[eventHandler] response message validation failed. ${message_validated.error}`)
    return callback(callbackErrorObject("INTERNAL SERVER ERROR")) // TODO: error_code
  }

  // prepare response message
  const message_turn = getPlayerTurn(message)

  // validate response message
  const message_turn_validated = Schemas.serverMarketSearchSchema.validate(message_turn)
  if (message_turn_validated.error) {
    console.error(`[eventHandler] socketID: ${socket.id} - validation error: ${message_turn_validated.error}`)
    return callback(callbackErrorObject("INTERNAL SERVER ERROR")) // TODO: error_code
  }

  // Set market Start in the DB
  if (!setMarketStart(market_room)) {
    console.error(`[eventHandler] an error occurred while set market ${market_room} to start`)
    return callback(callbackErrorObject("INTERNAL SERVER ERROR")) // TODO: error_code
  }

  // Notify client message is received
  callback(callbackSuccessObject())

  // Send messages to all sockets in the room
  io.in(market_room).emit(EVENT_TYPE.SERVER.MARKET.START, message_validated.value)
  io.in(market_room).emit(EVENT_TYPE.SERVER.MARKET.SEARCH, message_turn_validated.value)
}

//------------------------------------------------------------------------------

/**
 * Get bet from user and broadcast it to all users in the market room.
 * 
 * @param {*} io       socket server
 * @param {*} socket   socket client
 * @param {*} payload  object { football_player_id: football_player_id, bet: bet }
 * @param {*} bet      whether this is the selection/bet phase
 * @param {*} callback sent back to the client
 * @returns 
 */
const onMarketFootballPlayerSelectedOrBet = async (io, socket, payload, bet, callback) => {
  // Assert callback is passed
  if (typeof callback !== "function") {
    console.error("No callback function passed. Disconnecting")
    return socket.disconnect()
  }

  // Validate payload
  const payload_validation = Schemas.clientMarketFootballPlayerSelected.validate(payload)
  if (payload_validation.error) {
    console.error(`[eventHandler] client payload validation failed. ${payload_validation.error}`)
    return callback(callbackErrorObject(payload_validation.error))  // TODO: error_code
  }

  // retrieve league room
  const league_room = getSocketRooms(socket).find(room => isLeagueRoom(room))

  // socket didn't join the league room
  if (!league_room) {
    console.error(`[eventHandler] socketID: ${socket.id} - try to select/bet player but did not joined the league room`)
    return callback(callbackErrorObject("try to select/bet player but did not joined the league room"))  // TODO: error_code
  }
  const market_room = getSocketRooms(socket).find(room => isMarketRoom(room))

  // socket didn't join the market room
  if (!market_room) {
    console.error(`[eventHandler] socketID: ${socket.id} - try to select/bet player but did not joined the market room`)
    return callback(callbackErrorObject("try to select/bet player but did not joined the market room"))  // TODO: error_code
  }

  // prepare response message
  const message = payload_validation.value
  message["user"] = socket.user_id // add user information to the message

  // validate response message
  const message_validated = Schemas.serverMarketFootballPlayerSelected.validate(message)
  if (message_validated.error) {
    console.error(`[eventHandler] response message validation failed. ${message_validated.error}`)
    return callback(callbackErrorObject("INTERNAL SERVER ERROR")) // TODO: error_code
  }

  if (!isMarketOpen(market_room) || !isMarketStart(market_room)) {
    console.error(`[eventHandler] socketID: ${socket.id} - try to select/bet player but market is either closed or not started`)
    return callback(callbackErrorObject("INTERNAL SERVER ERROR")) // TODO: error_code
  }

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


/**
 * Set market status to Pause in the database.
 * Broadcast new status to all users in the market room.
 * 
 * @param {*} io       socket server
 * @param {*} socket   socket client
 * @param {*} callback sent back to the client
 * @returns 
 */
const onMarketPause = (io, socket, callback) => {

  // Assert callback is passed
  if (typeof callback !== "function") {
    console.error("No callback function passed. Disconnecting")
    return socket.disconnect()
  }

  // retrieve league room
  const league_room = getSocketRooms(socket).find(room => isLeagueRoom(room))

  // socket didn't join the league room
  if (!league_room) {
    console.error(`[eventHandler] socketID: ${socket.id} - try to pause market room but did not joined the league room`)
    return callback(callbackErrorObject("try to pause market room but did not joined the league room"))  // TODO: error_code
  }

  if (!isAdmin(socket)) {
    console.error(`[eventHandler] socketID: ${socket.id} - try to pause market room but user is not admin`)
    return callback(callbackErrorObject("try to pause market room but user is not admin")) // TODO: error_code
  }

  const market_room = getSocketRooms(socket).find(room => isMarketRoom(room))

  // socket didn't join the market room
  if (!market_room) {
    console.error(`[eventHandler] socketID: ${socket.id} - try to pause market room but did not joined the market room`)
    return callback(callbackErrorObject("try to pause market room but did not joined the market room"))  // TODO: error_code
  }

  if (!isMarketOpen(market_room) || !isMarketStart(market_room)) {
    console.error(`[eventHandler] socketID: ${socket.id} - try to pause the market but the market is either closed or not started`)
    return callback(callbackErrorObject("INTERNAL SERVER ERROR")) // TODO: error_code
  }

  // Pause the market
  if (!setMarketPause(market_room)) {
    console.error(`[eventHandler] an error occurred while set market ${market_room} to pause`)
    return callback(callbackErrorObject("INTERNAL SERVER ERROR")) // TODO: error_code
  }

  // Notify client message is received
  callback(callbackSuccessObject())

  // Send message to all sockets in the market room
  io.in(market_room).emit(EVENT_TYPE.SERVER.MARKET.PAUSE)
}


/**
 * Set market status to Close in the database.
 * Broadcast new status to all users in the market room.
 * 
 * @param {*} io       socket server
 * @param {*} socket   socket client
 * @param {*} callback sent back to the client
 * @returns 
 */
const onMarketClose = async (io, socket, callback) => {

  // Assert callback is passed
  if (typeof callback !== "function") {
    console.error("No callback function passed. Disconnecting")
    return socket.disconnect()
  }

  // retrieve league room
  const league_room = getSocketRooms(socket).find(room => isLeagueRoom(room))

  // socket didn't join the league room
  if (!league_room) {
    console.error(`[eventHandler] socketID: ${socket.id} - try to close market room but did not joined the league room`)
    return callback(callbackErrorObject("try to close market room but did not joined the league room"))  // TODO: error_code
  }

  if (!isAdmin(socket)) {
    console.error(`[eventHandler] socketID: ${socket.id} - try to close market room but user is not admin`)
    return callback(callbackErrorObject("try to close market room but user is not admin")) // TODO: error_code
  }

  const market_room = getSocketRooms(socket).find(room => isMarketRoom(room))

  // socket didn't join the market room
  if (!market_room) {
    console.error(`[eventHandler] socketID: ${socket.id} - try to close market room but did not joined the market room`)
    return callback(callbackErrorObject("try to close market room but did not joined the market room"))  // TODO: error_code
  }

  if (!isMarketOpen(market_room) || !isMarketStart(market_room)) {
    console.error(`[eventHandler] socketID: ${socket.id} - try to close the but the market is either closed or not started`)
    return callback(callbackErrorObject("INTERNAL SERVER ERROR")) // TODO: error_code
  }

  // Notify client message is received
  callback(callbackSuccessObject())

  // Remove all sockets from the market room
  const socket_list = await getSocketsInRoom(io, market_room)
  socket_list.map(socket => {
    console.log(`[eventHandler] REMOVING socket: ${socket.id} from market ${market_room}`)
    socket.leave(market_room)
  })

  console.log(`[eventHandler] socketID: ${socket.id} - user: ${socket.user_id} close market ${market_room}`)

  // Send message to all sockets in the league room
  io.in(league_room).emit(EVENT_TYPE.SERVER.MARKET.CLOSE)
}

//------------------------------------------------------------------------------

module.exports = (io, socket) => {

  socket.on(EVENT_TYPE.CLIENT.LEAGUE.USER_NEW, (payload, callback) => {
    socket_event_counter.inc({ event_type: "EVENT_TYPE.CLIENT.LEAGUE.USER_NEW" })
    onLeagueUserNewOrOnline(io, socket, payload, true, callback)
  }
  )

  socket.on(EVENT_TYPE.CLIENT.LEAGUE.USER_ONLINE, (payload, callback) => {
    socket_event_counter.inc({ event_type: "EVENT_TYPE.CLIENT.LEAGUE.USER_ONLINE" })
    onLeagueUserNewOrOnline(io, socket, payload, false, callback)
  })

  socket.on(EVENT_TYPE.CLIENT.LEAGUE.USER_DELETED, (callback) => {
    socket_event_counter.inc({ event_type: "EVENT_TYPE.CLIENT.LEAGUE.USER_DELETED" })
    onLeagueUserDeleted(io, socket, callback)
  })

  socket.on(EVENT_TYPE.CLIENT.LEAGUE.USER_OFFLINE, (callback) => {
    socket_event_counter.inc({ event_type: "EVENT_TYPE.CLIENT.LEAGUE.USER_OFFLINE" })
    onLeagueUserOffline(io, socket, callback)
  })

  socket.on(EVENT_TYPE.CLIENT.LEAGUE.MARKET_OPEN, (callback) => {
    socket_event_counter.inc({ event_type: "EVENT_TYPE.CLIENT.LEAGUE.MARKET_OPEN" })
    onMarketOpen(io, socket, callback)
  })

  socket.on(EVENT_TYPE.CLIENT.MARKET.USER_ONLINE, (callback) => {
    socket_event_counter.inc({ event_type: "EVENT_TYPE.CLIENT.MARKET.USER_ONLINE" })
    onMarketUserOnline(io, socket, callback)
  })

  socket.on(EVENT_TYPE.CLIENT.MARKET.START, (callback) => {
    socket_event_counter.inc({ event_type: "EVENT_TYPE.CLIENT.MARKET.START" })
    onMarketStart(io, socket, callback)
  })

  socket.on(EVENT_TYPE.CLIENT.MARKET.PLAYER_SELECTED, (payload, callback) => {
    socket_event_counter.inc({ event_type: "EVENT_TYPE.CLIENT.MARKET.PLAYER_SELECTED" })
    onMarketFootballPlayerSelectedOrBet(io, socket, payload, false, callback)
  })

  socket.on(EVENT_TYPE.CLIENT.MARKET.BET, (payload, callback) => {
    socket_event_counter.inc({ event_type: "EVENT_TYPE.CLIENT.MARKET.BET," })
    onMarketFootballPlayerSelectedOrBet(io, socket, payload, true, callback)
  })

  socket.on(EVENT_TYPE.CLIENT.MARKET.PAUSE, (callback) => {
    socket_event_counter.inc({ event_type: "EVENT_TYPE.CLIENT.MARKET.PAUSE" })
    onMarketPause(io, socket, callback)
  })

  socket.on(EVENT_TYPE.CLIENT.MARKET.CLOSE, (callback) => {
    socket_event_counter.inc({ event_type: "EVENT_TYPE.CLIENT.MARKET.CLOSE" })
    onMarketClose(io, socket, callback)
  })
}
