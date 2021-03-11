import { expect, should, use } from 'chai'
import chaiHttp from 'chai-http'
import { User, League, Team, populate } from '../../src/database/index.js'
import config from 'config'
import { tokenUtils } from '../../src/utils/index.js'
import { requester, findPropertyValueInNestedObject } from './index.js'

use(chaiHttp);
should();

const printObject = (msg, obj) => {
    console.log("------------------------------------")
    console.log(`${msg}: ${JSON.stringify(obj, null, 2)}`)
    console.log("------------------------------------")
}

describe("LEAGUE.JOIN", () => {

    const league_join_api = "/fantasta/league/join"

    const test_user_1 = {
        email: 'test@test.com',
        password: '123456',
        username: 'username'
    }
    const token = tokenUtils.Create(config.token.kid, test_user_1.email, test_user_1.password, test_user_1.username)
    const test_team_name_1 = "team_name_1"

    const test_user_2 = {
        email: 'test2@test2.com',
        password: '123456',
        username: 'username_2'
    }
    const test_team_name_2 = "team_name_2"
    const token_2 = tokenUtils.Create(config.token.kid, test_user_2.email, test_user_2.password, test_user_2.username)

    const test_user_3 = {
        email: 'test2@test2.com',
        password: '123456',
        username: 'username_3'
    }
    const test_team_name_3 = "team_name_3"
    const token_3 = tokenUtils.Create(config.token.kid, test_user_3.email, test_user_3.password, test_user_3.username)

    let test_league = {
        name: "test_league",
        password: "test_league_password",
        admin: null, // will be added once the User is created
        participants: 2,
        goalkeepers: 1,
        defenders: 4,
        midfielders: 4,
        strikers: 2,
        players: 10,
        budget: 11, //TODO: if budget is specified also in LEAGUE we end up with 2 objects
        countdown: 3,
        auctionType: "call",
        startPrice: "zero",
        teams: [] // will be added once a Team is created
    }

    /*
    let test_team = {
        name: "test_team",
        footballPlayers: [],
        budget: 100, //TODO: if budget is specified also in TEAM we end up with 2 objects
        user: null,   // will be added once a User is created
        league: null, // will be added once a League is created
    }
    */

    before(async () => {
        // Create User
        await User.deleteMany()
        const test_user_db = await User.create(test_user_1)
        // console.log(`test_user_db: ${test_user_db}`)
        const test_user_db_2 = await User.create(test_user_2)
        // console.log(`test_user_2: ${test_user_2}`)

        // Create League
        await League.deleteMany()
        test_league["admin"] = test_user_db._id
        const test_league_db = await League.create(test_league)
        // console.log(`test_league_db: ${test_league_db}`)

        // Create Team
        await Team.deleteMany()
        // test_team["user"] = test_user_db._id
        // test_team["league"] = test_league_db._id
        // const test_team_db = await Team.create(test_team)
        // console.log(`test_team_db: ${test_team_db}`)
    });

    after(() => {
        requester.close()
    })

    it("Body is undefined", async () => {
        const res = await requester
            .put(league_join_api)

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(400);
        expect(res.body.status).to.equal('Bad Request');
        // expect(res.body.status).to.equal(Constants.BAD_REQUEST); // todo: something like this
        expect(res.body.info).to.be.a('object');
        expect(res.body.info.title).to.be.a('string');
        expect(res.body.info.message).to.be.a('string');
        expect(res.body.info.code).to.be.a('string');
        expect(res.body.info.status).to.be.a('string');
        // expect(res.body.info.title).to.equal(ErrorMessages.PARAMS_ERROR.title);    // todo: something like this
        // expect(res.body.info.message).toequal(ErrorMessages.PARAMS_ERROR.message); // todo: something like this
        // expect(res.body.info.code).to.equal(Constants.PARAMS_ERROR);               // todo: something like this
        // expect(res.body.info.status).toequal(Constants.PARAMS_ERROR);              // todo: something like this
    });

    it("Body is empty", async () => {
        const res = await requester
            .put(league_join_api)
            .send({})

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(400);
        expect(res.body.status).to.equal('Bad Request');
        // expect(res.body.status).to.equal(Constants.BAD_REQUEST); // todo: something like this
        expect(res.body.info).to.be.a('object');
        expect(res.body.info.title).to.be.a('string');
        expect(res.body.info.message).to.be.a('string');
        expect(res.body.info.code).to.be.a('string');
        expect(res.body.info.status).to.be.a('string');
        // expect(res.body.info.title).to.equal(ErrorMessages.PARAMS_ERROR.title);    // todo: something like this
        // expect(res.body.info.message).toequal(ErrorMessages.PARAMS_ERROR.message); // todo: something like this
        // expect(res.body.info.code).to.equal(Constants.PARAMS_ERROR);               // todo: something like this
        // expect(res.body.info.status).toequal(Constants.PARAMS_ERROR);              // todo: something like this
    });

    it("League_id and League_name is NULL", async () => {
        const res = await requester
            .put(league_join_api)
            .send({
                id: null,
                name: null,
                password: "1234",
                teamname: "team1"
            })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(400);
        expect(res.body.status).to.equal('Bad Request');
        // expect(res.body.status).to.equal(Constants.BAD_REQUEST); // todo: something like this
        expect(res.body.info).to.be.a('object');
        expect(res.body.info.title).to.be.a('string');
        expect(res.body.info.message).to.be.a('string');
        expect(res.body.info.code).to.be.a('string');
        expect(res.body.info.status).to.be.a('string');
        // expect(res.body.info.title).to.equal(ErrorMessages.PARAMS_ERROR.title);    // todo: something like this
        // expect(res.body.info.message).toequal(ErrorMessages.PARAMS_ERROR.message); // todo: something like this
        // expect(res.body.info.code).to.equal(Constants.PARAMS_ERROR);               // todo: something like this
        // expect(res.body.info.status).toequal(Constants.PARAMS_ERROR);              // todo: something like this
    });

    it("League_name is NULL", async () => {
        const res = await requester.put(league_join_api)
            .send({
                id: '',
                name: null,
                password: "1234",
                teamname: "team1"
            })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(400);
        expect(res.body.status).to.equal('Bad Request');
        // expect(res.body.status).to.equal(Constants.BAD_REQUEST); // todo: do something like this
        expect(res.body.info).to.be.a('object');
        expect(res.body.info.title).to.be.a('string');
        expect(res.body.info.message).to.be.a('string');
        expect(res.body.info.code).to.be.a('string');
        expect(res.body.info.status).to.be.a('string');
        // expect(res.body.info.title).to.equal(ErrorMessages.PARAMS_ERROR.title);    // todo: something like this
        // expect(res.body.info.message).toequal(ErrorMessages.PARAMS_ERROR.message); // todo: something like this
        // expect(res.body.info.code).to.equal(Constants.PARAMS_ERROR);               // todo: something like this
        // expect(res.body.info.status).toequal(Constants.PARAMS_ERROR);              // todo: something like this
    });

    it("League_password is NULL", async () => {
        const res = await requester.put(league_join_api)
            .send({
                id: '',
                name: "league1",
                password: null,
                teamname: "team1"
            })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(400);
        expect(res.body.status).to.equal('Bad Request');
        // expect(res.body.status).to.equal(Constants.BAD_REQUEST); // todo: do something like this
        expect(res.body.info).to.be.a('object');
        expect(res.body.info.code).to.be.a('string');
        expect(res.body.info.status).to.be.a('string');
        // expect(res.body.info.title).to.equal(ErrorMessages.PARAMS_ERROR.title);    // todo: something like this
        // expect(res.body.info.message).toequal(ErrorMessages.PARAMS_ERROR.message); // todo: something like this
        // expect(res.body.info.code).to.equal(Constants.PARAMS_ERROR);               // todo: something like this
        // expect(res.body.info.status).toequal(Constants.PARAMS_ERROR);              // todo: something like this
    });

    it("Team_name is NULL", async () => {
        const res = await requester.put(league_join_api)
            .send({
                id: '',
                name: "league1",
                password: "1234",
                teamname: null
            })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(400);
        expect(res.body.status).to.equal('Bad Request');
        // expect(res.body.status).to.equal(Constants.BAD_REQUEST); // todo: do something like this
        expect(res.body.info).to.be.a('object');
        expect(res.body.info.code).to.be.a('string');
        expect(res.body.info.status).to.be.a('string');
        // expect(res.body.info.title).to.equal(ErrorMessages.PARAMS_ERROR.title);    // todo: something like this
        // expect(res.body.info.message).toequal(ErrorMessages.PARAMS_ERROR.message); // todo: something like this
        // expect(res.body.info.code).to.equal(Constants.PARAMS_ERROR);               // todo: something like this
        // expect(res.body.info.status).toequal(Constants.PARAMS_ERROR);              // todo: something like this
    });

    it("League_name does NOT EXIST", async () => {
        const res = await requester.put(league_join_api)
            .set('Authorization', token)
            .send({
                id: '',
                name: "unexisting league",
                password: "1234",
                teamname: "team1"
            })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(400);
        expect(res.body.status).to.equal('Bad Request');
        // expect(res.body.status).to.equal(Constants.BAD_REQUEST); // todo: do something like this
        expect(res.body.info).to.be.a('object');
        expect(res.body.info.title).to.be.a('string');
        expect(res.body.info.message).to.be.a('string');
        expect(res.body.info.code).to.be.a('string');
        expect(res.body.info.status).to.be.a('string');
        // expect(res.body.info.title).to.equal(ErrorMessages.LEAGUE_NOT_FOUND.title);    // todo: something like this
        // expect(res.body.info.message).toequal(ErrorMessages.LEAGUE_NOT_FOUND.message); // todo: something like this
        // expect(res.body.info.code).to.equal(Constants.LEAGUE_NOT_FOUND);               // todo: something like this
        // expect(res.body.info.status).toequal(Constants.LEAGUE_NOT_FOUND);              // todo: something like this
        expect(res.body.data).to.equal('LEAGUE_NOT_FOUND');
    });

    it("League_password is NOT CORRECT", async () => {
        const res = await requester.put(league_join_api)
            .set('Authorization', token)
            .send({
                id: '',
                name: "league1",
                password: "wrong_password",
                teamname: "team1"
            })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(400);
        expect(res.body.status).to.equal('Bad Request');
        // expect(res.body.status).to.equal(Constants.BAD_REQUEST); // todo: do something like this
        expect(res.body.info).to.be.a('object');
        expect(res.body.info.title).to.be.a('string');
        expect(res.body.info.message).to.be.a('string');
        expect(res.body.info.code).to.be.a('string');
        expect(res.body.info.status).to.be.a('string');
        // expect(res.body.info.title).to.equal(ErrorMessages.LEAGUE_NOT_FOUND.title);    // todo: something like this
        // expect(res.body.info.message).toequal(ErrorMessages.LEAGUE_NOT_FOUND.message); // todo: something like this
        // expect(res.body.info.code).to.equal(Constants.LEAGUE_NOT_FOUND);               // todo: something like this
        // expect(res.body.info.status).toequal(Constants.LEAGUE_NOT_FOUND);              // todo: something like this
        expect(res.body.data).to.equal('LEAGUE_NOT_FOUND');
    });

    it("USER IS JOINING the league", async () => {
        const res = await requester.put(league_join_api)
            .set('Authorization', token)
            .send({
                id: '',
                name: test_league.name,
                password: test_league.password,
                teamname: test_team_name_1
            })

        // res contains User, Team, League fully populated objects
        // const saved_user = await User.find({ username: test_user_1.username })
        // const saved_team = await Team.find({ name: test_team_name_1 })
        // const saved_league = await League.find({ name: test_league.name })

        expect(res).to.have.status(200)

        expect(res.body).to.be.a('object')
        expect(res.body.user).to.be.a('object')
        expect(res.body.team).to.be.a('object')
        expect(res.body.league).to.be.a('object')

        // Check league object
        expect(res.body.league.name).to.equal(test_league.name)
        expect(res.body.league.password).to.equal(test_league.password)
        expect(res.body.league.participants).to.equal(test_league.participants)
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
        expect(res.body.league.admin.email).to.equal(test_user_1.email)
        // expect(res.body.league.admin.name).to.equal(test_user_1.username) // TODO: why admin.name = email??

        expect(res.body.league.teams).to.have.length(1)
        expect(findPropertyValueInNestedObject(res.body.league.teams, 'name', test_team_name_1)).to.be.true;
        expect(findPropertyValueInNestedObject(res.body.league.teams, 'email', test_user_1.email)).to.be.true;
    });

    it("League_name and League_password are CORRECT but TEAM NAME IS ALREADY PRESENT", async () => {
        const res = await requester.put(league_join_api)
            .set('Authorization', token)
            .send({
                id: '',
                name: test_league.name,
                password: test_league.password,
                teamname: test_team_name_1
            })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(400);
        expect(res.body.info).to.be.a('object');
        expect(res.body.info.title).to.be.a('string');
        expect(res.body.info.message).to.be.a('string');
        expect(res.body.data).to.equal('USER_TEAM_PRESENT');
    });

    it("League_name and League_password are CORRECT but USER ALREADY PRESENT", async () => {
        const res = await requester.put(league_join_api)
            .set('Authorization', token)
            .send({
                id: '',
                name: test_league.name,
                password: test_league.password,
                teamname: "new_test_team"
            })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(400);
        expect(res.body.info).to.be.a('object');
        expect(res.body.info.title).to.be.a('string');
        expect(res.body.info.message).to.be.a('string');
        expect(res.body.data).to.equal('USER_TEAM_PRESENT'); //todo: it should be USER_PRESENT
    });

    it("Second USER IS JOINING the league", async () => {
        const res = await requester.put(league_join_api)
            .set('Authorization', token_2)
            .send({
                id: '',
                name: test_league.name,
                password: test_league.password,
                teamname: test_team_name_2
            })

        // res contains User, Team, League fully populated objects
        const saved_user = await User.find({ username: test_user_2.username })
        const saved_team = await Team.find({ name: test_team_name_2 })
        const saved_league = await League.find({ name: test_league.name })

        console.log(`==================================================`)
        printObject("saved_user", saved_user)
        printObject("saved_team", saved_team)
        printObject("saved_league", saved_league)
        printObject("res", res)
        console.log(`==================================================`)

        expect(res).to.have.status(200)

        expect(res.body).to.be.a('object')
        expect(res.body.user).to.be.a('object')
        expect(res.body.team).to.be.a('object')
        expect(res.body.league).to.be.a('object')

        // Check league object
        expect(res.body.league.name).to.equal(test_league.name)
        expect(res.body.league.password).to.equal(test_league.password)
        expect(res.body.league.participants).to.equal(test_league.participants)
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
        expect(res.body.league.admin.email).to.equal(test_user_1.email)
        // expect(res.body.league.admin.name).to.equal(test_user_1.username) // TODO: why admin.name = email??

        expect(res.body.league.teams).to.have.length(2)
        expect(findPropertyValueInNestedObject(res.body.league.teams, 'name', test_team_name_1)).to.be.true;
        expect(findPropertyValueInNestedObject(res.body.league.teams, 'email', test_user_1.email)).to.be.true;
        expect(findPropertyValueInNestedObject(res.body.league.teams, 'name', test_team_name_2)).to.be.true;
        expect(findPropertyValueInNestedObject(res.body.league.teams, 'email', test_user_2.email)).to.be.true;
    });

    it("Third USER IS JOINING the league but LEAGUE ID FULL", async () => {
        const res = await requester.put(league_join_api)
            .set('Authorization', token_3)
            .send({
                id: '',
                name: test_league.name,
                password: test_league.password,
                teamname: test_team_name_3
            })

        // res contains User, Team, League fully populated objects
        // const saved_user = await User.find({ username: test_user_3.username })
        // const saved_team = await Team.find({ name: test_team_name_3 })
        // const saved_league = await League.find({ name: test_league.name })

        printObject(`res: ${res}`)
        // TODO: the response contains all the information about the league, user and teams

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(400);
        expect(res.body.info).to.be.a('object');
        expect(res.body.info.title).to.be.a('string');
        expect(res.body.info.message).to.be.a('string');
        // expect(res.body.data).toequal(Constants.FULL_LEAGUE);      // todo: something like this
        expect(res.body.data).to.equal('FULL_LEAGUE');

    });

});
