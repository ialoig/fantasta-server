import { expect, should, use } from 'chai'
import chaiHttp from 'chai-http'
import { User, Reset } from '../../src/database/index.js'
import { Errors } from '../../src/utils/index.js'
import { requester, printObject } from './index.js'

use(chaiHttp);
should();

const api = "/fantasta/auth/redirect"

const test_user = {
    //_id: it will be added once the user is created
    email: 'test_1@test.com',
    password: 'password_1',
    username: 'username_1'
}

const test_reset = {
    //_id: it will be added once the reset is created
    //user:
}

describe("AUTH.REDIRECT", () => {

    before(async () => {

        // Clean DB
        await User.deleteMany()
        await Reset.deleteMany()

        // Create User
        const test_user_db = await User.create(test_user)
        test_user["_id"] = test_user_db._id.toString()

        // Create Reset
        const test_reset_db = await Reset.create({ user: test_user_db._id })
        test_reset["_id"] = test_reset_db._id.toString()
    });

    after(() => {
        requester.close()
    })

    it("Body is undefined", async () => {
        const res = await requester
            .get(api)

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
        expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
    });

    it("Body is empty", async () => {
        const res = await requester
            .get(api)
            .send({})

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
        expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
    });

    it("ResetId is NOT VALID mongoId", async () => {
        const res = await requester
            .get(api)
            .query({
                id: "not_a_valid_mongo_id"
            })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
        expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
    });

    it("Reset request EXPIRED", async () => {
        const res = await requester
            .get(api)
            .query({
                id: "60889121f7f811014929d8f0"
            })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.RESET_EXPIRED.code)
        expect(res.body.status).to.equal(Errors.RESET_EXPIRED.status)
    });

    it("User get REDIRECTED to the resetPassword page in the app", async () => {
        const res = await requester
            .get(api)
            .query({
                id: test_reset._id
            })
            .redirects(0) // don't follow redirect url

        expect(res).to.redirect
        expect(res).to.have.status(302)
        expect(res.header.location).to.include('exp://192.168.0.154:19000/--/ResetPassword?email=')
    });

    it("ResetId EXISTS but User does NOT EXIST", async () => {
        await User.deleteMany()

        const res = await requester
            .get(api)
            .send({
                id: test_reset._id
            })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
        expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
    });

});
