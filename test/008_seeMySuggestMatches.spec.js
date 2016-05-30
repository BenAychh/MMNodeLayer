'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const pg = require('pg');
const should = chai.should();

chai.use(chaiHttp);

var teacherToken;

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

describe('a user makes a request to see their suggested maches', () => {

    it('should return an array of the user\'s suggested matches', done => {
        chai.request(server)
            .get('/matches/suggested?token=' + teacherToken)
            .end((err, res) => {
              console.log(res.body);
                res.status.should.equal(200);
                res.should.be.json;
                res.body.status.should.equal(200);
                res.body.message.should.equal('Returning suggested matches');
                res.body.suggestedMatches.should.eql([]);
                done();
            });
    });

    it('should return an error if the token is missing', done => {
       chai.request(server)
       .get('/matches/suggested')
       .end((err, res) => {
           res.status.should.equal(401);
           res.should.be.json;
           res.body.status.should.equal(401);
           res.body.message.should.equal('Please log in');
           done();
       })
    });

});
