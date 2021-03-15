
import { expect, should, use } from 'chai';
import chaiHttp from 'chai-http'
import { User } from '../../src/database/index.js'
import { requester } from './index.js'

use(chaiHttp);
should();

describe( "Forgot", () =>
{
    beforeEach((done) => {
        User.deleteMany({}, (err) => {
           done();           
        });
    });

    after(() => {
        requester.close()
    })

    describe("PUT ->", () =>
    {
        it("Body is undefined", (done) =>
        {
            requester.put('/fantasta/auth/forgot')
            .send(undefined)
            .end( (err, res) =>
            {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.code).to.equal(400);
                expect(res.body.status).to.equal('Bad Request');
                expect(res.body.info).to.be.a('object');
                expect(res.body.info.title).to.be.a('string');
                expect(res.body.info.message).to.be.a('string');
                done();
            });
        });

        it("Body is empty", (done) =>
        {
            requester.put('/fantasta/auth/forgot')
            .send({})
            .end( (err, res) =>
            {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.code).to.equal(400);
                expect(res.body.status).to.equal('Bad Request');
                expect(res.body.info).to.be.a('object');
                expect(res.body.info.title).to.be.a('string');
                expect(res.body.info.message).to.be.a('string');
                done();
            });
        });

        it("Email is NULL", (done) =>
        {
            requester.put('/fantasta/auth/forgot')
            .send({ email: null })
            .end( (err, res) =>
            {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.code).to.equal(400);
                expect(res.body.status).to.equal('Bad Request');
                expect(res.body.info).to.be.a('object');
                expect(res.body.info.title).to.be.a('string');
                expect(res.body.info.message).to.be.a('string');
                done();
            });
        });

        it("Email is NOT CORRECT", (done) =>
        {
            requester.put('/fantasta/auth/forgot')
            .send({ email: 'asdgsdfgdsfg' })
            .end( (err, res) =>
            {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.code).to.equal(400);
                expect(res.body.status).to.equal('Bad Request');
                expect(res.body.info).to.be.a('object');
                expect(res.body.info.title).to.be.a('string');
                expect(res.body.info.message).to.be.a('string');
                done();
            });
        });

        it("Email is CORRECT but USER NOT PRESENT", (done) =>
        {
            requester.put('/fantasta/auth/forgot')
            .send({ email: 'test@test.com' })
            .end( (err, res) =>
            {
                expect(res).to.have.status(404);
                expect(res.body).to.be.a('object');
                expect(res.body.code).to.equal(404);
                expect(res.body.info).to.be.a('object');
                expect(res.body.info.title).to.be.a('string');
                expect(res.body.info.message).to.be.a('string');
                done();
            });
        });

        it("USER IS PRESENT 200 --> Email is CORRECT", (done) =>
        {
            User.create({ email: 'test@test.com', password: '123456', username: 'username' }, () => {
                requester.put('/fantasta/auth/forgot')
                .send({ email: 'test@test.com' })
                .end( (err, res) =>
                {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object')
                    done();
                });
            })
        });

    });
});
