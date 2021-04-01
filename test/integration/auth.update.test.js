
import { expect, should, use } from 'chai'
import chaiHttp from 'chai-http'
import config from 'config'
import { User } from '../../src/database/index.js'
import { tokenUtils, Errors } from '../../src/utils/index.js'
import { requester } from './index.js'

use(chaiHttp);
should();

describe("UPDATE", () => {
    before((done) => {
        User.deleteMany({}, (err) => {
            User.create({ email: 'test@test.com', password: '123456', username: 'username' }, (err) => {
                done();
            })
        });
    });

    after(() => {
        requester.close()
    });

    it("Body is undefined", (done) => {
        requester.put('/fantasta/auth/update')
            .send(undefined)
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
                expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
                done();
            });
    });

    it("Body is empty", (done) => {
        requester.put('/fantasta/auth/update')
            .send({})
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
                expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
                done();
            });
    });

    it("Email is NULL", (done) => {
        requester.put('/fantasta/auth/update')
            .send({ email: null })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
                expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
                done();
            });
    });

    it("Email is NOT VALID", (done) => {
        requester.put('/fantasta/auth/update')
            .send({ email: 'blabla' })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
                expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
                done();
            });
    });

    it("Email is CORRECT", (done) => {
        const token = tokenUtils.Create(config.token.kid, 'test@test.com', '123456', 'username')

        requester.put('/fantasta/auth/update')
            .set('Authorization', token)
            .send({ email: 'test@test.it' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.user).to.be.a('object').that.is.not.empty;
                expect(res.body.user.email).to.equal('test@test.it')
                expect(res.body.token).to.be.a('string');
                done();
            });
    });

    it("Password is NULL", (done) => {
        requester.put('/fantasta/auth/update')
            .send({ password: null })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
                expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
                done();
            });
    });

    it("Password is NOT VALID", (done) => {
        requester.put('/fantasta/auth/update')
            .send({ password: '226' })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
                expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
                done();
            });
    });

    it("Password is CORRECT", (done) => {
        const token = tokenUtils.Create(config.token.kid, 'test@test.it', '123456', 'username')

        requester.put('/fantasta/auth/update')
            .set('Authorization', token)
            .send({ password: '654321' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.user).to.be.a('object').that.is.not.empty;
                expect(res.body.user.email).to.equal('test@test.it')
                expect(res.body.token).to.be.a('string');
                done();
            });
    });

    it("Username is NULL", (done) => {
        requester.put('/fantasta/auth/update')
            .send({ username: null })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
                expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
                done();
            });
    });

    it("Username is NOT CORRECT", (done) => {
        requester.put('/fantasta/auth/update')
            .send({ username: '' })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
                expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
                done();
            });
    });

    it("Username is CORRECT", (done) => {
        const token = tokenUtils.Create(config.token.kid, 'test@test.it', '654321', 'username')

        requester.put('/fantasta/auth/update')
            .set('Authorization', token)
            .send({ username: 'user' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.user).to.be.a('object').that.is.not.empty;
                expect(res.body.user.username).to.equal('user')
                expect(res.body.token).to.be.a('string');
                done();
            });
    });
});
