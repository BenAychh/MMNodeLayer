var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');

var should = chai.should();

chai.use(chaiHttp);


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
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(400);
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
                req.body.message.should.equal('User password updated.');
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
                res.should.have.status(403);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(403);
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