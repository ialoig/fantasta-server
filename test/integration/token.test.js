
import "regenerator-runtime/runtime.js"
import { expect, should, use } from 'chai'
import chaiHttp from 'chai-http'
import config from 'config'

import { User } from '../../src/database'
import { tokenUtils } from '../../src/utils'
import { requester } from './index'

use(chaiHttp);
should();

// describe( "TOKEN", () =>
describe( "TOKEN", function()
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

    it("Token is NULL", (done) =>
    {
        requester.put('/fantasta/auth/token')
        .set('Authorization', null)
        .end( (err, res) =>
        {
            expect(res).to.have.status(400);
            expect(res.body).to.be.a('object');
            expect(res.body.code).to.equal(400);
            expect(res.body.info).to.be.a('object');
            expect(res.body.info.title).to.be.a('string');
            expect(res.body.info.message).to.be.a('string');
            done();
        });
    });

    it("Token is NOT CORRECT", (done) =>
    {
        let token = "wejhjksdhgkjlhdjkgrsdfjhkhsjkfdfghjkdfdghjkjfkg"
        
        requester.put('/fantasta/auth/token')
        .set('Authorization', token)
        .end( (err, res) =>
        {
            expect(res).to.have.status(400);
            expect(res.body).to.be.a('object');
            expect(res.body.code).to.equal(400);
            expect(res.body.info).to.be.a('object');
            expect(res.body.info.title).to.be.a('string');
            expect(res.body.info.message).to.be.a('string');
            done();
        });
    });

    it("Token is CORRECT but USER NOT PRESENT", (done) =>
    {
        let token = tokenUtils.Create( config.token.kid, 'test@test.com', '123456', 'username' )
        User.deleteMany({}, (err) => {
            requester.put('/fantasta/auth/token')
            .set('Authorization', token)
            .end( (err, res) =>
            {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.code).to.equal(400);
                expect(res.body.info).to.be.a('object');
                expect(res.body.info.title).to.be.a('string');
                expect(res.body.info.message).to.be.a('string');
                done();
            });         
        });
    });

    it("USER IS PRESENT --> Name and password are CORRECT", (done) =>
    {
        requester.post('/fantasta/auth/register')
        .send({ email: 'test@test.com', password: '123456' })
        .end( (err, res) => {

            requester.put('/fantasta/auth/token')
            .set('Authorization', res.body.data.token)
            .end( (err, res) =>
            {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.code).to.equal(200);
                expect(res.body.data).to.be.a('object').that.is.not.empty;
                expect(res.body.data.user).to.be.a('object').that.is.not.empty;
                expect(res.body.data.token).to.be.a('string');
                done();
            });         
        });
    });

    it("USER IS PRESENT --> Name is CORRECT and password is INCORRECT", (done) =>
    {
        requester.post('/fantasta/auth/register')
        .send({ email: 'test@test.com', password: '123456' })
        .end( (err, res) => {
            
            let token = tokenUtils.Create( config.token.kid, 'test@test.com', '654321', 'test@test.com' )

            requester.put('/fantasta/auth/token')
            .send({ token: token })
            .end( (err, res) =>
            {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.code).to.equal(400);
                expect(res.body.info).to.be.a('object');
                expect(res.body.info.title).to.be.a('string');
                expect(res.body.info.message).to.be.a('string');
                done();
            });         
        });
    });
});