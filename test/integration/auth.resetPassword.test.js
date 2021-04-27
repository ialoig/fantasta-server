import { expect, should, use } from 'chai'
import chaiHttp from 'chai-http'
import { User, League, Team, populate } from '../../src/database/index.js'
import config from 'config'
import { tokenUtils, Errors } from '../../src/utils/index.js'
import { requester, findPropertyValueInNestedObject, printObject } from './index.js'

use(chaiHttp);
should();

const api = "/fantasta/auth/resetPassword"

const test_user = {
    //_id: it will be added once the user is created
    email: 'test_1@test.com',
    password: 'password_1',
    username: 'username_1'
}

describe("AUTH.RESET", () => {

    before(async () => {

        // Clean DB
        await User.deleteMany()

        // Create User
        const test_user_db = await User.create(test_user)
        test_user["_id"] = test_user_db._id.toString()
    });

    after(() => {
        requester.close()
    })

    /*
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

    it("User EMAIL does NOT EXIST", async () => {
        const res = await requester
            .put(api)
            .send({
                email: "non_existing_email",
                password: test_user.password,
            })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.EMAIL_NOT_FOUND.code)
        expect(res.body.status).to.equal(Errors.EMAIL_NOT_FOUND.status)
    });

    it("User PASSWORD is NOT VALID", async () => {
        const res = await requester
            .put(api)
            .send({
                email: test_user.email,
                password: "12",
            })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
        expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
    });
    */

    it("User RESET his PASSWORD", async () => {
        const newPassword = test_user.password + "_new"
        const res = await requester
            .put(api)
            .send({
                email: test_user.email,
                password: newPassword
            })

        expect(res).to.have.status(200)
        expect(res.body).to.be.a('object')

        // Check user data in the response
        expect(res.body.user).to.be.a('object')
        expect(res.body.user._id).to.equal(test_user._id.toString())
        expect(res.body.user.email).to.equal(test_user.email)
        expect(res.body.user.username).to.equal(test_user.username)
        expect(res.body.user.password).to.be.undefined
        expect(res.body.user.leagues).to.have.length(0)

        // Check user data in mongo DB
        let userResetPassword = await User.findOne({ email: test_user.email })
        expect(userResetPassword).to.be.a('object')
        expect(userResetPassword._id.toString()).be.equal(test_user._id.toString())
        expect(userResetPassword.email).be.equal(test_user.email)
        expect(userResetPassword.username).be.equal(test_user.username)
        expect(userResetPassword.password).be.equal(newPassword)
        expect(userResetPassword.leagues).to.have.length(0)
    });

});
