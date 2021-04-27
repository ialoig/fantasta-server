import { expect, should, use } from 'chai'
import chaiHttp from 'chai-http'
import { User, League, Team } from '../../src/database/index.js'
import config from 'config'
import { tokenUtils, Errors } from '../../src/utils/index.js'
import { requester } from './index.js'

use(chaiHttp);
should();

const api = "/fantasta/league"

const test_user_1 = {
    //_id: it will be added once the user is created
    email: 'test_1@test.com',
    password: 'password_1',
    username: 'username_1'
}
const token_1 = tokenUtils.Create(config.token.kid, test_user_1.email, test_user_1.password, test_user_1.username)

const classic_league_data = {
    name: "league_1",
    password: 'league_1_password',
    participants: 2,
    type: "classic",
    goalkeepers: 1,
    defenders: 4,
    midfielders: 4,
    strikers: 2,
    players: 10,      // it will be set to 0 by the validation
    budget: 11,
    countdown: 3,
    auctionType: "call",
    startPrice: "zero",
    teamname: 'team_name_1',
    status: 'new'
}

describe("LEAGUE.PRESENT", () => {

    before(async () => {

        // Clean DB
        await User.deleteMany()
        await League.deleteMany()
        await Team.deleteMany()
    });

    after( async () => {
        requester.close()

        await User.deleteMany()
        await League.deleteMany()
        await Team.deleteMany()
    })

    it("Leaguename is undefined", async () => {
        const res = await requester.get(api)

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
        expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
    });

    it("Leaguename is empty", async () => {
        const res = await requester.get(api).query({leaguename: ''})

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
        expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
    });

    it("Leaguename is NULL", async () => {
        const res = await requester.get(api).query({leaguename: null})

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
        expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
    });

    it("League is PRESENT", async () => {

        const test_user_1_db = await User.create(test_user_1)
        classic_league_data.admin = test_user_1_db._id

        await League.create(classic_league_data)

        const res = await requester.get(api).set('Authorization', token_1).query({leaguename: 'league_1'})

        expect(res).to.have.status(200);
        expect(res.body).to.equal(true);
    });

    it("League is NOT PRESENT", async () => {
        const res = await requester.get(api).set('Authorization', token_1).query({leaguename: 'league_2'})

        expect(res).to.have.status(200);
        expect(res.body).to.equal(false);
    });

});
