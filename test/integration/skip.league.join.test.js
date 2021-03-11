import { expect, should, use } from 'chai'
import chaiHttp from 'chai-http'
import { User, League, Team, populate } from '../../src/database/index.js'
import config from 'config'
import { tokenUtils } from '../../src/utils/index.js'
import { requester } from './index.js'
import { strict as assert } from 'assert'

use(chaiHttp);
should();

const printObject = (obj) => {
    console.log("------------")
    console.log(JSON.stringify(obj, null, 2))
    console.log("------------")
}

describe("LEAGUE.JOIN", () => {

    const league_join_api = "/fantasta/league/join"

    let test_user = {
        email: 'test@test.com',
        password: '123456',
        username: 'username'
    }

    const token = tokenUtils.Create(config.token.kid, test_user.email, test_user.password, test_user.username)

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
        budget: 11,
        countdown: 3,
        auctionType: "call",
        startPrice: "zero",
        teams: [] // will be added once a Team is created
    }

    let test_team = {
        name: "test_team",
        footballPlayers: [],
        budget: 100,
        user: null,   // will be added once a User is created
        league: null, // will be added once a League is created
    }

    // objects saved in MongoDB
    let test_user_db = {}
    let test_league_db = {}
    let test_team_db = {}

    /*
    before((done) => {

        // Create User
        User.deleteMany({}, (err) => {
            User.create(test_user, (err, userDB) => {
                // I should wait for completion
                test_user_db = userDB
                console.log(`88888 userDB: ${userDB}`)

                // Create League
                League.deleteMany({}, (err) => {
                    test_league["admin"] = userDB._id
                    League.create(test_league, (err, leagueDB) => {
                        // I should wait for completion
                        test_league_db = leagueDB
                        console.log(`88888 leagueDB: ${leagueDB}`)

                        // Create Team
                        Team.deleteMany({}, (err) => {
                            test_team["user"] = userDB._id
                            test_team["league"] = test_league_db._id
                            Team.create(test_team, (err, teamDB) => {
                                // I should wait for completion
                                console.log(`88888 teamDB: ${teamDB}`)
                                let tm1 = populate.team(test_team_db)
                                test_team_db = tm1
                                console.log("tm1")
                                printObject(tm1)
                            });
                        });
                    });
                });

                done();
            });
        });
    });
    */

    before(async () => {
        try {
            // Create User
            await User.deleteMany()
            test_user_db = await User.create(test_user)
            console.log(`test_user_db: ${test_user_db}`)

            // Create League
            await League.deleteMany()
            test_league["admin"] = test_user_db._id
            test_league_db = await League.create(test_league)
            console.log(`test_league_db: ${test_league_db}`)

            // Create Team
            await Team.deleteMany()
            test_team["user"] = test_user_db._id
            test_team["league"] = test_league_db._id
            test_team_db = await Team.create(test_team)
            console.log(`test_team_db: ${test_team_db}`)
            // const test_team_db_populated = await populate.team(test_team_db_tmp)
            // console.log(`test_team_db_populated: ${JSON.stringify(test_team_db_populated, null, 2)}`)
        }
        catch (error) {
            console.log(`An error occurred!!!!!!!!${error}`);
        }
    });

    after(() => {
        requester.close()
    })

    /*
    it("TEST", async () => {
        console.log("000000000000000000000000")
        console.log(`test_user_db:\n${JSON.stringify(test_user_db, null, 2)}`)
        console.log(`test_league_db:\n${JSON.stringify(test_league_db, null, 2)}`)
        console.log(`test_team_db:\n${JSON.stringify(test_team_db, null, 2)}`)
        console.log("000000000000000000000000")
        assert.strictEqual(true, true)
        done()
    });
    */


    it("Body is undefined", (done) => {
        requester.put(league_join_api)
            .send(undefined)
            .end((err, res) => {
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
                done();
            });
    });

    /*
    it("Body is empty", (done) => {
        requester.put(league_join_api)
            .send({})
            .end((err, res) => {
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
                done();
            });
    });

    it("League_id and League_name is NULL", (done) => {
        requester.put(league_join_api)
            .send({ id: null, name: null, password: "1234", teamname: "team1" })
            .end((err, res) => {
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
                done();
            });
    });

    it("League_name is NULL", (done) => {
        requester.put(league_join_api)
            .send({ id: '', name: null, password: "1234", teamname: "team1" })
            .end((err, res) => {
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
                done();
            });
    });

    it("League_password is NULL", (done) => {
        requester.put(league_join_api)
            .send({ id: '', name: "league1", password: null, teamname: "team1" })
            .end((err, res) => {
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
                done();
            });
    });

    it("Team_name is NULL", (done) => {
        requester.put(league_join_api)
            .send({ id: '', name: "league1", password: "1234", teamname: null })
            .end((err, res) => {
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
                done();
            });
    });

    it("League_name does NOT EXIST", (done) => {
        requester.put(league_join_api)
            .set('Authorization', token)
            .send({ id: '', name: "unexisting league", password: "1234", teamname: "team1" })
            .end((err, res) => {
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
                done();
            });
    });

    it("League_password is NOT CORRECT", (done) => {
        requester.put(league_join_api)
            .set('Authorization', token)
            .send({ id: '', name: "league1", password: "wrong_password", teamname: "team1" })
            .end((err, res) => {
                printObject(res)
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
                done();
            });
    });

    // TODO: FIX THIS BUG !!!
    /*
    it("League_name and League_password are CORRECT but TEAM NAME IS ALREADY PRESENT", (done) => {
        requester.put(league_join_api)
            .set('Authorization', token)
            .send({ id: '', name: "test_league", password: "test_league_password", teamname: "test_team" })
            .end((err, res) => {
                printObject(res)
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.code).to.equal(400);
                expect(res.body.info).to.be.a('object');
                expect(res.body.info.title).to.be.a('string');
                expect(res.body.info.message).to.be.a('string');
                done();
            });
    });

    it("TEAM IS JOINING the league", (done) => {

        const new_join = {
            id: '',
            name: "test_league",
            password: "test_league_password",
            teamname: "test_new_team"
        }
        requester.put(league_join_api)
            .set('Authorization', token)
            .send(new_join)
            .end((err, res) => {
                printObject(res)
                expect(res).to.have.status(200)
                expect(res.body).to.be.a('object')

                // Check user is created correctly
                expect(res.body.user).to.be.a('object')

                // Check team is created correctly
                expect(res.body.team).to.be.a('object')

                // Check league is created correctly
                expect(res.body.league).to.be.a('object')
                expect(res.body.league.name).to.equal(test_league.name)
                expect(res.body.league.password).to.equal(test_league.password)
                // expect(res.body.league.admin).to.equal(test_user._id)
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
                expect(res.body.league.teams).to.have.length(1)
                expect(res.body.league.teams[0].name).to.equal(new_join.teamname)
                expect(res.body.league.teams[0].user.name).to.equal(test_user.name)
                done();
            });
    });
*/
});
