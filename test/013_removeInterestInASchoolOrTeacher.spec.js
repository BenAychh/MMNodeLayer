'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

const should = chai.should();

chai.use(chaiHttp);

let teacherToken;
let schoolToken;

const pg = require('pg');
let authhost = process.env.AUTHPG_PORT_5432_TCP_ADDR || 'localhost';
let authport = process.env.AUTHPG_PORT_5432_TCP_PORT || 5432;
let interesthost = process.env.INTERESTPG_PORT_5432_TCP_ADDR || 'localhost';
let interestport = process.env.INTERESTPG_PORT_5432_TCP_PORT || 5432;
let followHost = process.env.PROFILEPG_PORT_5432_TCP_ADDR || 'localhost';
let followPort = process.env.PROFILEPG_PORT_5432_TCP_PORT || 5432;

before(function(done) {
    let authConString = "postgres://" + authhost + ":" + authport + "/Users";
    let interestedConString = "postgres://" + interesthost + ":" + interestport + "/Interested";
    let followConString = "postgres://" + followHost + ":" + followPort + "/Profiles";
    pg.connect(authConString, (err, client, pgDone1) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('delete from users', (err, result) => {
            pgDone1();
            pg.connect(followConString, (err, client, pgDone2) => {
                if (err) {
                    return console.error('error fetching client from pool', err);
                }
                client.query('delete from interested', (err, result) => {
                    pgDone2();
                    chai.request(server)
                        .post('/auth/signup')
                        .send({
                            email: 'teacher@test.com',
                            isTeacher: true,
                            password: '1Password!',
                            displayName: 'Testy',
                            lastName: 'Mctestface',
                            description: 'Quis aute iure reprehenderit in voluptate velit esse. Mercedem aut nummos unde unde extricat, amaras. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Ab illo tempore, ab est sed immemorabili. Gallia est omnis divisa in partes tres, quarum.',
                            state: 'CO',
                            avatarUrl: 'http://s3.aws.com/someimage0908234.jpg'
                        })
                        .end((err, res) => {
                            teacherToken = res.body.token;
                            chai.request(server)
                                .post('/auth/signup')
                                .send({
                                    email: 'school@test.com',
                                    isTeacher: false,
                                    password: '1Password!',
                                    displayName: 'Testy',
                                    description: 'Quis aute iure reprehenderit in voluptate velit esse. Mercedem aut nummos unde unde extricat, amaras. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Ab illo tempore, ab est sed immemorabili. Gallia est omnis divisa in partes tres, quarum.',
                                    state: 'CO',
                                    avatarUrl: 'http://s3.aws.com/someimage0908234.jpg'
                                })
                                .end((err, res) => {
                                    schoolToken = res.body.token;
                                    done();
                                });
                        });
                });
                if (err) {
                    return console.error('error running query', err);
                }
            });
        });
        if (err) {
            return console.error('error running query', err);
        }
    });
});

describe('a user removes interest in another user of a different type', () => {

    it('should remove a school from a teacher\'s interested array when the teacher makes request', done => {
        chai.request(server)
            .put('/matches/interest')
            .send({
                token: teacherToken,
                interestEmail: 'school@test.com'
            })
            .end((err, res) => {
                chai.request(server)
                    .put('/matches/uninterest')
                    .send({
                        token: teacherToken,
                        uninterestEmail: 'school@test.com'
                    })
                    .end((err, res) => {
                        res.status.should.equal(200);
                        res.should.be.json;
                        res.body.status.should.equal(200);
                        res.body.message.should.equal('You have removed your interest in school@test.com');
                        done();
                    });
            });
    });

    it('should remove each from the other\'s match array if they are already matched', done => {
        chai.request(server)
            .put('/matches/interest')
            .send({
                token: schoolToken,
                interestEmail: 'teacher@test.com'
            })
            .end((err, res) => {
                chai.request(server)
                    .put('/matches/interest')
                    .send({
                        token: teacherToken,
                        interestEmail: 'school@test.com'
                    })
                    .end((err, res) => {
                        chai.request(server)
                            .put('/matches/uninterest')
                            .send({
                                token: teacherToken,
                                uninterestEmail: 'school@test.com'
                            })
                            .end((err, res) => {
                                res.status.should.equal(200);
                                res.should.be.json;
                                res.body.status.should.equal(200);
                                res.body.message.should.equal('You are no longer a match with school@test.com');
                                done();
                            })
                    });
            });
    });

    // ToDo in microservice
    xit('should return an error if the user is not interested in the other user', done => {

    });

    it('should return an error if the token is missing', done => {
        chai.request(server)
            .put('/matches/uninterest')
            .send({
                uninterestEmail: 'school@test.com'
            })
            .end((err, res) => {
                res.status.should.equal(401);
                res.should.be.json;
                res.body.status.should.equal(401);
                res.body.message.should.equal('Please log in');
                done();
            });
    });

    it('should return an error if the uninterestEmail is missing', done => {
        chai.request(server)
            .put('/matches/uninterest')
            .send({
                token: teacherToken
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please include the email of the user you are removing interest in');
                done();
            });
    });

    it('should return an error if the uninterestEmail is not an email', done => {
        chai.request(server)
            .put('/matches/uninterest')
            .send({
                token: teacherToken,
                interestEmail: 'school@test'
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please include the email of the user you are removing interest in');
                done();
            });
    });

});