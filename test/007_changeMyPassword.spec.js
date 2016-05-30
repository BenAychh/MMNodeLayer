'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

const should = chai.should();

chai.use(chaiHttp);


let teacherToken;
let schoolToken;
var authhost = process.env.AUTHPG_PORT_5432_TCP_ADDR || 'localhost';
var authport = process.env.AUTHPG_PORT_5432_TCP_PORT || 5432;
var profilehost = process.env.PROFILEPG_PORT_5432_TCP_ADDR || 'localhost';
var profileport = process.env.PROFILEPG_PORT_5432_TCP_PORT || 5432;
const pg = require('pg');

beforeEach(function(done) {
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
                  done();
              });
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

describe('a user updates their password', () => {

    it('should update a user password when passed full information', done => {
        chai.request(server)
            .put('/auth/changepassword')
            .send({
                token: teacherToken,
                oldPassword: '1Password!',
                newPassword: '2Password!'
            })
            .end((err, res) => {
              console.log(res.body);
                res.status.should.equal(200);
                res.should.be.json;
                res.body.status.should.equal(200);
                res.body.message.should.equal('Password changed for teacher@test.com')
                done();
            });
    });

    it('should return an error if token is missing', done => {
        chai.request(server)
            .put('/auth/changepassword')
            .send({
                oldPassword: '1Password!',
                newPassword: '2Password!'
            })
            .end((err, res) => {
                res.status.should.equal(401);
                res.should.be.json;
                res.body.status.should.equal(401);
                res.body.message.should.equal('Please log in');
                done();
            })
    });

    it('should return an error if old password is wrong', done => {
        chai.request(server)
            .put('/auth/changepassword')
            .send({
                token: teacherToken,
                oldPassword: 'WrongPassword1!',
                newPassword: '2Password!'
            })
            .end((err, res) => {
                res.status.should.equal(401);
                res.should.be.json;
                res.body.status.should.equal(401);
                res.body.message.should.equal('Old password incorrect');
                done();
            });
    });

    it('should return an error if old password is missing', done => {
        chai.request(server)
            .put('/auth/changepassword')
            .send({
                token: teacherToken,
                newPassword: '2Password!'
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please enter your old passwords');
                done();
            });
    });

    it('should return an error if new password is missing', done => {
        chai.request(server)
            .put('/auth/changepassword')
            .send({
                token: teacherToken,
                oldPassword: '1Password!'
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please enter your new passwords');
                done();
            });
    });
});
