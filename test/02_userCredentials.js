var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');

var should = chai.should();

chai.use(chaiHttp);

describe('User creation', () => {
  it('can create a non-existing user', done => {
    chai.request(server)
    .post('/auth/create')
    .send({
      email: 'test@test.com',
      password: 'password',
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
    .post('/auth/create')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .end((err, res) => {
      if (!err) {
        chai.request(server)
        .post('/users/create')
        .send({
          email: 'test@test.com',
          password: 'password1',
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.status.should.equal(409);
          res.body.message.should.equal("Email already exists");
          res.body.email.should.equal("test@test.com");
          res.body.password.should.equal("password");
          done()
        })
      }
    });
  });
  it('should error if the email field is not filled out', done => {
    chai.request(server)
    .post('/auth/create')
    .send({
      password: 'password',
    })
    .end((err, res) => {
      res.should.have.status(201);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.status.should.equal(400);
      res.body.message.should.equal("You must enter an email");
      res.body.password.should.equal("password");
      done()
    })
  })
  it('should error if the password field is not filled out', done => {
    chai.request(server)
    .post('/auth/create')
    .send({
      email: 'test@test.com',
    })
    .end((err, res) => {
      res.should.have.status(201);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.status.should.equal(400);
      res.body.message.should.equal("You must enter an email");
      res.body.password.should.equal("password");
      done()
    })
  })
});
describe("Logging in", () => {
  it('should log in a user with correct username and password.', done => {
    chai.request(server)
    .post('/auth/login')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.status.should.equal(200);
      req.body.token.should.equal("eyJhbGciOiJIUzUxMiJ9." +
        "eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.egbaJ7yWUvC4mU_" +
        "C7LNJi24cPNpfx3rlr7woWn9pqsGX6LrGCK2Rf2LaD2cFiJ" +
        "4AWC93QDMChuCmUM4YtDjzAw");
      done();
    });
  });
  it("should error if the email is incorrect.", done => {
    chai.request(server)
    .post('/auth/login')
    .send({
      email: 'test1@test.com',
      password: 'password',
    })
    .end((err, res) => {
      res.should.have.status(401);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.status.should.equal(401);
      req.body.message.should.equal("Wrong email or password.");
      done();
    });
  });
  it("should error if the password is incorrect.", done => {
    chai.request(server)
    .post('/auth/login')
    .send({
      email: 'test@test.com',
      password: 'wrongpassword',
    })
    .end((err, res) => {
      res.should.have.status(401);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.status.should.equal(401);
      req.body.message.should.equal("Wrong email or password.");
      done();
    });
  });
  it("should error if the email is missing", done => {
    chai.request(server)
    .post('/auth/login')
    .send({
      password: 'password',
    })
    .end((err, res) => {
      res.should.have.status(400);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.status.should.equal(400);
      req.body.message.should.equal("The email field cannot be blank.");
      done();
    });
  });
  it("should error if the email is malformed", done => {
    chai.request(server)
    .post('/auth/login')
    .send({
      email: 'test@test',
      password: 'password',
    })
    .end((err, res) => {
      res.should.have.status(400);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.status.should.equal(400);
      req.body.message.should.equal("Please enter in a valid email.");
      done();
    });
  });
  it("should error if the password is missing", done => {
    chai.request(server)
    .post('/auth/login')
    .send({
      email: 'test@test'
    })
    .end((err, res) => {
      res.should.have.status(400);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.status.should.equal(400);
      req.body.message.should.equal("The password field cannot be blank.");
      done();
    });
  });
})
describe('can deactivate users.', () => {
  it('can deactive an active user with valid token', done => {
    chai.request(server)
    .post('/auth/deactivate')
    .send({
      token: "eyJhbGciOiJIUzUxMiJ9." +
        "eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.egbaJ7yWUvC4mU_" +
        "C7LNJi24cPNpfx3rlr7woWn9pqsGX6LrGCK2Rf2LaD2cFiJ" +
        "4AWC93QDMChuCmUM4YtDjzAw",
    })
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.status.should.equal(200);
      req.body.message.should.equal("Account deactivated");
      done();
    });
  });
  it('cannot deactive without a valid token.', done => {
    chai.request(server)
    .post('/auth/deactivate')
    .send({
      token: "eyJhbGciOiJIUzUxMiJ9." +
        "eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.egbaJ7yWUvC4mU_" +
        "C7LNJi24cPNpfx3rlr7woWn9pqsGX6LrGCK2Rf2LaD2cFiJ" +
        "4AWC93QDMChuCmUM4YtDjzAw.INVALID",
    })
    .end((err, res) => {
      res.should.have.status(401);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.status.should.equal(401);
      req.body.message.should.equal("Invalid token.");
      done();
    });
  });
  it('errors if a token is not sent.', done => {
    chai.request(server)
    .post('/auth/deactivate')
    .end((err, res) => {
      res.should.have.status(400);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.status.should.equal(400);
      req.body.message.should.equal("Token not sent");
      done();
    });
  });
  it('errors if the user is already deactivated.', done => {
    chai.request(server)
    .post('/auth/deactivate')
    .send({
      token: "eyJhbGciOiJIUzUxMiJ9." +
        "eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.egbaJ7yWUvC4mU_" +
        "C7LNJi24cPNpfx3rlr7woWn9pqsGX6LrGCK2Rf2LaD2cFiJ" +
        "4AWC93QDMChuCmUM4YtDjzAw",
    })
    .end((err, res) => {
      res.should.have.status(403);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.status.should.equal(403);
      req.body.message.should.equal("Already deactivated");
      done();
    });
  });
});
describe('can activate users.', () => {
  it('can activate an inactive user with valid token', done => {
    chai.request(server)
    .post('/auth/activate')
    .send({
      token: "eyJhbGciOiJIUzUxMiJ9." +
        "eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.egbaJ7yWUvC4mU_" +
        "C7LNJi24cPNpfx3rlr7woWn9pqsGX6LrGCK2Rf2LaD2cFiJ" +
        "4AWC93QDMChuCmUM4YtDjzAw",
    })
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.status.should.equal(200);
      req.body.message.should.equal("Account activated");
      done();
    });
  });
  it('cannot activate without a valid token.', done => {
    chai.request(server)
    .post('/auth/activate')
    .send({
      token: "eyJhbGciOiJIUzUxMiJ9." +
        "eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.egbaJ7yWUvC4mU_" +
        "C7LNJi24cPNpfx3rlr7woWn9pqsGX6LrGCK2Rf2LaD2cFiJ" +
        "4AWC93QDMChuCmUM4YtDjzAw.INVALID",
    })
    .end((err, res) => {
      res.should.have.status(401);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.status.should.equal(401);
      req.body.message.should.equal("Invalid token.");
      done();
    });
  });
  it('errors if a token is not sent.', done => {
    chai.request(server)
    .post('/auth/activate')
    .end((err, res) => {
      res.should.have.status(400);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.status.should.equal(400);
      req.body.message.should.equal("Token not sent");
      done();
    });
  });
  it('errors if the user is already activated.', done => {
    chai.request(server)
    .post('/auth/activate')
    .send({
      token: "eyJhbGciOiJIUzUxMiJ9." +
        "eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.egbaJ7yWUvC4mU_" +
        "C7LNJi24cPNpfx3rlr7woWn9pqsGX6LrGCK2Rf2LaD2cFiJ" +
        "4AWC93QDMChuCmUM4YtDjzAw",
    })
    .end((err, res) => {
      res.should.have.status(403);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.status.should.equal(403);
      req.body.message.should.equal("Already activated");
      done();
    });
  });
});
describe('can change a user\'s password', () => {
  it('can change a user\'s password if they have a valid token', done => {
    chai.request(server)
    .post('/auth/update')
    .send({
      token: "eyJhbGciOiJIUzUxMiJ9." +
        "eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.egbaJ7yWUvC4mU_" +
        "C7LNJi24cPNpfx3rlr7woWn9pqsGX6LrGCK2Rf2LaD2cFiJ" +
        "4AWC93QDMChuCmUM4YtDjzAw",
      password: 'newpassword'
    })
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.status.should.equal(200);
      req.body.message.should.equal("Password updated.");
      chai.request(server)
      .post('/auth/login')
      .send({
        email: 'test@test.com',
        password: 'newpassword',
      })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
    });
  })
  it('cannot change a user\'s password if they have an invalid token', done => {
    chai.request(server)
    .post('/auth/update')
    .send({
      token: "eyJhbGciOiJIUzUxMiJ9." +
        "eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.egbaJ7yWUvC4mU_" +
        "C7LNJi24cPNpfx3rlr7woWn9pqsGX6LrGCK2Rf2LaD2cFiJ" +
        "4AWC93QDMChuCmUM4YtDjzAw.INVALID",
      password: 'newpassword1'
    })
    .end((err, res) => {
      res.should.have.status(401);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.status.should.equal(401);
      req.body.message.should.equal("Invalid token.");
      chai.request(server)
      .post('/auth/login')
      .send({
        email: 'test@test.com',
        password: 'newpassword1',
      })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
    });
  });
  it('errors if the token is missing', done => {
    chai.request(server)
    .post('/auth/update')
    .send({
      password: 'newpassword1'
    })
    .end((err, res) => {
      res.should.have.status(400);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.status.should.equal(400);
      req.body.message.should.equal("Missing token.");
      chai.request(server)
      .post('/auth/login')
      .send({
        email: 'test@test.com',
        password: 'newpassword1',
      })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
    });
  });
  it('errors if the password is missing', done => {
    chai.request(server)
    .post('/auth/update')
    .send({
      token: "eyJhbGciOiJIUzUxMiJ9." +
        "eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.egbaJ7yWUvC4mU_" +
        "C7LNJi24cPNpfx3rlr7woWn9pqsGX6LrGCK2Rf2LaD2cFiJ" +
        "4AWC93QDMChuCmUM4YtDjzAw",
    })
    .end((err, res) => {
      res.should.have.status(400);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.status.should.equal(400);
      req.body.message.should.equal("Password field cannot be blank.");
      done();
    });
  });
});
