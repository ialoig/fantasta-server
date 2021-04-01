import { expect, should, use } from 'chai'
import chaiHttp from 'chai-http'
import { User, League, Team, populate } from '../../src/database/index.js'
import config from 'config'
import { tokenUtils, Errors } from '../../src/utils/index.js'
import { requester, findPropertyValueInNestedObject, printObject } from './index.js'

use(chaiHttp);
should();

const api = "/fantasta/league/join"

const test_user_1 = {
    //_id: it will be added once the user is created
    email: 'test_1@test.com',
    password: 'password_1',
    username: 'username_1'
}
const token_1 = tokenUtils.Create(config.token.kid, test_user_1.email, test_user_1.password, test_user_1.username)
const test_team_name_1 = "team_name_1"

const test_user_2 = {
    //_id: it will be added once the user is created
    email: 'test_2@test.com',
    password: 'password_2',
    username: 'username_2'
}
const test_team_name_2 = "team_name_2"
const token_2 = tokenUtils.Create(config.token.kid, test_user_2.email, test_user_2.password, test_user_2.username)

const test_user_3 = {
    //_id: will be added once the user is created
    email: 'test_3@test.com',
    password: 'password_3',
    username: 'username_3'
}
const test_team_name_3 = "team_name_3"
const token_3 = tokenUtils.Create(config.token.kid, test_user_3.email, test_user_3.password, test_user_3.username)

let test_league = {
    name: "test_league",
    password: "test_league_password",
    // admin: will be added once the User is created
    participants: 2,
    type: "classic",
    goalkeepers: 1,
    defenders: 4,
    midfielders: 4,
    strikers: 2,
    players: 10,
    budget: 11,
    countdown: 3,
    auctionType: "call",
    startPrice: "zero",
    teams: [] // will be added once the league.Join api is successful
}

