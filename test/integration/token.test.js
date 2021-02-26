
import { expect, request, should, use } from 'chai'
import chaiHttp from 'chai-http'
import config from 'config'

import { User } from '../../src/database'

const serverUrl = config.serverUrl || "http://localhost:3000";

use(chaiHttp);
should();

xdescribe( "TOKEN", () =>
{
    const requester = request(serverUrl)
    
    beforeEach((done) => {
        User.remove({}, (err) => {
           done();           
        });        
    });

    after(() => {
        requester.close()
    })

    it("Token is NOT CORRECT", (done) =>
    {
        let token = "wejhjksdhgkjlhdjkgrsdfjhkhsjkfdfghjkdfdghjkjfkg"
        
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

    it("Token is CORRECT but USER NOT PRESENT", (done) =>
    {
        let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViN2FiZWRkMWY4YWJkNTJjZDJlZjhjMiIsIm5hbWUiOiJpbmt1YnVzIiwicGFzc3dvcmQiOiJpbmt1YnVzIiwidXVpZCI6W1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1siY2lhbyJdXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXSwiaWF0IjoxNTM1MzgwOTE1LCJleHAiOjQyMTM3ODA5MTV9.Q9Ug5K0FfU8DW1wvPOzFbJNH0052POU-wYjQhT523es"
        
        requester.put('/fantasta/auth/token')
        .send({ token: token })
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

    it("USER IS PRESENT --> Name and password are CORRECT", (done) =>
    {
        let newUser = new User({ name: '123', password: '123', admin: false, created_at: new Date(), updated_at: new Date() });

        newUser.save((err, user) => {
            requester.put('/fantasta/auth/token')
            .send({ name: '123', password: '123' })
            .end( (err, res) =>
            {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.code).to.equal(200);
                expect(res.body.status).to.equal('OK');
                expect(res.body.data).to.be.a('object').that.is.not.empty;
                expect(res.body.token).to.be.a('string');
                done();
            });
        });
    });

    it("USER IS PRESENT --> Name is CORRECT and password is INCORRECT", (done) =>
    {
        let newUser = new User({ name: '123', password: '123', admin: false, created_at: new Date(), updated_at: new Date() });

        newUser.save((err, user) => {
            requester.put('/fantasta/auth/token')
            .send({ name: '123', password: '321' })
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
});