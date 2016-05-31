'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const MongoClient = require('mongodb').MongoClient;
const should = chai.should();
const algorithm = require('../algorithm/algorithm.js');

chai.use(chaiHttp);

let teacherToken;
let schoolToken;
let teacher2Token;

const pg = require('pg');
let authhost = process.env.AUTHPG_PORT_5432_TCP_ADDR || 'localhost';
let authport = process.env.AUTHPG_PORT_5432_TCP_PORT || 5432;
let profilehost = process.env.PROFILEPG_PORT_5432_TCP_ADDR || 'localhost';
let profileport = process.env.PROFILEPG_PORT_5432_TCP_PORT || 5432;
let interesthost = process.env.INTERESTPG_PORT_5432_TCP_ADDR || 'localhost';
let interestport = process.env.INTERESTPG_PORT_5432_TCP_PORT || 5432;
var matchMongoHost = process.env.MD_PORT_5432_TCP_ADDR || 'localhost';
var matchMongoPort = process.env.MD_PORT_5432_TCP_PORT || 27017;


describe('a user clicks is shown another user\'s profile or profile preview', () => {

  before(done => {
    let authConString = "postgres://" + authhost + ":" + authport + "/Users";
    let profileConString = "postgres://" + profilehost + ":" + profileport + "/Profiles";
    let interestedConString = "postgres://" + interesthost + ":" + interestport + "/Interested";
    pg.connect(authConString, (err, client, pgDone1) => {
      client.query('delete from users', (err, result) => {
        if (err) {
          console.log(err);
        }
        pgDone1();
        pg.connect(profileConString, (err, client, pgDone2) => {
          client.query('delete from profiles', (err, result) => {
            pgDone2();
            pg.connect(interestedConString, (err, client, pgDone3) => {
              client.query('delete from interested', (err, result) => {
                pgDone3();
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
                  .then(res => {
                    teacherToken = res.body.token;
                    return chai.request(server)
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
                        });
                  })
                  .then(res => {
                    return chai.request(server)
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
                  })
                  .then (res => {
                    schoolToken = res.body.token;
                    return chai.request(server)
                        .post('/profile/makematchprofile')
                        .send({
                            token: schoolToken,
                            training: [1],
                            trainingWgt: 1,
                            locTypes: [1],
                            locTypesWgt: 1,
                            orgTypes: [5],
                            orgTypesWgt: 50,
                            sizes: [1],
                            sizesWgt: 1,
                            cals: [1],
                            calsWgt: 1,
                            states: [6],
                            statesWgt: 50,
                            traits: [3, 8, 9, 10, 11, 13, 18],
                            traitsWgt: 100,
                            ageRanges: [2],
                            ageRangesWgt: 1
                        });
                  })
                  .then(res => {
                    return chai.request(server)
                      .post('/auth/signup')
                      .send({
                        email: 'teacher2@test.com',
                        isTeacher: true,
                        password: '1Password!',
                        displayName: 'Testy',
                        lastName: 'Mctestface',
                        description: 'Quis aute iure reprehenderit in voluptate velit esse. Mercedem aut nummos unde unde extricat, amaras. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Ab illo tempore, ab est sed immemorabili. Gallia est omnis divisa in partes tres, quarum.',
                        state: 'CO',
                        avatarUrl: 'http://s3.aws.com/someimage0908234.jpg'
                      });
                  })
                  .then(res => {
                    teacher2Token = res.body.token;
                    return chai.request(server)
                        .post('/profile/makematchprofile')
                        .send({
                            token: teacher2Token,
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
                        });
                  })
                  .then(res => {
                    return chai.request(server)
                      .put('/matches/interest')
                      .send({
                        token: teacherToken,
                        interestedIn: 'school@test.com'
                      })
                  })
                  .then(res => {
                    return chai.request(server)
                      .put('/matches/interest')
                      .send({
                        token: schoolToken,
                        interestedIn: 'teacher@test.com'
                      })
                  })
                  .then(res => {
                    return chai.request(server)
                      .put('/matches/interest')
                      .send({
                        token: teacher2Token,
                        interestedIn: 'school@test.com'
                      })
                  })
                  .then(res => {
                    done();
                  });
              })
            })
          });
        });
      });
    });
  });

  it('should show a limited profile if they are not matched', done => {
    chai.request(server)
      .get('/profile/get?profile=school@test.com&token=' + teacher2Token)
      .end((err, res) => {
        res.status.should.equal(200);
        res.should.be.json;
        res.body.status.should.equal(200);
        res.body.message.should.equal('Here is the profile for school@test.com');
        res.body.profile.should.eql({
          isTeacher: false,
          description: 'Quis aute iure reprehenderit in voluptate velit esse. Mercedem aut nummos unde unde extricat, amaras. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Ab illo tempore, ab est sed immemorabili. Gallia est omnis divisa in partes tres, quarum.',
          state: 'CO',
          avatarUrl: 'http://s3.aws.com/someimage0908234.jpg',
          matchPercent: 0.76
        });
        done();
      });
  });

  it('should show a full profile if they are matched', done => {
    chai.request(server)
      .get('/profile/get?profile=school@test.com&token=' + teacherToken)
      .end((err, res) => {
        res.status.should.equal(200);
        res.should.be.json;
        res.body.status.should.equal(200);
        res.body.message.should.equal('Here is the profile for school@test.com');
        res.body.profile.should.eql({
          email: 'school@test.com',
          isTeacher: false,
          displayName: 'Testy',
          description: 'Quis aute iure reprehenderit in voluptate velit esse. Mercedem aut nummos unde unde extricat, amaras. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Ab illo tempore, ab est sed immemorabili. Gallia est omnis divisa in partes tres, quarum.',
          state: 'CO',
          avatarUrl: 'http://s3.aws.com/someimage0908234.jpg',
          matchPercent: 0.76
        });
        done();
      });
  });

});
