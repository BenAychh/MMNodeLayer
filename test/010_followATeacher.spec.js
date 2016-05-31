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

describe('a user updates their profile', () => {

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
                      .post('/auth/signup')
                      .send({
                        email: 'teacher2@test.com',
                        isTeacher: true,
                        password: '1Password!',
                        displayName: 'Testy',
                        description: 'Quis aute iure reprehenderit in voluptate velit esse. Mercedem aut nummos unde unde extricat, amaras. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Ab illo tempore, ab est sed immemorabili. Gallia est omnis divisa in partes tres, quarum.',
                        state: 'CO',
                        avatarUrl: 'http://s3.aws.com/someimage0908234.jpg'
                      })
                      .end((err, res) => {
                        done();
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
    });
  });

  it('should add another teacher user to a teacher user\'s follow array', done => {
    chai.request(server)
      .put('/profile/follow')
      .send({
        token: teacherToken,
        followEmail: 'teacher2@test.com'
      })
      .end((err, res) => {
        res.status.should.equal(200);
        res.should.be.json;
        res.body.status.should.equal(200);
        res.body.message.should.equal('You are now following teacher2@test.com');
        done();
      });
  });

  it('should return an error if the token is missing', done => {
    chai.request(server)
      .put('/profile/follow')
      .send({
        followEmail: 'teacher2@test.com'
      })
      .end((err, res) => {
        res.status.should.equal(401);
        res.should.be.json;
        res.body.status.should.equal(401);
        res.body.message.should.equal('Please log in');
        done();
      });
  });

  it('should return an error if the user is a school', done => {
    chai.request(server)
      .put('/profile/follow')
      .send({
        token: schoolToken,
        followEmail: 'teacher2@test.com'
      })
      .end((err, res) => {
        res.status.should.equal(403);
        res.should.be.json;
        res.body.status.should.equal(403);
        res.body.message.should.equal('Only other teachers may follow teachers');
        done();
      });
  })

  it('should return an error if followEmail is missing', done => {
    chai.request(server)
      .put('/profile/follow')
      .send({
        token: teacherToken
      })
      .end((err, res) => {
        res.status.should.equal(400);
        res.should.be.json;
        res.body.status.should.equal(400);
        res.body.message.should.equal('Please provide the email of the user you want to follow');
        done();
      });
  });

  it('should return an error if followEmail is not an email', done => {
    chai.request(server)
      .put('/profile/follow')
      .send({
        token: teacherToken,
        followEmail: 'teacher2@test'
      })
      .end((err, res) => {
        res.status.should.equal(400);
        res.should.be.json;
        res.body.status.should.equal(400);
        res.body.message.should.equal('Invalid email, check the syntax and try again');
        done();
      });
  });

  it('should return an error if the user to follow is not in the database', done => {
    chai.request(server)
      .put('/profile/follow')
      .send({
        token: teacherToken,
        followEmail: 'teacher3@test.com'
      })
      .end((err, res) => {
        console.log(res.body);
        res.status.should.equal(400);
        res.should.be.json;
        res.body.status.should.equal(400);
        res.body.message.should.equal('teacher3@test.com is not a valid user');
        done();
      });
  });

  //ToDo
  // it('should return an error if the user to follow is deactivated', done => {

  // })

});
