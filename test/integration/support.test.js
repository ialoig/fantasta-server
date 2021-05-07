
import { expect, should, use } from 'chai';
import chaiHttp from 'chai-http'
import config from 'config'
import { User } from '../../src/database'
import { requester } from './index'
import { tokenUtils, Errors } from '../../src/utils'

use(chaiHttp);
should();

describe("Support", () => {
    beforeEach((done) => {
        User.deleteMany({}, (err) => {
            done();
        });
    });

    after(() => {
        requester.close()
    })

    it("Body is undefined", (done) => {
        requester.post('/fantasta/support')
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
        requester.post('/fantasta/support')
            .send({})
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
                expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
                done();
            });
    });

    it("Text is NULL", (done) => {
        requester.post('/fantasta/support')
            .send({ text: null })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
                expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
                done();
            });
    });

    xit("Token is VALID", (done) => {
        User.create({ email: 'test@test.com', password: '123456', username: 'username' }, () => {

            const token = tokenUtils.Create(config.token.kid, 'test@test.com', '123456', 'username')

            requester.post('/fantasta/support')
            .set('Authorization', token)
            .send({ email: 'test@test.com' })
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a('object')
                done();
            });
        })
    });
});
