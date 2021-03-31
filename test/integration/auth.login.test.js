
import { expect, should, use } from 'chai'
import chaiHttp from 'chai-http'
import { User } from '../../src/database/index.js'
import { requester } from './index.js'
import { Errors } from '../../src/utils/index.js'

use(chaiHttp);
should();

describe("LOGIN", () => {
    beforeEach((done) => {
        User.deleteMany({}, (err) => {
            done();
        });
    });

    after(() => {
        requester.close()
    })

    describe("PUT ->", () => {
        it("Body is undefined", (done) => {
            requester.put('/fantasta/auth/login')
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
            requester.put('/fantasta/auth/login')
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
            requester.put('/fantasta/auth/login')
                .send({ email: null, password: '123456' })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.a('object');
                    expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
                    expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
                    done();
                });
        });

        it("Email is NOT VALID", (done) => {
            requester.put('/fantasta/auth/login')
                .send({ email: 'asdgsdfgdsfg', password: '123456' })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.a('object');
                    expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
                    expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
                    done();
                });
        });

        it("Password is NULL", (done) => {
            requester.put('/fantasta/auth/login')
                .send({ email: 'test@test.com', password: null })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.a('object');
                    expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
                    expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
                    done();
                });
        });

        it("Password is NOT VALID", (done) => {
            requester.put('/fantasta/auth/login')
                .send({ email: 'test@test.com', password: '3452' })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.a('object');
                    expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
                    expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
                    done();
                });
        });

        it("Email and password are CORRECT but USER NOT PRESENT", (done) => {
            requester.put('/fantasta/auth/login')
                .send({ email: 'test@test.com', password: '123456' })
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.be.a('object');
                    expect(res.body.code).to.equal(Errors.EMAIL_NOT_FOUND.code)
                    expect(res.body.status).to.equal(Errors.EMAIL_NOT_FOUND.status)
                    done();
                });
        });

        it("USER IS PRESENT --> Email is CORRECT and password is INCORRECT", (done) => {
            User.create({ email: 'test@test.com', password: '123456' }, () => {
                requester.put('/fantasta/auth/login')
                    .send({ email: 'test@test.com', password: '654321' })
                    .end((err, res) => {
                        expect(res).to.have.status(400);
                        expect(res.body).to.be.a('object');
                        expect(res.body.code).to.equal(Errors.WRONG_PASSWORD.code)
                        expect(res.body.status).to.equal(Errors.WRONG_PASSWORD.status)
                        done();
                    });
            });
        });

        it("USER IS PRESENT 200 --> Email and password are CORRECT", (done) => {
            User.create({ email: 'test@test.com', password: '123456', username: 'username' }, () => {
                requester.put('/fantasta/auth/login')
                    .send({ email: 'test@test.com', password: '123456' })
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('object').that.is.not.empty;
                        expect(res.body.user).to.be.a('object').that.is.not.empty;
                        expect(res.body.token).to.be.a('string');
                        done();
                    });
            })
        });

    });
});
