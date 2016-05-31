'use strict'

const pg = require('pg');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

const should = chai.should();

chai.use(chaiHttp);

let teacherToken;

var authhost = process.env.AUTHPG_PORT_5432_TCP_ADDR || 'localhost';
var authport = process.env.AUTHPG_PORT_5432_TCP_PORT || 5432;
var profilehost = process.env.PROFILEPG_PORT_5432_TCP_ADDR || 'localhost';
var profileport = process.env.PROFILEPG_PORT_5432_TCP_PORT || 5432;

describe('get user profile', () => {

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

    it('should get user profile information with valid email', done => {
        chai.request(server)
            .get('/profile/get?token=' + teacherToken)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(200);
                res.body.message.should.equal('Returning profile');
                res.body.should.have.property('profile');
                res.body.profile.should.be.a('object');
                res.body.profile.email.should.equal('test@test.com');
                res.body.profile.displayName.should.equal('Testy');
                res.body.profile.lastName.should.equal('Mctestface');
                res.body.profile.description.should.equal('Quis aute iure reprehenderit in voluptate velit esse. Mercedem aut nummos unde unde extricat, amaras. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Ab illo tempore, ab est sed immemorabili. Gallia est omnis divisa in partes tres, quarum.');
                res.body.profile.state.should.equal('CO');
                res.body.profile.avatarUrl.should.equal('http://s3.aws.com/someimage0908234.jpg');
                done();
            });
    });

    it('should return error if the user does not exist', done => {
        chai.request(server)
            .get('/profile/get?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRvZXNub3RleGlzdEB0ZXN0LmNvbSIsImlzVGVhY2hlciI6InRydWUiLCJpYXQiOjE0NjQ1NzQ2MDF9.3tCXvqnMca4HBZ9DhiT1Pppv2E3swOO6b8COJoErBPw')
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Profile does not exist in database');
                done();
            })
    });

    it('should return error with no token', done => {
        chai.request(server)
            .get('/profile/get?token=')
            .end((err, res) => {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(401);
                res.body.message.should.equal('Please log in');
                done();
            })
    })
});
