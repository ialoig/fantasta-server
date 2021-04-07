
import { expect, should, use } from 'chai';
import chaiHttp from 'chai-http'
import config from 'config'
import { User, League, Team } from '../../src/database/index.js'
import { Errors, tokenUtils } from '../../src/utils/index.js'
import { requester, findPropertyValueInNestedObject, printObject } from './index.js'
import { userUtils } from '../../src/utils'
import mongoose from 'mongoose'

use(chaiHttp);
should();

const api = "/fantasta/auth/deleteAccount"

let user_1 = {
    // _id            // it will added once the user is created
    email: "user1@email.com",
    password: "user1_password",
    username: "username1",
    leagues: []       // it will added once the league is created
}

let user_2 = {
    // _id            // it will added once the user is created
    email: "user2@email.com",
    password: "user2_password",
    username: "username2",
    leagues: []       // it will added once the league is created
}

let user_3 = {
    // _id            // it will added once the user is created
    email: "user3@email.com",
    password: "user3_password",
    username: "username3",
    leagues: []       // it will added once the league is created
}

const token_1 = tokenUtils.Create(config.token.kid, user_1.email, user_1.password, user_1.username)
const token_2 = tokenUtils.Create(config.token.kid, user_2.email, user_2.password, user_2.username)
const token_3 = tokenUtils.Create(config.token.kid, user_3.email, user_3.password, user_3.username)

let team_1 = {
    // _id            // it will added once the team is created
    name: "team_1",
    footballPlayers: [],
    budget: 100,
    user: null,       // it will added once the user is created
    league: null      // it will added once the league is created
}

let team_2 = {
    // _id            // it will added once the team is created
    name: "team_2",
    footballPlayers: [],
    budget: 100,
    user: null,       // it will added once the user is created
    league: null      // it will added once the league is created
}

let team_3 = {
    // _id            // it will added once the team is created
    name: "team_3",
    footballPlayers: [],
    budget: 100,
    user: null,       // it will added once the user is created
    league: null      // it will added once the league is created
}

let league_1 = {
    name: "league1",
    password: "league1_password",
    admin: null,      // it will added once the user is created
    participants: 3,
    type: "classic",
    goalkeepers: 1,
    defenders: 8,
    midfielders: 8,
    strikers: 4,
    players: 0,
    budget: 100,
    countdown: 3,
    auctionType: "call",
    startPrice: "zero",
    teams: [],         // it will added later once team is created
    status: 'new',
    isDeleted: false
}

describe("DELETE", () => {

    before(async () => {

        // Clean DB
        await User.deleteMany({})
        await League.deleteMany({})
        await Team.deleteMany({})

        // Create Users
        let user_1_db = await User.create(user_1)
        user_1["_id"] = user_1_db._id

        let user_2_db = await User.create(user_2)
        user_2["_id"] = user_2_db._id

        let user_3_db = await User.create(user_3)
        user_3["_id"] = user_3_db._id

        // Create Teams
        team_1.user = user_1_db._id
        let team_1_db = await Team.create(team_1)
        team_1["_id"] = team_1_db._id

        team_2.user = user_2_db._id
        let team_2_db = await Team.create(team_2)
        team_2["_id"] = team_2_db._id

        team_3.user = user_3_db._id
        let team_3_db = await Team.create(team_3)
        team_3["_id"] = team_3_db._id

        // Create League
        league_1.admin = user_1_db._id
        league_1.teams.push(team_1_db)
        league_1.teams.push(team_2_db)
        league_1.teams.push(team_3_db)
        let league_1_db = await League.create(league_1)

        // Update User and Team
        team_1_db.league = league_1_db._id
        user_1_db.leagues.push(league_1_db._id)
        await user_1_db.save()
        await team_1_db.save()
        team_2_db.league = league_1_db._id
        user_2_db.leagues.push(league_1_db._id)
        await user_2_db.save()
        await team_2_db.save()
        team_3_db.league = league_1_db._id
        user_3_db.leagues.push(league_1_db._id)
        await user_3_db.save()
        await team_3_db.save()
    })

    after(() => {
        requester.close()
    })

    it("Body is undefined", async () => {
        const res = await requester
            .delete(api)
            .send(undefined)

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.PASSWORD_ERROR.code)
        expect(res.body.status).to.equal(Errors.PASSWORD_ERROR.status)
    })

    it("Body is empty", async () => {
        const res = await requester
            .delete(api)
            .send({})

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.PASSWORD_ERROR.code)
        expect(res.body.status).to.equal(Errors.PASSWORD_ERROR.status)
    })

    it("Password is NULL", async () => {
        const res = await requester
            .delete(api)
            .send({ password: null })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.PASSWORD_ERROR.code)
        expect(res.body.status).to.equal(Errors.PASSWORD_ERROR.status)
    })

    it("Password is NOT CORRECT", async () => {
        const res = await requester.delete(api)
            .set('Authorization', token_1)
            .send({ password: '654321' })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.WRONG_PASSWORD.code)
        expect(res.body.status).to.equal(Errors.WRONG_PASSWORD.status)
    })

    it("DELETE any USER of league ", async () => {
        const res = await requester
            .delete(api)
            .set('Authorization', token_3)
            .send({ password: user_3.password })

        expect(res).to.have.status(200);
        expect(res.body).to.equal(true);

        const user_3_after_removal = await User.findOne({ email: user_3.email })
        const team_3_after_removal = await Team.findOne({ name: team_3.name })
        const league_1_after_removal = await League.findOne({ name: league_1.name })

        expect(user_3_after_removal).to.be.null
        expect(team_3_after_removal).to.be.null
        expect(league_1_after_removal.admin.toString()).to.equal(user_1._id.toString())
        expect(league_1_after_removal.teams).to.have.length(2)
        expect(league_1_after_removal.teams.includes(team_1._id)).to.equal(true);
        expect(league_1_after_removal.teams.includes(team_2._id)).to.equal(true);
    })

    it("DELETE admin USER", async () => {
        const res = await requester
            .delete(api)
            .set('Authorization', token_1)
            .send({ password: user_1.password })

        expect(res).to.have.status(200);
        expect(res.body).to.equal(true);

        const user_1_after_removal = await User.findOne({ email: user_1.email })
        const team_1_after_removal = await Team.findOne({ name: team_1.name })
        const league_1_after_removal = await League.findOne({ name: league_1.name })

        expect(user_1_after_removal).to.be.null
        expect(team_1_after_removal).to.be.null
        expect(league_1_after_removal.admin.toString()).to.equal(user_2._id.toString())
        expect(league_1_after_removal.teams).to.have.length(1)

        expect(league_1_after_removal.teams.includes(team_2._id)).to.equal(true);
    })

    it("DELETE last USER of league ", async () => {
        const res = await requester
            .delete(api)
            .set('Authorization', token_2)
            .send({ password: user_2.password })

        expect(res).to.have.status(200);
        expect(res.body).to.equal(true);

        const user_2_after_removal = await User.findOne({ email: user_2.email })
        const team_2_after_removal = await Team.findOne({ name: team_2.name })
        const league_1_after_removal = await League.findOne({ name: league_1.name })

        expect(user_2_after_removal).to.be.null
        expect(team_2_after_removal).to.be.null
        expect(league_1_after_removal).to.be.null
    })
})
