'use strict'

const returnedTeacherToken = 'eyJhbGciOiJIUzUxMiJ9.' +
    'eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.egbaJ7yWUvC4mU_' +
    'C7LNJi24cPNpfx3rlr7woWn9pqsGX6LrGCK2Rf2LaD2cFiJ' +
    '4AWC93QDMChuCmUM4YtDjzAw';

const returnedSchoolToken = 'eyJhbGciOiJIUzUxMiJ9.' +
    'eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIn0.egbaJ7yWUvC4mU_' +
    'C7LNJi24cPNpfx3rlr7woWn9pqsGX6LrGCK2Rf2LaD2cFiJ' +
    '4AWC93QDMChuCmUM4YtDjzAw';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

const should = chai.should();

chai.use(chaiHttp);

describe('a user submits the sign up form', () => {
    it('should create a teacher user with all profile information included', done => {
        chai.request(server)
            .post('/auth/signup')
            .send({
                email: 'test@test.com',
                isTeacher: 1,
                password: '1Password!',
                displayName: 'Testy',
                lastName: 'Mctestface',
                description: 'Quis aute iure reprehenderit in voluptate velit esse. Mercedem aut nummos unde unde extricat, amaras. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Ab illo tempore, ab est sed immemorabili. Gallia est omnis divisa in partes tres, quarum.',
                state: 'CO',
                avatarUrl: 'http://s3.aws.com/someimage0908234.jpg'
            })
            .end((err, res) => {
                res.status.should.equal(200);
                res.should.be.json;
                res.body.status.should.equal(200);
                res.body.message.should.equal('Account created for test@test.com');
                res.body.token.should.equal(returnedTeacherToken);
            });
    });

    it('should create a school user with all the profile information included', done => {
        chai.request(server)
            .post('/auth/signup')
            .send({
                email: 'test@test.com',
                isTeacher: 0,
                password: '1Password!',
                displayName: 'Testy',
                description: 'Quis aute iure reprehenderit in voluptate velit esse. Mercedem aut nummos unde unde extricat, amaras. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Ab illo tempore, ab est sed immemorabili. Gallia est omnis divisa in partes tres, quarum.',
                state: 'CO',
                avatarUrl: 'http://s3.aws.com/someimage0908234.jpg'
            })
            .end((err, res) => {
                res.status.should.equal(200);
                res.should.be.json;
                res.body.status.should.equal(200);
                res.body.message.should.equal('Account created for test@test.com');
                res.body.token.should.equal(returnedSchoolToken);
            });
    });

    it('should return an error if a school user has a last name', done => {
        chai.request(server)
            .post('/auth/signup')
            .send({
                email: 'test@test.com',
                isTeacher: 0,
                password: '1Password!',
                displayName: 'Testy',
                lastName: 'McTesterson',
                description: 'Quis aute iure reprehenderit in voluptate velit esse. Mercedem aut nummos unde unde extricat, amaras. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Ab illo tempore, ab est sed immemorabili. Gallia est omnis divisa in partes tres, quarum.',
                state: 'CO',
                avatarUrl: 'http://s3.aws.com/someimage0908234.jpg'
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Schools may not have a last name');
                res.body.token.should.equal(returnedSchoolToken);
            });
    });

    it('should create a teacher user with only email, displayName, password and isTeacher status', done => {
        chai.request(server)
            .post('/auth/signup')
            .send({
                email: 'test@test.com',
                isTeacher: 1,
                password: '1Password!',
                displayName: 'Testy'
            })
            .end((err, res) => {
                res.status.should.equal(200);
                res.should.be.json;
                res.body.status.should.equal(200);
                res.body.message.should.equal('Account created for test@test.com');
                res.body.token.should.equal(returnedTeacherToken);
            });
    });

    it('should create a school user with only email, displayName, password and isTeacher status', done => {
        chai.request(server)
            .post('/auth/signup')
            .send({
                email: 'test@test.com',
                isTeacher: 0,
                password: '1Password!',
                displayName: 'Testy'
            })
            .end((err, res) => {
                res.status.should.equal(200);
                res.should.be.json;
                res.body.status.should.equal(200);
                res.body.message.should.equal('Account created for test@test.com');
                res.body.token.should.equal(returnedSchoolToken);
            });
    });

    it('should return an error when the email is already in the database', done => {
        chai.request(server)
            .post('/auth/signup')
            .send({
                email: 'test@test.com',
                isTeacher: 1,
                password: '1Password!',
                displayName: 'Testy'
            })
            .end((err, res) => {
                if (!err) {
                    chai.request(server)
                        .post('/auth/signup')
                        .send({
                            email: 'test@test.com',
                            isTeacher: 1,
                            password: '1Password!',
                            displayName: 'Testy'
                        })
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.should.be.json;
                            res.body.should.be.a('object');
                            res.body.status.should.equal(400);
                            res.body.message.should.equal('User already exists');
                            res.body.email.should.equal('test@test.com');
                            res.body.password.should.equal('password');
                            done();
                        })
                }
            });
    });

    it('should return an error if the email field is not filled out', done => {
        chai.request(server)
            .post('/auth/signup')
            .send({
                isTeacher: 1,
                password: '1Password!',
                displayName: 'Testy'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please enter enter an email');
                res.body.password.should.equal('1Password!');
                done();
            })
    });

    it('should return an error if the email is malformed', done => {
        chai.request(server)
            .post('/auth/signup')
            .send({
                email: 'test@test',
                isTeacher: 1,
                password: '1Password!',
                displayName: 'Testy'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(400);
                req.body.message.should.equal('Please enter a valid email.');
                done();
            });
    });

    it('should return an error if the password field is not filled out', done => {
        chai.request(server)
            .post('/auth/signup')
            .send({
                email: 'test@test',
                isTeacher: 1,
                displayName: 'Testy'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please enter a password');
                res.body.email.should.equal('test@test.com');
                done()
            })
    });

    it('should return an error if the isTeacher status is not present in request', done => {
        chai.request(server)
            .post('/auth/signup')
            .send({
                email: 'test@test',
                password: '1Password!',
                displayName: 'Testy'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please enter a password');
                res.body.email.should.equal('test@test.com');
                done()
            })
    })

    it('should return an error if the password does not meet security criteria (>= 8 characters, one uppercase, one lowercase, one number, one special char)', done => {
        chai.request(server)
            .post('/auth/signup')
            .send({
                email: 'test@test.com',
                password: '2short',
                isTeacher: 1,
                displayName: 'Testy'
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
    });

    it('should return an error if displayName is missing', done => {
        chai.request(server)
            .post('/auth/signup')
            .send({
                email: 'testy@test.com',
                isTeacher: 1,
                password: '1Password!'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Missing email or display name for creation');
                done();
            })
    });

    it('should return an error if displayName isn\'t a string', done => {
        chai.request(server)
            .post('/auth/signup')
            .send({
                email: 'testy@test.com',
                displayName: 1000,
                isTeacher: 1,
                password: '1Password!'
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
            .post('/auth/signup')
            .send({
                email: 'testy@test.com',
                displayName: 'Ab illo tempore, ab est sed immemorabili. Nihilne te nocturnum praesidium Palati, nihil urbis vigiliae. Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Qui ipsorum lingua Celtae, nostra Galli appellantur.',
                isTeacher: 1,
                password: '1Password!'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please provide a display name that is text less than 50 characters');
                done();
            })
    });

    it('should return an error if the lastName exists and isn\t a string', done => {
        chai.request(server)
            .post('/auth/signup')
            .send({
                email: 'testy@test.com',
                displayName: 'Testy',
                isTeacher: 1,
                password: '1Password!',
                lastName: 1000
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please enter a last name that is text and less than 30 characters');
                done();
            });
    });

    it('should return an error if the lastName exists and is longer than 30 characters', done => {
        chai.request(server)
            .post('/auth/signup')
            .send({
                email: 'testy@test.com',
                displayName: 'Testy',
                isTeacher: 1,
                password: '1Password!',
                lastName: 'Quis aute iure reprehenderit in voluptate velit esse. Mercedem aut nummos unde unde extricat, amaras. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Ab illo tempore, ab est sed immemorabili. Gallia est omnis divisa in'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please enter a last name that is text and less than 30 characters');
                done();
            });
    });

    it('should return an error if the description exists and isn\'t a string', done => {
        chai.request(server)
            .post('/auth/signup')
            .send({
                email: 'testy@test.com',
                displayName: 'Testy',
                isTeacher: 1,
                password: '1Password!',
                description: 1000
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please enter a description that is text and less than 500 characters');
                done();
            });
    });

    it('should return an error if the description exists and is longer than 500 characters', done => {
        chai.request(server)
            .post('/auth/signup')
            .send({
                email: 'testy@test.com',
                displayName: 'Testy',
                isTeacher: 1,
                password: '1Password!',
                description: 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus. Mercedem aut nummos unde unde extricat, amaras. Quam diu etiam furor iste tuus nos eludet? Prima luce, cum quibus mons aliud consensu ab eo. Quis aute iure reprehenderit in voluptate velit esse. Phasellus laoreet lorem vel dolor tempus vehicula. Ullamco laboris nisi ut aliquid ex ea commodi consequat. Salutantibus vitae elit libero, a pharetra augue. Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Praeterea iter est quasdam res quas ex communi. Curabitur est gravida et libero vitae dictum. Contra legem facit qui id facit quod lex prohibet. Plura mihi bona sunt, inclinet, amari petere vellent. Quisque ut dolor gravida, placerat libero vel, euismod. Quid securi etiam tamquam eu fugiat nulla pariatur. A communi observantia non est recedendum. Non equidem invideo, miror magis posuere velit aliquet. Quae vero auctorem tractata ab fiducia dicuntur. Nec dubitamus multa iter quae et nos invenerat. Hi omnes lingua, institutis, legibus inter se differunt. Etiam habebis sem dicantur magna mollis euismod. Quam temere in vitiis, legem sancimus haerentia. Idque Caesaris facere voluntate liceret: sese habere. Ab illo tempore, ab est sed immemorabili. Paullum deliquit, ponderibus modulisque suis ratio utitur. Cras mattis iudicium purus sit amet fermentum.'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please enter a description that is text and less than 500 characters');
                done();
            });
    });

    it('should return an error if state exists and is not a string', done => {
        chai.request(server)
            .post('/auth/signup')
            .send({
                email: 'testy@test.com',
                displayName: 'Testy',
                isTeacher: 1,
                password: '1Password!',
                state: 1000
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please enter a two-letter state abbreviation');
                done();
            });
    });

    it('should return an error if state exists and is longer than two characters', done => {
        chai.request(server)
            .post('/auth/signup')
            .send({
                email: 'testy@test.com',
                displayName: 'Testy',
                isTeacher: 1,
                password: '1Password!',
                state: 'Colorado'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please enter a two-letter state abbreviation');
                done();
            });
    });

    it('should return an error if the avatarUrl is not a full (protocol, domain, URI) valid URL', done => {
        chai.request(server)
            .post('/auth/signup')
            .send({
                email: 'testy@test.com',
                displayName: 'Testy',
                isTeacher: 1,
                password: '1Password!',
                avatarUrl: 'ww.funky/alksdjf'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please enter a valid url for your profile image');
                done();
            });
    });
});