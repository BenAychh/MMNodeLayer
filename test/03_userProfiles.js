var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');

var should = chai.should();

chai.use(chaiHttp);

beforeEach(function(done) {
    chai.request(server)
        .post('/auth/signup')
        .send({})
});

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
    it('should return an error if the profile does not exist', done => {
        chai.request(server)
            .post('/profiles/update')
            .send({
                email: 'testy@test.com'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Profile does not exist in database');
                done();
            })
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
describe('following another user/adding staff', () => {
    it('should add another user to the profile follow list given correct criteria', done => {
        chai.request(server)
            .post('/profiles/create')
            .send({
                email: 'testy@test.com',
                displayName: 'Testy'
            })
            .end((err, res) => {
                if (!err) {
                    chai.request(server)
                        .post('/profiles/create')
                        .send({
                            email: 'another@email.com',
                            displayName: 'Another'
                        })
                        .end((err, res) => {
                            if (!err) {
                                chai.request(server)
                                    .post('/profiles/follow')
                                    .send({
                                        email: 'testy@test.com',
                                        follow: 'another@email.com'
                                    })
                                    .end((err, res) => {
                                        res.should.have.status(200);
                                        res.should.be.json;
                                        res.body.should.be.a('object');
                                        res.body.status.should.equal(200);
                                        res.body.message.should.equal('another@email.com followed');
                                        done();
                                    })
                            }
                        })
                }
            });
    })
    it('should should return an error if email key is missing', done => {
        chai.request(server)
            .post('/profiles/follow')
            .send({
                follow: 'another@email.com'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Missing email or follow key');
                done();
            })
    })
    it('should return an error if follow key is missing', done => {
        chai.request(server)
            .post('/profiles/follow')
            .send({
                email: 'testy@test.com'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Missing email or follow key');
                done();
            })
    })
    it('should return an error if the email value is not an email', done => {
        chai.request(server)
            .post('/profiles/follow')
            .send({
                email: 'testy@test',
                follow: 'another@email.com'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Both email and follow values must be a valid email');
                done();
            })
    })
    it('should return an error if the follow value is not an email', done => {
        chai.request(server)
            .post('/profiles/follow')
            .send({
                email: 'testy@test.com',
                follow: 'another@email'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Both email and follow values must be a valid email');
                done();
            })
    })
    it('should return an error if email to follow is not in profile database', done => {
        chai.request(server)
            .post('/profiles/create')
            .send({
                email: 'testy@test.com',
                displayName: 'Testy'
            })
            .end((err, res) => {
                if (!err) {
                    chai.request(server)
                        .post('/profiles/follow')
                        .send({
                            email: 'testy@test.com',
                            follow: 'another@email.com'
                        })
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.should.be.json;
                            res.body.should.be.a('object');
                            res.body.status.should.equal(400);
                            res.body.message.should.equal('another@email.com is not a valid user');
                            done();
                        })
                }
            })
    })
    it('should return an error if the email to follow is already in the user profile "follow" array', done => {
        chai.request(server)
            .post('/profiles/create')
            .send({
                email: 'testy@test.com',
                displayName: 'Testy'
            })
            .end((err, res) => {
                if (!err) {
                    chai.request(server)
                        .post('/profiles/create')
                        .send({
                            email: 'another@email.com',
                            displayName: 'Another'
                        })
                        .end((err, res) => {
                            if (!err) {
                                chai.request(server)
                                    .post('/profiles/follow')
                                    .send({
                                        email: 'testy@test.com',
                                        follow: 'another@email.com'
                                    })
                                    .end((err, res) => {
                                        if (!err) {
                                            chai.request(server)
                                                .post('/profiles/follow')
                                                .send({
                                                    email: 'testy@test.com',
                                                    follow: 'another@email.com'
                                                })
                                                .end((err, res) => {
                                                    res.should.have.status(400);
                                                    res.should.be.json;
                                                    res.body.should.be.a('object');
                                                    res.body.status.should.equal(400);
                                                    res.body.message.should.equal('Already following another@email.com');
                                                    done();
                                                })
                                        }

                                    })
                            }
                        })
                }
            });
    })
});
describe('unfollowing another user/removing staff', () => {
    it('should remove a user from the profile follow list given correct criteria', done => {
        chai.request(server)
            .post('/profiles/create')
            .send({
                email: 'testy@test.com',
                displayName: 'Testy'
            })
            .end((err, res) => {
                if (!err) {
                    chai.request(server)
                        .post('/profiles/create')
                        .send({
                            email: 'another@email.com',
                            displayName: 'Another'
                        })
                        .end((err, res) => {
                            if (!err) {
                                chai.request(server)
                                    .post('/profiles/follow')
                                    .send({
                                        email: 'testy@test.com',
                                        follow: 'another@email.com'
                                    })
                                    .end((err, res) => {
                                        if (!err) {
                                            chai.request(server)
                                                .post('/profiles/unfollow')
                                                .send({
                                                    email: 'testy@test.com',
                                                    follow: 'another@email.com'
                                                })
                                                .end((err, res) => {
                                                    res.should.have.status(200);
                                                    res.should.be.json;
                                                    res.body.should.be.a('object');
                                                    res.body.status.should.equal(200);
                                                    res.body.message.should.equal('another@email.com unfollowed');
                                                    done();
                                                })
                                        }

                                    })
                            }
                        })
                }
            });
    })
    it('should should return an error if email key is missing', done => {
        chai.request(server)
            .post('/profiles/unfollow')
            .send({
                unfollow: 'another@email.com'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Missing email or unfollow key');
                done();
            })
    })
    it('should return an error if the email value is not an email', done => {
        chai.request(server)
            .post('/profiles/unfollow')
            .send({
                email: 'testy@test',
                unfollow: 'another@email.com'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Both email and unfollow values must be a valid email');
                done();
            })
    })
    it('should return an error if unfollow key is missing', done => {
        chai.request(server)
            .post('/profiles/unfollow')
            .send({
                email: 'testy@test.com'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Missing email or unfollow key');
                done();
            })
    })
    it('should return an error if the unfollow value is not an email', done => {
        chai.request(server)
            .post('/profiles/unfollow')
            .send({
                email: 'testy@test.com',
                unfollow: 'another@email'
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.should.be.a('object');
                res.body.status.should.equal(400);
                res.body.message.should.equal('Both email and unfollow values must be a valid email');
                done();
            })
    })
    it('should return an error if email to follow is not in the user profile "follow" array', done => {
        chai.request(server)
            .post('/profiles/create')
            .send({
                email: 'testy@test.com',
                displayName: 'Testy'
            })
            .end((err, res) => {
                if (!err) {
                    chai.request(server)
                        .post('/profiles/unfollow')
                        .send({
                            email: 'testy@test.com',
                            follow: 'another@email.com'
                        })
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.should.be.json;
                            res.body.should.be.a('object');
                            res.body.status.should.equal(400);
                            res.body.message.should.equal('another@email.com is not followed');
                            done();
                        })
                }
            })
    })
});