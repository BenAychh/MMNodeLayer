'use strict'

const returnedTeacherToken = 'eyJhbGciOiJIUzUxMiJ9.' +
    'eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.egbaJ7yWUvC4mU_' +
    'C7LNJi24cPNpfx3rlr7woWn9pqsGX6LrGCK2Rf2LaD2cFiJ' +
    '4AWC93QDMChuCmUM4YtDjzAw';

const returnedSchoolToken = 'eyJhbGciOiJIUzUxMiJ9.' +
    'eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.egbaJ7yWUvC4mU_' +
    'C7LNJi24cPNpfx3rlr7woWn9pqsGX6LrGCK2Rf2LaD2cFiJ' +
    '4AWC93QDMChuCmUM4YtDjzAw';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

const should = chai.should();

chai.use(chaiHttp);

describe('Logging in', () => {

    before(done => {
        chai.request(server)
            .post('/auth/signup')
            .send({
                email: 'test@test.com',
                isTeacher: 1,
                password: '1Password!',
                displayName: 'Testy',
                lastName: 'Mctestface',
                description: 'Quis aute iure reprehenderit in voluptate velit esse. Mercedem aut nummos unde unde extricat, amaras. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Ab illo tempore, ab est sed immemorabili. Gallia est omnis divisa in partes tres, quarum.',
                state: 'CO',
                avatarUrl: 'http://s3.aws.com/someimage0908234.jpg'
            })
            .end((err, res) => {
                done();
            })
    });

    it('should log in a user with correct username and password.', done => {
        chai.request(server)
            .post('/auth/login')
            .send({
                email: 'test@test.com',
                password: '1Password!',
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(200);
                req.body.token.should.equal(returnedTeachertoken);
                done();
            });
    });

    it('should error if the email is incorrect.', done => {
        chai.request(server)
            .post('/auth/login')
            .send({
                email: 'test1@test.com',
                password: '1Password!',
            })
            .end((err, res) => {
                res.should.have.status(403);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(403);
                req.body.message.should.equal('Wrong email or password.');
                done();
            });
    });

    it('should error if the password is incorrect.', done => {
        chai.request(server)
            .post('/auth/login')
            .send({
                email: 'test@test.com',
                password: 'Password1!',
            })
            .end((err, res) => {
                res.should.have.status(403);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(403);
                req.body.message.should.equal('Wrong email or password.');
                done();
            });
    });

    it('should error if the email is missing', done => {
        chai.request(server)
            .post('/auth/login')
            .send({
                password: '1Password!',
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(400);
                req.body.message.should.equal('The email field cannot be blank.');
                done();
            });
    });

    it('should error if the email is malformed', done => {
        chai.request(server)
            .post('/auth/login')
            .send({
                email: 'test@test',
                password: '1Password!',
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(400);
                req.body.message.should.equal('Please enter in a valid email.');
                done();
            });
    });

    it('should error if the password is missing', done => {
        chai.request(server)
            .post('/auth/login')
            .send({
                email: 'test@test'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(400);
                req.body.message.should.equal('The password field cannot be blank.');
                done();
            });
    });
})