import chai from 'chai';
const { expect, should, use } = chai;
import chaiHttp from 'chai-http'
import config from 'config'
import { User } from '../../src/database/index.js'
import { tokenUtils } from '../../src/utils/index.js'
import { requester } from './index.js'

use(chaiHttp);
should();

describe( "DELETE", () =>
{
    beforeEach((done) => {
        User.deleteMany({}, (err) => {
            User.create({ email: 'test@test.com', password: '123456', username: 'username' }, (err) => {
                done();           
            })
        });
    });

    after(() => {
        requester.close()
    });

    it("Body is undefined", (done) =>
    {
        requester.delete('/fantasta/auth/deleteAccount')
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
        requester.delete('/fantasta/auth/deleteAccount')
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

    it("Password is NULL", (done) =>
    {
        requester.delete('/fantasta/auth/deleteAccount')
        .send({ password: null })
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
        const token = tokenUtils.Create( config.token.kid, 'test@test.com', '123456', 'username' )

        requester.delete('/fantasta/auth/deleteAccount')
        .set('Authorization', token)
        .send({ password: '654321' })
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

    it("Password is CORRECT", (done) =>
    {
        const token = tokenUtils.Create( config.token.kid, 'test@test.com', '123456', 'username' )

        requester.delete('/fantasta/auth/deleteAccount')
        .set('Authorization', token)
        .send({ password: '123456' })
        .end( (err, res) =>
        {
            expect(res).to.have.status(200);
            expect(res.body).to.equal(true);
            done();
        });
    });
});
