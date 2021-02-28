import "regenerator-runtime/runtime.js"
import { expect, should, use } from 'chai'
import chaiHttp from 'chai-http'
import { User } from '../../src/database'
import { requester } from './index'

use(chaiHttp);
should();

// describe( "LOGIN", () =>
describe( "LOGIN", function()
{
    this.timeout(0) // disable test environment timeout

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
            requester.put('/fantasta/auth/login')
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
            requester.put('/fantasta/auth/login')
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
            requester.put('/fantasta/auth/login')
            .send({ email: null, password: '123456' })
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
            requester.put('/fantasta/auth/login')
            .send({ email: 'asdgsdfgdsfg', password: '123456' })
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

        it("Password is NULL", (done) =>
        {
            requester.put('/fantasta/auth/login')
            .send({ email: 'test@test.com', password: null })
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

        it("Password is NOT CORRECT", (done) =>
        {
            requester.put('/fantasta/auth/login')
            .send({ email: 'test@test.com', password: '3452' })
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

        it("Email and password are CORRECT but USER NOT PRESENT", (done) =>
        {
            requester.put('/fantasta/auth/login')
            .send({ email: 'test@test.com', password: '123456' })
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

        it("USER IS PRESENT --> Email is CORRECT and password is INCORRECT", (done) =>
        {
            User.create({ email: 'test@test.com', password: '123456' }, () => {
                requester.put('/fantasta/auth/login')
                .send({ email: 'test@test.com', password: '654321' })
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
        });

        it("USER IS PRESENT 200 --> Email and password are CORRECT", (done) =>
        {
            User.create({ email: 'test@test.com', password: '123456', username: 'username' }, () => {
                requester.put('/fantasta/auth/login')
                .send({ email: 'test@test.com', password: '123456' })
                .end( (err, res) =>
                {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body.code).to.equal(200);
                    expect(res.body.status).to.equal('OK');
                    expect(res.body.data).to.be.a('object').that.is.not.empty;
                    expect(res.body.data.user).to.be.a('object').that.is.not.empty;
                    expect(res.body.data.token).to.be.a('string');
                    done();
                });
            })
        });

    });
});