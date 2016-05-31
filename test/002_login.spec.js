'use strict'

var teacherToken;
const returnedSchoolToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpc1RlYWNoZXIiOiJmYWxzZSIsImlhdCI6MTQ2NDQ4MDQ0NH0.mqRJ63CLMtHW2lVuwkI7_WrDdTrbzK3_BHR_5onhxj4';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const pg = require('pg');

const should = chai.should();

chai.use(chaiHttp);
var authhost = process.env.AUTHPG_PORT_5432_TCP_ADDR || 'localhost';
var authport = process.env.AUTHPG_PORT_5432_TCP_PORT || 5432;
var profilehost = process.env.PROFILEPG_PORT_5432_TCP_ADDR || 'localhost';
var profileport = process.env.PROFILEPG_PORT_5432_TCP_PORT || 5432;


describe('Logging in', () => {
  beforeEach(function(done) {
    let authConString = "postgres://" + authhost + ":" + authport + "/Users";
    let profileConString = "postgres://" + profilehost + ":" + profileport + "/Profiles";
    pg.connect(authConString, (err, client, pgDone1) => {
      if (err) {
        return console.error('error fetching client from pool', err);
      }
      client.query('delete from users', (err, result) => {
        pgDone1();
        pg.connect(profileConString, (err, client, pgDone2) => {
          if (err) {
            return console.error('error fetching client from pool', err);
          }
          client.query('delete from profiles', (err, result) => {
            pgDone2();
            chai.request(server)
              .post('/auth/signup')
              .send({
                email: 'test@test.com',
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
                done();
              })
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
  })

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
        // Token changes based on issue date.
        // res.body.token.should.equal(teacherToken);
        done();
      });
  });

  xit('should error if the email is incorrect.', done => {
    chai.request(server)
      .post('/auth/login')
      .send({
        email: 'test1@test.com',
        password: '1Password!',
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.status.should.equal(401);
        res.body.message.should.equal('Wrong email or password');
        done();
      });
  });

  xit('should error if the password is incorrect.', done => {
    chai.request(server)
      .post('/auth/login')
      .send({
        email: 'test@test.com',
        password: 'Password1!',
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.status.should.equal(401);
        res.body.message.should.equal('Wrong email or password');
        done();
      });
  });

  xit('should error if the email is missing', done => {
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
        res.body.message.should.equal('Please enter an email');
        done();
      });
  });

  xit('should error if the email is malformed', done => {
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
        res.body.message.should.equal('Please enter a valid email');
        done();
      });
  });

  xit('should error if the password is missing', done => {
    chai.request(server)
      .post('/auth/login')
      .send({
        email: 'test@test.com'
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.status.should.equal(400);
        res.body.message.should.equal('Please enter a password');
        done();
      });
  });
})
