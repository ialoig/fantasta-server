
import { expect, should, use } from 'chai'
import chaiHttp from 'chai-http'
import { User } from '../../src/database/index.js'
import { requester } from './index.js'

use(chaiHttp);
should();

describe( "REGISTER", () =>
{
    beforeEach((done) => {
        User.deleteMany({}, (err) => {
           done();           
        });        
    });

    after(() => {
        requester.close()
    });

    it("Body is undefined", (done) =>
    {
        requester.post('/fantasta/auth/register')
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
        requester.post('/fantasta/auth/register')
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
        requester.post('/fantasta/auth/register')
        .send({ email: null, passowrd: '123456' })
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
        requester.post('/fantasta/auth/register')
        .send({ email: 'blabla', passowrd: '123456' })
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
        requester.post('/fantasta/auth/register')
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
        requester.post('/fantasta/auth/register')
        .send({ email: 'test@test.com', password: '226' })
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

    it("Email and password are CORRECT but USER IS PRESENT", (done) =>
    {
        requester.post('/fantasta/auth/register')
        .send({ email: 'test@test.com', password: '123456' })
        .end( (err, res) =>
        {
            requester.post('/fantasta/auth/register')
            .send({ email: 'test@test.com', password: '123456' })
            .end( (err, res) =>
            {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.code).to.equal(602);
                expect(res.body.status).to.equal('User present');
                expect(res.body.info).to.be.a('object');
                expect(res.body.info.title).to.be.a('string');
                expect(res.body.info.message).to.be.a('string');
                done();
            });
        });
    });

    it("REGISTRATION OK --> Email and password are CORRECT", (done) =>
    {
        requester.post('/fantasta/auth/register')
        .send({ email: 'test@test.com', password: '123456' })
        .end( (err, res) =>
        {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('object').that.is.not.empty;
            expect(res.body.user).to.be.a('object').that.is.not.empty;
            expect(res.body.token).to.be.a('string');
            done();
        });
    });
});
