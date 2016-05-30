'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

const should = chai.should();

chai.use(chaiHttp);

let teacherToken;
let schoolToken;

describe('a user updates their profile', () => {

    before(done => {
        chai.request(server)
            .post('/auth/signup')
            .send({
                email: 'teacher@test.com',
                isTeacher: 1,
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
                        isTeacher: 0,
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
                                isTeacher: 1,
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
            });
    });

    it('should add another teacher user to a teacher user\'s follow array', done => {
        chai.request(server)
            .put('/matches/follow')
            .send({
                token: teacherToken,
                followEmail: 'teacher2@test.com'
            })
            .end((err, res) => {
                res.status.should.equal(200);
                res.should.be.json;
                res.body.status.should.equal(200);
                res.body.message.should.equal('You are now following teacher2@test.com');
            });
    });

    it('should return an error if the token is missing', done => {
        chai.request(server)
            .put('/matches/follow')
            .send({
                followEmail: 'teacher2@test.com'
            })
            .end((err, res) => {
                res.status.should.equal(403);
                res.should.be.json;
                res.body.status.should.equal(403);
                res.body.message.should.equal('Please log in');
            });
    });

    it('should return an error if the user is a school', done => {
        chai.request(server)
            .put('/matches/follow')
            .send({
                token: schoolToken,
                followEmail: 'teacher2@test.com'
            })
            .end((err, res) => {
                res.status.should.equal(403);
                res.should.be.json;chrome
                res.body.status.should.equal(403);
                res.body.message.should.equal('Only other teachers may follow teachers');
            });
    })

    it('should return an error if followEmail is missing', done => {
        chai.request(server)
            .put('/matches/follow')
            .send({
                token: teacherToken
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please provide the email of the user you want to follow');
            });
    });

    it('should return an error if followEmail is not an email', done => {
        chai.request(server)
            .put('/matches/follow')
            .send({
                token: teacherToken,
                followEmail: 'teacher2@test'
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please provide the email of the user you want to follow');
            });
    });

    it('should return an error if the user to follow is not in the database', done => {
        chai.request(server)
            .put('/matches/follow')
            .send({
                token: teacherToken,
                followEmail: 'teacher3@test.com'
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('The user you want to follow is not an active member');
            });
    });

    //ToDo
    // it('should return an error if the user to follow is deactivated', done => {

    // })

});