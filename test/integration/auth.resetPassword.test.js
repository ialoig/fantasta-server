import { expect, should, use } from 'chai'
import chaiHttp from 'chai-http'
import { User, Reset } from '../../src/database/index.js'
import { Errors } from '../../src/utils/index.js'
import { requester, printObject } from './index.js'

use(chaiHttp);
should();

const api = "/fantasta/auth/resetPassword"

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

describe("AUTH.RESET", () => {

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

    it("User EMAIL IS NOT VALID", async () => {
        const res = await requester
            .put(api)
            .send({
                email: "non_valid_email_address",
                password: test_user.password,
            })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
        expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
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

    it("User EMAIL does NOT EXIST", async () => {
        const res = await requester
            .put(api)
            .send({
                email: "non_existing_email@email.com",
                password: test_user.password,
            })

        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body.code).to.equal(Errors.EMAIL_NOT_FOUND.code)
        expect(res.body.status).to.equal(Errors.EMAIL_NOT_FOUND.status)
    });

    it("User RESET his PASSWORD", async () => {

        const resetPassword_before = await Reset.findOne({ user: test_user._id })
        expect(resetPassword_before).to.be.a('object')

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
        const userResetPassword = await User.findOne({ email: test_user.email })
        expect(userResetPassword).to.be.a('object')
        expect(userResetPassword._id.toString()).be.equal(test_user._id.toString())
        expect(userResetPassword.email).be.equal(test_user.email)
        expect(userResetPassword.username).be.equal(test_user.username)
        expect(userResetPassword.password).be.equal(newPassword)
        expect(userResetPassword.leagues).to.have.length(0)

        // Check reset data in mongo DB
        const resetPassword_after = await Reset.findOne({ user: test_user._id })
        expect(resetPassword_after).to.be.null
    });

});
