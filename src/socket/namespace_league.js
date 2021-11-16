import Joi from "joi" // validation library
import { NAMESPACE, EVENT_TYPE, Message } from "./common"

/*
================================ FLOW ================================
CLIENT                                    EVENT_NAME                      SERVER                  EVENT_NAME                      NOTE
user join room (league name)              CLIENT_LEAGUE_JOIN              notify all users        SERVER_LEAGUE_USER_JOIN         called if the JoinLeague is successfull
user left the league (spontaneously)      CLIENT_LEAGUE_LEFT              notify all users        SERVER_LEAGUE_LEFT              check whether we need to record the status
user left the league (connection lost)                                    notify all users        SERVER_LEAGUE_LEFT              check whether we need to record the status

admin open market                         CLIENT_MARKET_OPEN              notify all users        SERVER_MARKET_OPEN              admin user already joined the league room
user join market                          CLIENT_MARKET_JOIN              notify all users        SERVER_MARKET_JOIN              user has already joined the league room
admin open market                         CLIENT_MARKET_START             notify all users        SERVER_MARKET_START             all users already joined the market room
                                                                          notify all users        SERVER_MARKET_SEARCH            your_turn=true/false in the message to discriminate the page
football player selected                  CLIENT_MARKET_PLAYER_SELECTED   notify all users        SERVER_MARKET_PLAYER_SELECTED
?? synchronize timer ??
user bet on player                        CLIENT_MARKET_BET               notify all users        SERVER_MARKET_BET               restart countdown
user win the auction                      CLIENT_MARKET_WIN               notify all users        SERVER_MARKET_WIN               
                                                                          notify all users        SERVER_MARKET_SEARCH            wait 5 seconds, then your_turn=true/false in the message to discriminate the page

admin is pausing the market               CLIENT_MARKET_PAUSE             notify all users        SERVER_MARKET_PAUSE             go to waiting page (to be implemented)
admin is closing the market?              CLIENT_MARKET_CLOSE             notify all users        SERVER_MARKET_CLOSE             does it make sense? maybe after all teams are completed
user left the market (spontaneously)      CLIENT_MARKET_LEFT              notify all users        SERVER_MARKET_LEFT              check whether we need to record the status
user left the market (connection lost)                                    notify all users        SERVER_MARKET_LEFT              check whether we need to record the status
*/


// Payload Schema
const joinPayloadSchema = Joi.object({
  room: Joi.string().max(30).required(),
  player: Joi.string().max(30).required()
})


//----------------------------------------------------------

function extractPlayersNames(socket_list, exclude_socket = null) {
  console.log(`extractPlayersNames(${socket_list}, ${exclude_socket})`)
  return socket_list
    .filter(socket => socket !== exclude_socket)
    .map(socket => socket.player)
}

//----------------------------------------------------------

async function getSocketsInRoom(io_namespace, room) {
  return io_namespace.in(room).fetchSockets()
}

//----------------------------------------------------------

module.exports = (io) => {

  // Use Namespace
  const namespace_league = io.of(NAMESPACE.LEAGUE)

  namespace_league.on("connection", function (socket) {
    console.log(`[socketID: ${socket.id}] connected`)

    // Disconnect
    socket.on("disconnect", function () {
      console.log(`[socketID: ${socket.id}] disconnected`)
    })

    // Disconnecting
    socket.on('disconnecting', async function () {
      const rooms = Array.from(socket.rooms).slice(1) // Set { <socket.id>, "room1", "room2", ... }
      for (const room of rooms) {
        const socket_list = await getSocketsInRoom(namespace_league, room)
        const message_content = extractPlayersNames(socket_list, socket)
        const message = new Message(EVENT_TYPE.LEAGUE_LEFT, message_content)
        namespace_league.in(room).emit(room, message)
      }
    });

    // Join League (TODO: check if we really want a callback)
    socket.on(EVENT_TYPE.LEAGUE_JOIN_REQUEST, async function (payload, callback) {

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

      const socket_list = await getSocketsInRoom(namespace_league, room)
      const message_content = extractPlayersNames(socket_list)
      const message_obj = new Message(EVENT_TYPE.LEAGUE_JOIN_REQUEST, message_content)
      console.log(message_obj)

      // Send message to all socket in the room
      namespace_league.in(room).emit(room, message_obj)
    })

  })

}
