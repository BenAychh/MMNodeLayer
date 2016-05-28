'use strict'

var returnedTeacherToken = 'eyJhbGciOiJIUzUxMiJ9.eyJpc1RlYWNoZXIiOnRy' +
    'dWUsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSJ9.POqUvMScZPvEoYCPtMSUURUkPwswm' +
    'cO75C6FAy9QkZHw9eYAU19ROzv_tjlggDjDA9YeVAgpKGjNpCMqkU1UHA';

const returnedSchoolToken = 'eyJhbGciOiJIUzUxMiJ9.eyJpc1RlYWNoZXIiOmZhb' +
    'HNlLCJlbWFpbCI6InRlc3RAdGVzdC5jb20ifQ.ILYZYC_GhG7T2eoMO0hPFh8R-dBY' +
    'QyhT6J4wWPD1fW5QHnp6vdFeo8IPRVmWUR-iPmE-Tqa4FlpeNV1fQNylSw';

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
before(function(done) {
  let authConString = "postgres://" + authhost + ":" + authport + "/Users";
  let profileConString = "postgres://" + profilehost + ":" + profileport + "/Profiles";
  pg.connect(authConString, (err, client, pgDone1) => {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('delete from users', (err, result) => {
      pgDone1();
      pg.connect(profileConString, (err, client, pgDone2) => {
        if(err) {
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
                  done();
              })
          if(err) {
            return console.error('error running query', err);
          }
        });
      });
      if(err) {
        return console.error('error running query', err);
      }
    });
  });
})

describe('Logging in', () => {

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
                res.body.token.should.equal(returnedTeacherToken);
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
                res.body.message.should.equal('Wrong email or password');
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
                res.body.message.should.equal('Wrong email or password');
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
                res.body.message.should.equal('Please enter an email');
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
                res.body.message.should.equal('Please enter a valid email');
                done();
            });
    });

    it('should error if the password is missing', done => {
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
