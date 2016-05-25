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
                password: '1Password!',
            })
            .end((err, res) => {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(201);
                req.body.token.should.equal('eyJhbGciOiJIUzUxMiJ9.' +
                    'eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.egbaJ7yWUvC4mU_' +
                    'C7LNJi24cPNpfx3rlr7woWn9pqsGX6LrGCK2Rf2LaD2cFiJ' +
                    '4AWC93QDMChuCmUM4YtDjzAw');
                done();
            });
    });
    it('errors when the email already exists', done => {
        chai.request(server)
            .post('/auth/create')
            .send({
                email: 'test@test.com',
                password: '1Password!',
            })
            .end((err, res) => {
                if (!err) {
                    chai.request(server)
                        .post('/users/create')
                        .send({
                            email: 'test@test.com',
                            password: '1Password!',
                        })
                        .end((err, res) => {
                            res.should.have.status(409);
                            res.should.be.json;
                            res.body.should.be.a('object');
                            res.body.status.should.equal(409);
                            res.body.message.should.equal('Email already exists');
                            res.body.email.should.equal('test@test.com');
                            res.body.password.should.equal('password');
                            done()
                        })
                }
            });
    });
    it('should error if the email field is not filled out', done => {
        chai.request(server)
            .post('/auth/create')
            .send({
                password: '1Password!',
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('You must enter an email');
                res.body.password.should.equal('password');
                done()
            })
    })
    it('should error if the email is malformed', done => {
        chai.request(server)
            .post('/auth/create')
            .send({
                email: 'test@test',
                password: '1Password!',
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(400);
                req.body.message.should.equal('Please enter in a valid email.');
                done();
            });
    })
    it('should error if the password field is not filled out', done => {
        chai.request(server)
            .post('/auth/create')
            .send({
                email: 'test@test.com',
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('You must enter a password');
                res.body.email.should.equal('test@test.com');
                done()
            })
    })
    it('should error if the password does not meet security criteria (>= 8 characters, one uppercase, one lowercase, one number, one special char)', done => {
        chai.request(server)
            .post('/auth/create')
            .send({
                email: 'test@test.com',
                password: '2short'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Passwords must be at least 8 characters and contain at least one uppercase and lowecase letter, one number, and one special character.');
                res.body.email.should.equal('test@test.com');
                res.body.email.should.equal('2short')
            })
    })
});
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
                req.body.token.should.equal('eyJhbGciOiJIUzUxMiJ9.' +
                    'eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.egbaJ7yWUvC4mU_' +
                    'C7LNJi24cPNpfx3rlr7woWn9pqsGX6LrGCK2Rf2LaD2cFiJ' +
                    '4AWC93QDMChuCmUM4YtDjzAw');
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
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(401);
                req.body.message.should.equal('Wrong email or password.');
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
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(401);
                req.body.message.should.equal('Wrong email or password.');
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
                req.body.message.should.equal('The email field cannot be blank.');
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
                req.body.message.should.equal('Please enter in a valid email.');
                done();
            });
    });
    it('should error if the password is missing', done => {
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
                req.body.message.should.equal('The password field cannot be blank.');
                done();
            });
    });
})
describe('can deactivate users.', () => {
    it('can deactive an active user with valid token', done => {
        chai.request(server)
            .post('/auth/deactivate')
            .send({
                token: 'eyJhbGciOiJIUzUxMiJ9.' +
                    'eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.egbaJ7yWUvC4mU_' +
                    'C7LNJi24cPNpfx3rlr7woWn9pqsGX6LrGCK2Rf2LaD2cFiJ' +
                    '4AWC93QDMChuCmUM4YtDjzAw',
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(200);
                req.body.message.should.equal('Account deactivated');
                done();
            });
    });
    it('cannot deactive without a valid token.', done => {
        chai.request(server)
            .post('/auth/deactivate')
            .send({
                token: 'eyJhbGciOiJIUzUxMiJ9.' +
                    'eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.egbaJ7yWUvC4mU_' +
                    'C7LNJi24cPNpfx3rlr7woWn9pqsGX6LrGCK2Rf2LaD2cFiJ' +
                    '4AWC93QDMChuCmUM4YtDjzAw.INVALID',
            })
            .end((err, res) => {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(401);
                req.body.message.should.equal('Invalid token.');
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
                req.body.message.should.equal('Token not sent');
                done();
            });
    });
    it('errors if the user is already deactivated.', done => {
        chai.request(server)
            .post('/auth/deactivate')
            .send({
                token: 'eyJhbGciOiJIUzUxMiJ9.' +
                    'eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.egbaJ7yWUvC4mU_' +
                    'C7LNJi24cPNpfx3rlr7woWn9pqsGX6LrGCK2Rf2LaD2cFiJ' +
                    '4AWC93QDMChuCmUM4YtDjzAw',
            })
            .end((err, res) => {
                res.should.have.status(403);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(403);
                req.body.message.should.equal('Already deactivated');
                done();
            });
    });
});
describe('can activate users.', () => {
    it('can activate an inactive user with valid token', done => {
        chai.request(server)
            .post('/auth/activate')
            .send({
                token: 'eyJhbGciOiJIUzUxMiJ9.' +
                    'eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.egbaJ7yWUvC4mU_' +
                    'C7LNJi24cPNpfx3rlr7woWn9pqsGX6LrGCK2Rf2LaD2cFiJ' +
                    '4AWC93QDMChuCmUM4YtDjzAw',
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(200);
                req.body.message.should.equal('Account activated');
                done();
            });
    });
    it('cannot activate without a valid token.', done => {
        chai.request(server)
            .post('/auth/activate')
            .send({
                token: 'eyJhbGciOiJIUzUxMiJ9.' +
                    'eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.egbaJ7yWUvC4mU_' +
                    'C7LNJi24cPNpfx3rlr7woWn9pqsGX6LrGCK2Rf2LaD2cFiJ' +
                    '4AWC93QDMChuCmUM4YtDjzAw.INVALID',
            })
            .end((err, res) => {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(401);
                req.body.message.should.equal('Invalid token.');
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
                req.body.message.should.equal('Token not sent');
                done();
            });
    });
    it('errors if the user is already activated.', done => {
        chai.request(server)
            .post('/auth/activate')
            .send({
                token: 'eyJhbGciOiJIUzUxMiJ9.' +
                    'eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.egbaJ7yWUvC4mU_' +
                    'C7LNJi24cPNpfx3rlr7woWn9pqsGX6LrGCK2Rf2LaD2cFiJ' +
                    '4AWC93QDMChuCmUM4YtDjzAw',
            })
            .end((err, res) => {
                res.should.have.status(403);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(403);
                req.body.message.should.equal('Already activated');
                done();
            });
    });
});
describe('can change a user\'s password', () => {
    it('can change a user\'s password if they have a valid token', done => {
        chai.request(server)
            .post('/auth/update')
            .send({
                token: 'eyJhbGciOiJIUzUxMiJ9.' +
                    'eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.egbaJ7yWUvC4mU_' +
                    'C7LNJi24cPNpfx3rlr7woWn9pqsGX6LrGCK2Rf2LaD2cFiJ' +
                    '4AWC93QDMChuCmUM4YtDjzAw',
                password: 'newpassword'
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(200);
                req.body.message.should.equal('Password updated.');
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
                token: 'eyJhbGciOiJIUzUxMiJ9.' +
                    'eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.egbaJ7yWUvC4mU_' +
                    'C7LNJi24cPNpfx3rlr7woWn9pqsGX6LrGCK2Rf2LaD2cFiJ' +
                    '4AWC93QDMChuCmUM4YtDjzAw.INVALID',
                password: 'Newpassword1!'
            })
            .end((err, res) => {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(401);
                req.body.message.should.equal('Invalid token.');
                chai.request(server)
                    .post('/auth/login')
                    .send({
                        email: 'test@test.com',
                        password: 'Newpassword1!',
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
                password: 'Newpassword1!'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(400);
                req.body.message.should.equal('Missing token.');
                chai.request(server)
                    .post('/auth/login')
                    .send({
                        email: 'test@test.com',
                        password: 'Newpassword1!',
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
                token: 'eyJhbGciOiJIUzUxMiJ9.' +
                    'eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.egbaJ7yWUvC4mU_' +
                    'C7LNJi24cPNpfx3rlr7woWn9pqsGX6LrGCK2Rf2LaD2cFiJ' +
                    '4AWC93QDMChuCmUM4YtDjzAw',
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(400);
                req.body.message.should.equal('Password field cannot be blank.');
                done();
            });
    });
});
describe('can create a user\'s detailed profile', () => {
   it('should create a profile with all information', done => {
       
   })
   it('should create a profile with just an email and displayName', done => {
       
   })
   it('should return an error if email is missing', done => {
       
   })
   it('should return an error if email is malformed', done => {
       
   })
   it('should return an error if displayName is missing', done => {
       
   })
   it('should return an error if displayName isn\'t a string', done => {
       
   })
   it('should return an error if displayName is greater than 50 characters', done => {
       
   })
   it('should return an error if the user already exists', done => {
       
   })
   it('should return an error if the lastName exists and isn\t a string', done => {
       
   })
   it('should return an error if the lastName exists and is longer than 30 characters', done => {
       
   })
   it('should return an error if the description exists and isn\'t a string', done => {
       
   })
   it('should return an error if the description exists and is longer than 500 characters', done => {
       
   })
   it('should return an error if state exists and is not a string', done => {
       
   })
   it('should return an error if state exists and is longer than two characters', done => {
       
   })
   it('should return an error if the avatar file is not a png or jpg', done => {
       
   })
   it('should return an error if the avatar file is greater than 1MB', done => {
       
   })
});
describe('get user profile', () => {
   it('should get user profile information with valid email', done => {
       
   })
   it('should return error with invalid email', done => {
       
   })
   it('should return error with malformed email', done => {
       
   })
});
describe('updating user profile information', () => {
    
});