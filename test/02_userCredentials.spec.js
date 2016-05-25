var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');

var should = chai.should();

chai.use(chaiHttp);

describe('User creation', function() {
    it('can create a non-existing user', done => {
        chai.request(server)
        .post('/users/create')
        .send({
          email: 'test@test.com',
          password: 'test@test.com',
        })
        .end((err, res) => {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.status.should.equal(201);
            req.body.token.should.equal("eyJhbGciOiJIUzUxMiJ9." +
              "eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.egbaJ7yWUvC4mU_" +
              "C7LNJi24cPNpfx3rlr7woWn9pqsGX6LrGCK2Rf2LaD2cFiJ" +
              "4AWC93QDMChuCmUM4YtDjzAw");
            done();
        });
    });
    it('errors when the email already exists', done => {
      chai.request(server)
        .post('/users/create')
        .send({
          email: 'test@test.com',
          password: 'test@test.com',
        })
        .end((err, res) => {
          if (!err) {
            chai.request(server)
              .post('/users/create')
              .send({
                .send({
                  email: 'test@test.com',
                  password: 'test@test.com',
                })
              })
              .end((err, res) => {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(409);
                res.body.message.should.equal("Email already exists");
                done()
              })
          }
        })
    })
});
