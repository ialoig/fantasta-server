
import { expect, request, should, use } from 'chai'
import chaiHttp from 'chai-http'
import config from 'config'

import { User } from '../../src/database'

const serverUrl = config.serverUrl || "http://localhost:3000";

use(chaiHttp);
should();

describe( "REGISTER", () =>
{
    const requester = request(serverUrl)

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

    xit("Email and password are CORRECT but USER IS PRESENT", (done) =>
    {
        User.create({ email: 'test@test.com', password: '123456' }, () => {
            requester.post('/fantasta/auth/register')
            .send({ email: 'test@test.com', password: '123456' })
            .end( (err, res) =>
            {
                expect(res).to.have.status(500);
                expect(res.body).to.be.a('object');
                expect(res.body.code).to.equal(500);
                expect(res.body.status).to.equal('Internal Server Error');
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
            expect(res.body).to.be.a('object');
            expect(res.body.code).to.equal(200);
            expect(res.body.status).to.equal('OK');
            expect(res.body.data).to.be.a('object').that.is.not.empty;
            expect(res.body.data.user).to.be.a('object').that.is.not.empty;
            expect(res.body.data.token).to.be.a('string');
            done();
        });
    });
});