describe("LEAGUE.JOIN", () => {

    before(async () => {

        // Clean DB
        await User.deleteMany()
        await League.deleteMany()
        await Team.deleteMany()

        // Create User
        const test_user_1_db = await User.create(test_user_1)
        const test_user_2_db = await User.create(test_user_2)
        const test_user_3_db = await User.create(test_user_3)
        test_user_1["_id"] = test_user_1_db._id.toString()
        test_user_2["_id"] = test_user_2_db._id.toString()
        test_user_3["_id"] = test_user_3_db._id.toString()

        // Create League
        test_league["admin"] = test_user_1_db._id
        const test_league_db = await League.create(test_league)
    });

    after(() => {
        requester.close()
    })

    it("Body is undefined", async () => {
        const res = await requester
            .put(api)

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
        expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
    });

    it("Body is empty", async () => {
        const res = await requester
            .put(api)
            .send({})

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
        expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
    });

    it("League_id and League_name is NULL", async () => {
        const res = await requester
            .put(api)
            .set('Authorization', token_1)
            .send({
                id: null,
                name: null,
                password: test_league.password,
                teamname: test_team_name_1
            })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
        expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
    });

    it("League_id and EMPTY and League_name is NULL", async () => {
        const res = await requester
            .put(api)
            .set('Authorization', token_1)
            .send({
                id: '',
                name: null,
                password: test_league.password,
                teamname: test_team_name_1
            })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
        expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
    });

    it("League_password is NULL", async () => {
        const res = await requester
            .put(api)
            .set('Authorization', token_1)
            .send({
                id: '',
                name: test_league.name,
                password: null,
                teamname: test_team_name_1
            })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
        expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
    });

    it("League_password is EMPTY", async () => {
        const res = await requester
            .put(api)
            .set('Authorization', token_1)
            .send({
                id: '',
                name: test_league.name,
                password: '',
                teamname: test_team_name_1
            })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
        expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
    });

    it("Team_name is NULL", async () => {
        const res = await requester
            .put(api)
            .set('Authorization', token_1)
            .send({
                id: '',
                name: test_league.name,
                password: test_league.password,
                teamname: null
            })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
        expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
    });

    it("Team_name is EMPTY", async () => {
        const res = await requester
            .put(api)
            .set('Authorization', token_1)
            .send({
                id: '',
                name: test_league.name,
                password: test_league.password,
                teamname: ''
            })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
        expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
    });

    it("League_name does NOT EXIST", async () => {
        const res = await requester
            .put(api)
            .set('Authorization', token_1)
            .send({
                id: '',
                name: "not existing league",
                password: test_league.password,
                teamname: test_team_name_1
            })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.LEAGUE_NOT_FOUND.code)
        expect(res.body.status).to.equal(Errors.LEAGUE_NOT_FOUND.status)
    });

    it("League_password is NOT CORRECT", async () => {
        const res = await requester
            .put(api)
            .set('Authorization', token_1)
            .send({
                id: '',
                name: test_league.name,
                password: "wrong password",
                teamname: test_team_name_1
            })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.WRONG_PASSWORD.code)
        expect(res.body.status).to.equal(Errors.WRONG_PASSWORD.status)
    });

    it("First user is JOINING the LEAGUE", async () => {
        const res = await requester
            .put(api)
            .set('Authorization', token_1)
            .send({
                id: '',
                name: test_league.name,
                password: test_league.password,
                teamname: test_team_name_1
            })

        expect(res).to.have.status(200)
        expect(res.body).to.be.a('object')

        // Check user object
        expect(res.body.user).to.be.a('object')
        expect(res.body.user._id).to.equal(test_user_1._id)
        expect(res.body.user.username).to.equal(test_user_1.username)
        expect(res.body.user.leagues).to.have.length(1)
        expect(findPropertyValueInNestedObject(res.body.user.leagues, '_id', test_league._id)).to.be.true;
        expect(findPropertyValueInNestedObject(res.body.user.leagues, 'name', test_league.name)).to.be.true;
        expect(findPropertyValueInNestedObject(res.body.user.leagues, '_id', res.body.team._id)).to.be.true;
        expect(findPropertyValueInNestedObject(res.body.user.leagues, 'name', test_team_name_1)).to.be.true;

        // Check team object
        expect(res.body.team).to.be.a('object')
        expect(res.body.team.name).to.equal(test_team_name_1)
        expect(res.body.team.budget).to.equal(test_league.budget)
        expect(res.body.team.footballPlayers).to.have.length(0)
        expect(res.body.team.user._id).to.equal(test_user_1._id)
        expect(res.body.team.user.name).to.equal(test_user_1.username)

        // Check league object
        expect(res.body.league).to.be.a('object')
        expect(res.body.league.name).to.equal(test_league.name)
        expect(res.body.league.password).to.equal(test_league.password)
        expect(res.body.league.participants).to.equal(test_league.participants)
        expect(res.body.league.type).to.equal(test_league.type)
        expect(res.body.league.goalkeepers).to.equal(test_league.goalkeepers)
        expect(res.body.league.defenders).to.equal(test_league.defenders)
        expect(res.body.league.midfielders).to.equal(test_league.midfielders)
        expect(res.body.league.strikers).to.equal(test_league.strikers)
        expect(res.body.league.players).to.equal(test_league.players)
        expect(res.body.league.budget).to.equal(test_league.budget)
        expect(res.body.league.countdown).to.equal(test_league.countdown)
        expect(res.body.league.auctionType).to.equal(test_league.auctionType)
        expect(res.body.league.startPrice).to.equal(test_league.startPrice)

        expect(res.body.league.admin).to.be.a('object')
        expect(res.body.league.admin._id).to.equal(test_user_1._id)
        expect(res.body.league.admin.name).to.equal(test_user_1.username)

        expect(res.body.league.teams).to.have.length(1)
        expect(findPropertyValueInNestedObject(res.body.league.teams, '_id', res.body.team._id)).to.be.true;
        expect(findPropertyValueInNestedObject(res.body.league.teams, 'name', test_team_name_1)).to.be.true;
        expect(findPropertyValueInNestedObject(res.body.league.teams, '_id', test_user_1._id)).to.be.true;
        expect(findPropertyValueInNestedObject(res.body.league.teams, 'name', test_user_1.username)).to.be.true;
    });

    it("First user is JOINING the LEAGUE but USER ALREADY PRESENT", async () => {
        const res = await requester
            .put(api)
            .set('Authorization', token_1)
            .send({
                id: '',
                name: test_league.name,
                password: test_league.password,
                teamname: "new_team_name_1"
            })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.USER_PRESENT_IN_LEAGUE.code)
        expect(res.body.status).to.equal(Errors.USER_PRESENT_IN_LEAGUE.status)
    });

    it("Second user is JOINING the LEAGUE but TEAM NAME ALREADY PRESENT", async () => {
        const res = await requester
            .put(api)
            .set('Authorization', token_2)
            .send({
                id: '',
                name: test_league.name,
                password: test_league.password,
                teamname: test_team_name_1
            })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.TEAM_PRESENT_IN_LEAGUE.code)
        expect(res.body.status).to.equal(Errors.TEAM_PRESENT_IN_LEAGUE.status)
    });

    it("Second user is JOINING the LEAGUE", async () => {
        const res = await requester
            .put(api)
            .set('Authorization', token_2)
            .send({
                id: '',
                name: test_league.name,
                password: test_league.password,
                teamname: test_team_name_2
            })

        expect(res).to.have.status(200)
        expect(res.body).to.be.a('object')

        // Check user object
        expect(res.body.user).to.be.a('object')
        expect(res.body.user._id).to.equal(test_user_2._id)
        expect(res.body.user.username).to.equal(test_user_2.username)
        expect(res.body.user.leagues).to.have.length(1)
        expect(findPropertyValueInNestedObject(res.body.user.leagues, '_id', test_league._id)).to.be.true;
        expect(findPropertyValueInNestedObject(res.body.user.leagues, 'name', test_league.name)).to.be.true;
        expect(findPropertyValueInNestedObject(res.body.user.leagues, '_id', res.body.team._id)).to.be.true;
        expect(findPropertyValueInNestedObject(res.body.user.leagues, 'name', test_team_name_2)).to.be.true;

        // Check team object
        expect(res.body.team).to.be.a('object')
        expect(res.body.team.name).to.equal(test_team_name_2)
        expect(res.body.team.budget).to.equal(test_league.budget)
        expect(res.body.team.footballPlayers).to.have.length(0)
        expect(res.body.team.user._id).to.equal(test_user_2._id)
        expect(res.body.team.user.name).to.equal(test_user_2.username)

        // Check league object
        expect(res.body.league).to.be.a('object')
        expect(res.body.league.name).to.equal(test_league.name)
        expect(res.body.league.password).to.equal(test_league.password)
        expect(res.body.league.participants).to.equal(test_league.participants)
        expect(res.body.league.type).to.equal(test_league.type)
        expect(res.body.league.goalkeepers).to.equal(test_league.goalkeepers)
        expect(res.body.league.defenders).to.equal(test_league.defenders)
        expect(res.body.league.midfielders).to.equal(test_league.midfielders)
        expect(res.body.league.strikers).to.equal(test_league.strikers)
        expect(res.body.league.players).to.equal(test_league.players)
        expect(res.body.league.budget).to.equal(test_league.budget)
        expect(res.body.league.countdown).to.equal(test_league.countdown)
        expect(res.body.league.auctionType).to.equal(test_league.auctionType)
        expect(res.body.league.startPrice).to.equal(test_league.startPrice)

        expect(res.body.league.admin).to.be.a('object')
        expect(res.body.league.admin._id).to.equal(test_user_1._id)
        expect(res.body.league.admin.name).to.equal(test_user_1.username)

        expect(res.body.league.teams).to.have.length(2)
        expect(findPropertyValueInNestedObject(res.body.league.teams, 'name', test_team_name_1)).to.be.true;
        expect(findPropertyValueInNestedObject(res.body.league.teams, '_id', test_user_1._id)).to.be.true;
        expect(findPropertyValueInNestedObject(res.body.league.teams, 'name', test_user_1.username)).to.be.true;

        expect(findPropertyValueInNestedObject(res.body.league.teams, '_id', res.body.team._id)).to.be.true;
        expect(findPropertyValueInNestedObject(res.body.league.teams, 'name', test_team_name_2)).to.be.true;
        expect(findPropertyValueInNestedObject(res.body.league.teams, '_id', test_user_2._id)).to.be.true;
        expect(findPropertyValueInNestedObject(res.body.league.teams, 'name', test_user_2.username)).to.be.true;
    });

    it("Third user is JOINING the LEAGUE but LEAGUE IS FULL", async () => {
        const res = await requester
            .put(api)
            .set('Authorization', token_3)
            .send({
                id: '',
                name: test_league.name,
                password: test_league.password,
                teamname: test_team_name_3
            })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.FULL_LEAGUE.code)
        expect(res.body.status).to.equal(Errors.FULL_LEAGUE.status)
    });

});
