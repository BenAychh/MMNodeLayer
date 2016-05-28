var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');

var should = chai.should();

chai.use(chaiHttp);

describe('updating user profile information', () => {
    it('should update profile information when valid updates are passed', done => {
        chai.request(server)
            .post('/profiles/create')
            .send({
                email: 'testy@test.com',
                displayName: 'Testy',
                lastName: 'Mctestface',
                description: 'Quis aute iure reprehenderit in voluptate velit esse. Mercedem aut nummos unde unde extricat, amaras. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Ab illo tempore, ab est sed immemorabili. Gallia est omnis divisa in partes tres, quarum.',
                state: 'CO',
                avatarUrl: 'http://s3.aws.com/someimage0908234.jpg'
            })
            .end((err, res) => {
                if (!err) {
                    chai.request(server)
                        .post('/profiles/update')
                        .send({
                            email: 'testy@test.com',
                            displayName: 'Testy',
                            lastName: 'Mctesterson',
                            description: 'Gallia est omnis divisa in partes tres, quarum.',
                            state: 'CO',
                            avatarUrl: 'http://s3.aws.com/someimage0908234.jpg'
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.should.be.json;
                            res.body.should.be.a('object');
                            res.body.status.should.equal(200);
                            res.body.message.should.equal('Profile updated');
                            done();
                        })
                }
            });
    })

    it('should return an error if the email is malformed', done => {
        chai.request(server)
            .post('/profiles/update')
            .send({
                email: 'testy@test',
                displayName: 'Testy',
                lastName: 'Mctestface',
                description: 'Quis aute iure reprehenderit in voluptate velit esse. Mercedem aut nummos unde unde extricat, amaras. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Ab illo tempore, ab est sed immemorabili. Gallia est omnis divisa in partes tres, quarum.',
                state: 'CO',
                avatarUrl: 'http://s3.aws.com/someimage0908234.jpg'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please provide a valid email');
                done();
            })
    })
    it('should return an error with a missing email', done => {
        chai.request(server)
            .post('/profiles/update')
            .send({
                displayName: 'Testy',
                lastName: 'Mctestface',
                description: 'Quis aute iure reprehenderit in voluptate velit esse. Mercedem aut nummos unde unde extricat, amaras. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Ab illo tempore, ab est sed immemorabili. Gallia est omnis divisa in partes tres, quarum.',
                state: 'CO',
                avatarUrl: 'http://s3.aws.com/someimage0908234.jpg'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please provide an email');
                done();
            })
    })
    it('should return an error if displayName is not a string', done => {
        chai.request(server)
            .post('/profiles/update')
            .send({
                email: 'testy@test.com',
                displayName: 1000,
                lastName: 'Mctestface',
                description: 'Quis aute iure reprehenderit in voluptate velit esse. Mercedem aut nummos unde unde extricat, amaras. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Ab illo tempore, ab est sed immemorabili. Gallia est omnis divisa in partes tres, quarum.',
                state: 'CO',
                avatarUrl: 'http://s3.aws.com/someimage0908234.jpg'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please provide a display name that is text less than 50 characters');
                done();
            })
    })
    it('should return an error if displayName is greater than 50 characters', done => {
        chai.request(server)
            .post('/profiles/update')
            .send({
                email: 'testy@test.com',
                displayName: 'Ab illo tempore, ab est sed immemorabili. Nihilne te nocturnum praesidium Palati, nihil urbis vigiliae. Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Qui ipsorum lingua Celtae, nostra Galli appellantur.',
                lastName: 'Mctestface',
                description: 'Quis aute iure reprehenderit in voluptate velit esse. Mercedem aut nummos unde unde extricat, amaras. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Ab illo tempore, ab est sed immemorabili. Gallia est omnis divisa in partes tres, quarum.',
                state: 'CO',
                avatarUrl: 'http://s3.aws.com/someimage0908234.jpg'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please provide a display name that is text less than 50 characters');
                done();
            })
    })
    it('should return an error if the lastName is not a string', done => {
        chai.request(server)
            .post('/profiles/update')
            .send({
                email: 'testy@test.com',
                displayName: 'Testy',
                lastName: 1000,
                description: 'Quis aute iure reprehenderit in voluptate velit esse. Mercedem aut nummos unde unde extricat, amaras. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Ab illo tempore, ab est sed immemorabili. Gallia est omnis divisa in partes tres, quarum.',
                state: 'CO',
                avatarUrl: 'http://s3.aws.com/someimage0908234.jpg'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please provide a display name that is text less than 50 characters');
                done();
            })
    })
    it('should return an error if the lastName is longer than 30 characters', done => {
        chai.request(server)
            .post('/profiles/update')
            .send({
                email: 'testy@test.com',
                displayName: 'Testy',
                lastName: 'Quis aute iure reprehenderit in voluptate velit esse. Mercedem aut nummos unde unde extricat, amaras.',
                description: 'Quis aute iure reprehenderit in voluptate velit esse. Mercedem aut nummos unde unde extricat, amaras. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Ab illo tempore, ab est sed immemorabili. Gallia est omnis divisa in partes tres, quarum.',
                state: 'CO',
                avatarUrl: 'http://s3.aws.com/someimage0908234.jpg'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please provide a display name that is text less than 50 characters');
                done();
            })
    })
    it('should return an error if the description is not a string', done => {
        chai.request(server)
            .post('/profiles/update')
            .send({
                email: 'testy@test.com',
                displayName: 'Testy',
                lastName: 'McTesterson',
                description: 'Quis aute iure reprehenderit in voluptate velit esse. Mercedem aut nummos unde unde extricat, amaras. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Ab illo tempore, ab est sed immemorabili. Gallia est omnis divisa in partes tres, quarum.',
                state: 'CO',
                avatarUrl: 'http://s3.aws.com/someimage0908234.jpg'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please provide a description that is text and less than 500 characters');
                done();
            })
    })
    it('should return an error if the description is longer than 500 characters', done => {
        chai.request(server)
            .post('/profiles/update')
            .send({
                email: 'testy@test.com',
                displayName: 'Testy',
                lastName: 'McTesterson',
                description: 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus. Mercedem aut nummos unde unde extricat, amaras. Quam diu etiam furor iste tuus nos eludet? Prima luce, cum quibus mons aliud consensu ab eo. Quis aute iure reprehenderit in voluptate velit esse. Phasellus laoreet lorem vel dolor tempus vehicula. Ullamco laboris nisi ut aliquid ex ea commodi consequat. Salutantibus vitae elit libero, a pharetra augue. Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Praeterea iter est quasdam res quas ex communi. Curabitur est gravida et libero vitae dictum. Contra legem facit qui id facit quod lex prohibet. Plura mihi bona sunt, inclinet, amari petere vellent. Quisque ut dolor gravida, placerat libero vel, euismod. Quid securi etiam tamquam eu fugiat nulla pariatur. A communi observantia non est recedendum. Non equidem invideo, miror magis posuere velit aliquet. Quae vero auctorem tractata ab fiducia dicuntur. Nec dubitamus multa iter quae et nos invenerat. Hi omnes lingua, institutis, legibus inter se differunt. Etiam habebis sem dicantur magna mollis euismod. Quam temere in vitiis, legem sancimus haerentia. Idque Caesaris facere voluntate liceret: sese habere. Ab illo tempore, ab est sed immemorabili. Paullum deliquit, ponderibus modulisque suis ratio utitur. Cras mattis iudicium purus sit amet fermentum.',
                state: 'CO',
                avatarUrl: 'http://s3.aws.com/someimage0908234.jpg'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please provide a description that is text and less than 500 characters');
                done();
            })
    })
    it('should return an error if state is not a string', done => {
        chai.request(server)
            .post('/profiles/update')
            .send({
                email: 'testy@test.com',
                displayName: 'Testy',
                lastName: 'Mctestface',
                description: 'Quis aute iure reprehenderit in voluptate velit esse. Mercedem aut nummos unde unde extricat, amaras. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Ab illo tempore, ab est sed immemorabili. Gallia est omnis divisa in partes tres, quarum.',
                state: 1000,
                avatarUrl: 'http://s3.aws.com/someimage0908234.jpg'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please enter a two-letter state abbreviation');
                done();
            })
    })
    it('should return an error if state is longer than two characters', done => {
        chai.request(server)
            .post('/profiles/update')
            .send({
                email: 'testy@test.com',
                displayName: 'Testy',
                lastName: 'Mctestface',
                description: 'Quis aute iure reprehenderit in voluptate velit esse. Mercedem aut nummos unde unde extricat, amaras. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Ab illo tempore, ab est sed immemorabili. Gallia est omnis divisa in partes tres, quarum.',
                state: 'Colorado',
                avatarUrl: 'http://s3.aws.com/someimage0908234.jpg'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please enter a two-letter state abbreviation');
                done();
            })
    })
});


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