import mongoose from 'mongoose'
const { Schema, model } = mongoose

import _ from 'lodash'

const marketSchema = new Schema(
    {
        leagueId: {
            type: Schema.Types.ObjectId,
            ref: "League",
            required: true
        },
        open: {
            type: Schema.Types.Boolean,
            required: true,
            default: false
        },
        active: {
            type: Schema.Types.Boolean,
            required: true,
            default: false
        },
        onlineTeams: [{
            type: Schema.Types.ObjectId,
            ref: "Team",
            default: []
        }],
        teamTurn: {
            type: Schema.Types.ObjectId,
            ref: "Team",
            default: null
        },
        betHistory: [{
            footballPlayerId: {
                type: Schema.Types.Number,
                required: true,
            },
            bets: [{
                teamId: {
                    type: Schema.Types.ObjectId,
                    ref: "Team",
                    required: true
                },
                value: {
                    type: Schema.Types.Number,
                    required: true,
                }
            }]
        }],
        closedAt: {
            type: Schema.Types.Date,
            default: null
        }
    },
    {
        timestamps: true, // createdAt, updatedAt automatically added by mongoose
    }
);

const Market = model('Market', marketSchema)

export default Market


// obj = {
//     let OPEN = false
//     let JOINED = false
//     let START = false
//     let PAUSE = false
//     let ONLINE_PLAYERS = []
//     let PLAYER_TURN = null
//     let LAST_BET = null
//     let betHistory = [1,2,3,4,5,6,7,8,]
//     ...
//     }
