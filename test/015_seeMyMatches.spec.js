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
                                    chai.request(server)
                                        .put('/matches/interest')
                                        .send({
                                            token: teacherToken,
                                            interestEmail: 'school@test.com'
                                        })
                                        .end((err, res) => {
                                            chai.request(server)
                                                .put('/matches/interest')
                                                .send({
                                                    token: schoolToken,
                                                    interestEmail: 'teacher@test.com'
                                                })
                                                .end((err, res) => {
                                                    done();
                                                });

                                        });
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

describe('a user makes a request to see the list of their matches', () => {

    it('should return the list given a valid token', done => {
        chai.request(server)
            .get('/matches/getmatches/?token=' + teacherToken)
            .end((err, res) => {
                res.status.should.equal(200);
                res.should.be.json;
                res.body.status.should.equal(200);
                res.body.message.should.equal('Here are your matches');
                res.body.list.should.eql(['school@test.com']);
                done();
            });
    });

    it('should return an error given an invalid token', done => {
        chai.request(server)
            .get('/matches/getinterest/?token=gobbledygook')
            .end((err, res) => {
                res.status.should.equal(401);
                res.should.be.json;
                res.body.status.should.equal(401);
                res.body.message.should.equal('Please log in');
                done();
            });
    });

});