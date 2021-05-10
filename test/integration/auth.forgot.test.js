
import { expect, should, use } from 'chai';
import chaiHttp from 'chai-http'
import { User } from '../../src/database/index.js'
import { requester } from './index.js'
import { Errors } from '../../src/utils/index.js'

use(chaiHttp);
should();

describe("Forgot", () => {
    beforeEach((done) => {
        User.deleteMany({}, (err) => {
            done();
        });
    });

    after(() => {
        requester.close()
    })

    it("Body is undefined", (done) => {
        requester.put('/fantasta/auth/forgot')
            .send(undefined)
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.code).to.equal(Errors.EMAIL_ERROR.code)
                expect(res.body.status).to.equal(Errors.EMAIL_ERROR.status)
                done();
            });
    });

    it("Body is empty", (done) => {
        requester.put('/fantasta/auth/forgot')
            .send({})
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.code).to.equal(Errors.EMAIL_ERROR.code)
                expect(res.body.status).to.equal(Errors.EMAIL_ERROR.status)
                done();
            });
    });

    it("Email is NULL", (done) => {
        requester.put('/fantasta/auth/forgot')
            .send({ email: null })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.code).to.equal(Errors.EMAIL_ERROR.code)
                expect(res.body.status).to.equal(Errors.EMAIL_ERROR.status)
                done();
            });
    });

    it("Email is NOT VALID", (done) => {
        requester.put('/fantasta/auth/forgot')
            .send({ email: 'asdgsdfgdsfg' })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.code).to.equal(Errors.EMAIL_ERROR.code)
                expect(res.body.status).to.equal(Errors.EMAIL_ERROR.status)
                done();
            });
    });

    it("Email is VALID but NOT FOUND", (done) => {
        requester.put('/fantasta/auth/forgot')
            .send({ email: 'test@test.com' })
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a('object')
                done();
            });
    });

    xit("Email is CORRECT", (done) => {
        User.create({ email: 'test@test.com', password: '123456', username: 'username' }, () => {
            requester.put('/fantasta/auth/forgot')
                .send({ email: 'test@test.com' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object')
                    done();
                });
        })
    });
});
