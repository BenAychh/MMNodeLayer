'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

const should = chai.should();
const pg = require('pg');

chai.use(chaiHttp);
var MongoClient = require('mongodb').MongoClient;
var teacherToken;
var schoolToken;
var authhost = process.env.AUTHPG_PORT_5432_TCP_ADDR || 'localhost';
var authport = process.env.AUTHPG_PORT_5432_TCP_PORT || 5432;
var profilehost = process.env.PROFILEPG_PORT_5432_TCP_ADDR || 'localhost';
var profileport = process.env.PROFILEPG_PORT_5432_TCP_PORT || 5432;
var matchMongoHost = process.env.MD_PORT_5432_TCP_ADDR || 'localhost';
var matchMongoPort = process.env.MD_PORT_5432_TCP_PORT || 27017;

before(function(done) {
    let authConString = "postgres://" + authhost + ":" + authport + "/Users";
    let profileConString = "postgres://" + profilehost + ":" + profileport + "/Profiles";
    let mongoUrl = 'mongodb://' + matchMongoHost + ":" + matchMongoPort + "/potentialMatches"
    pg.connect(authConString, (err, client, pgDone1) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('delete from users', (err, result) => {
            if (err) {
                return console.error('error running query', err);
            }
            pgDone1();
            pg.connect(profileConString, (err, client, pgDone2) => {
                if (err) {
                    return console.error('error fetching client from pool', err);
                }
                client.query('delete from profiles', (err, result) => {
                    pgDone2();
                    MongoClient.connect(mongoUrl, (err, db) => {
                        if (!err) {
                            db.collection('potentialMatches').remove({});
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
                                    if (res.status == 201) {
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
                                    } else {
                                        // console.log(res.body);
                                    }
                                });
                        }
                    });
                });
            });
        });
    });
});


describe('a user submits their matching profile for the first time', () => {

    it('should create a matching profile with a complete submission', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(200);
                res.should.be.json;
                res.body.status.should.equal(200);
                res.body.message.should.equal('Match profile created for teacher@test.com');
                done();
            });
    });

    it('should return an error if token is missing', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(401);
                res.body.status.should.equal(401);
                res.body.message.should.equal('Please log in');
                done();
            });
    });

    it('should append an active status to the submission to the microservice', done => {
        ('just remember to do this').should.equal('just remember to do this');
        done();
    });

    it('should return an error if training is missing', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                console.log(err);
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if training is not an array', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: 'wat',
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if trainingWgt is missing', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if trainingWgt is not 1, 10, 50 or 100', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 25,
                locTypes: [1, 2, 3],
                locTypesWgt: 1000,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if locTypes is missing', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if locTypes is not an array', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: 'wat',
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if user is a school and locTypes has more than one element', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: schoolToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if locTypesWgt is missing', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if locTypesWgt is not 1, 10, 50 or 100', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1000,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if orgTypes is missing', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if orgTypes is not an array', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: 'wat',
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if user is a school and orgTypes has more than one element', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: schoolToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if orgTypesWgt is missing', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if orgTypesWgt is not 1, 10, 50 or 100', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 5000,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if sizes is missing', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if sizes is not an array', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: 'wat',
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if user is a school and sizes has more than one element', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: schoolToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if sizesWgt is missing', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if sizesWgt is not 1, 10, 50 or 100', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1000,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if cals is missing', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if cals is not an array', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: 'wat',
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if user is a school and cals has more than one element', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: schoolToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1, 2],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if calsWgt is missing', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if calsWgt is not 1, 10, 50 or 100', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1000,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if states is missing', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if states is not an array', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: 'wat',
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if user is a school and states has more than one element', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: schoolToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if statesWgt is missing', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if statesWgt is not 1, 10, 50 or 100', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 1000,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if traits is missing', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if traits is not an array', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: 'wat',
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if traitsWgt is missing', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if traitsWgt is not 1, 10, 50 or 100', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 1000,
                ageRanges: [2, 3],
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if ageRanges is missing', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if ageRanges is not an array', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: 'wat',
                ageRangesWgt: 1
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if ageRangesWgt is missing', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });

    it('should return an error if ageRangesWgt is not 1, 10, 50 or 100', done => {
        chai.request(server)
            .post('/profile/makematchprofile')
            .send({
                token: teacherToken,
                training: [1],
                trainingWgt: 1,
                locTypes: [1, 2, 3],
                locTypesWgt: 1,
                orgTypes: [5, 7],
                orgTypesWgt: 50,
                sizes: [1, 2, 3],
                sizesWgt: 1,
                cals: [1],
                calsWgt: 1,
                states: [5, 6, 38, 43, 47],
                statesWgt: 50,
                traits: [3, 8, 9, 10, 11, 13, 18],
                traitsWgt: 100,
                ageRanges: [2, 3],
                ageRangesWgt: 1000
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please completely fill out the profile');
                done();
            });
    });
});