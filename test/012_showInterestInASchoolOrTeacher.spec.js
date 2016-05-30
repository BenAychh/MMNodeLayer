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
let profilehost = process.env.PROFILEPG_PORT_5432_TCP_ADDR || 'localhost';
let profileport = process.env.PROFILEPG_PORT_5432_TCP_PORT || 5432;
let interesthost = process.env.INTERESTPG_PORT_5432_TCP_ADDR || 'localhost';
let interestport = process.env.INTERESTPG_PORT_5432_TCP_PORT || 5432;

beforeEach(function(done) {
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
            })
          })
        });
      });
    });
  });
});

describe('a user shows interest in another user of a different type', () => {

  it('should add a school to a teacher\'s interested array when the teacher makes request', done => {
    chai.request(server)
      .put('/matches/interest')
      .send({
        token: teacherToken,
        interestedIn: 'school@test.com'
      })
      .end((err, res) => {
        res.status.should.equal(200);
        res.should.be.json;
        res.body.status.should.equal(200);
        res.body.message.should.equal('You have shown interest in school@test.com');
        done();
      });
  });

  it('should add a teacher to a school\'s interested array when the teacher makes request', done => {
    chai.request(server)
      .put('/matches/interest')
      .send({
        token: schoolToken,
        interestedIn: 'teacher@test.com'
      })
      .end((err, res) => {
        res.status.should.equal(200);
        res.should.be.json;
        res.body.status.should.equal(200);
        res.body.message.should.equal('You have shown interest in teacher@test.com');
        done();
      });
  });

  it('should add each to the other\'s match array if the school is already interested', done => {
    chai.request(server)
      .put('/matches/interest')
      .send({
        token: schoolToken,
        interestedIn: 'teacher@test.com'
      })
      .end((err, res) => {
        chai.request(server)
          .put('/matches/interest')
          .send({
            token: teacherToken,
            interestedIn: 'school@test.com'
          })
          .end((err, res) => {
            console.log(res.body);
            res.status.should.equal(200);
            res.should.be.json;
            res.body.status.should.equal(200);
            res.body.message.should.equal('school@test.com is interested in you, you are a match!');
            done();
          });
      });
  });



  it('should add each to the other\'s match array if the teacher is already interested', done => {
    chai.request(server)
      .put('/matches/interest')
      .send({
        token: teacherToken,
        interestedIn: 'school@test.com'
      })
      .end((err, res) => {
        chai.request(server)
          .put('/matches/interest')
          .send({
            token: schoolToken,
            interestedIn: 'teacher@test.com'
          })
          .end((err, res) => {
            res.status.should.equal(200);
            res.should.be.json;
            res.body.status.should.equal(200);
            res.body.message.should.equal('teacher@test.com is interested in you, you are a match!');
            done();
          });
      });
  });

  // ToDo in microservice
  xit('should return an error if a teacher shows interest in another teacher', done => {
    chai.request(server)
      .put('/matches/interest')
      .send({
        token: teacherToken,
        interestedIn: 'teacher@test.com'
      })
      .end((err, res) => {
        res.status.should.equal(400);
        res.should.be.json;
        res.body.status.should.equal(400);
        res.body.message.should.equal('Teachers can only show interest in schools');
        done();
      });
  });

  // ToDo in microservice
  xit('should return an error if a school shows interest in another school', done => {
    chai.request(server)
      .put('/matches/interest')
      .send({
        token: schoolToken,
        interestedIn: 'school@test.com'
      })
      .end((err, res) => {
        res.status.should.equal(400);
        res.should.be.json;
        res.body.status.should.equal(400);
        res.body.message.should.equal('School can only show interest in teachers');
        done();
      });
  });

  it('should return an error if the token is missing', done => {
    chai.request(server)
      .put('/matches/interest')
      .send({
        interestedIn: 'school@test.com'
      })
      .end((err, res) => {
        res.status.should.equal(401);
        res.should.be.json;
        res.body.status.should.equal(401);
        res.body.message.should.equal('Please log in');
        done();
      });
  });

  it('should return an error if the interestedIn is missing', done => {
    chai.request(server)
      .put('/matches/interest')
      .send({
        token: teacherToken
      })
      .end((err, res) => {
        res.status.should.equal(400);
        res.should.be.json;
        res.body.status.should.equal(400);
        res.body.message.should.equal('Please include the email of the user you are interested in');
        done();
      });
  });

  it('should return an error if the interestEmail is not an email', done => {
    chai.request(server)
      .put('/matches/interest')
      .send({
        token: teacherToken,
        interestedIn: 'school@test'
      })
      .end((err, res) => {
        res.status.should.equal(400);
        res.should.be.json;
        res.body.status.should.equal(400);
        res.body.message.should.equal('Invalid email, check the syntax and try again');
        done();
      });
  });

});
