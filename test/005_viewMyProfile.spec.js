'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

const should = chai.should();

chai.use(chaiHttp);

let teacherToken;



describe('get user profile', () => {

    before(function(done) {
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
                teacherToken = res.body.token;
                done();
            })
    });

    it('should get user profile information with valid email', done => {
        chai.request(server)
            .post('/profiles/get')
            .send({
                token: teacherToken
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(200);
                res.body.message.should.equal('Returning profile');
                res.body.should.have.property('profile');
                res.body.profile.should.be.a('object');
                res.body.profile.email.should.equal('testy@test.com');
                res.body.profile.displayName.should.equal('Testy');
                res.body.profile.isTeacher.should.equal(1);
                res.body.profile.lastName.should.equal('Mctestface');
                res.body.profile.description.should.equal('Quis aute iure reprehenderit in voluptate velit esse. Mercedem aut nummos unde unde extricat, amaras. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Ab illo tempore, ab est sed immemorabili. Gallia est omnis divisa in partes tres, quarum.');
                res.body.profile.state.should.equal('CO');
                res.body.profile.avatarUrl.should.equal('CO');
                done();
            });
    });

    it('should return error if the user does not exist', done => {
        chai.request(server)
            .post('/profiles/get')
            .send({
                token: teacherToken
            })
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
            .post('/profiles/get')
            .send({})
            .end((err, res) => {
                res.should.have.status(403);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.status.should.equal(403);
                res.body.message.should.equal('Please log in');
                done();
            })
    })
});