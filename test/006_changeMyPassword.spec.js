'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

const should = chai.should();

chai.use(chaiHttp);

let teacherToken;

describe('a user updates their password', () => {

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
                done();
            });
    });

    it('should update a user password when passed full information', done => {
        chai.request(server)
            .put('/auth/changepassword')
            .send({
                token: teacherToken,
                oldPassword: '1Password!',
                newPassword: '2Password!'
            })
            .end((err, res) => {
                res.status.should.equal(200);
                res.should.be.json;
                res.body.status.should.equal(200);
                res.body.message.should.equal('Password changed for teacher@test.com')
            });
    });

    it('should return an error if token is missing', done => {
        chai.request(server)
            .put('/auth/changepassword')
            .send({
                oldPassword: '1Password!',
                newPassword: '2Password!'
            })
            .end((err, res) => {
                res.status.should.equal(403);
                res.should.be.json;
                res.body.status.should.equal(403);
                res.body.message.should.equal('Please log in');
            })
    });

    it('should return an error if old password is missing', done => {
        chai.request(server)
            .put('/auth/changepassword')
            .send({
                token: teacherToken,
                newPassword: '2Password!'
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please enter your old and new passwords');
            });
    });

    it('should return an error if new password is missing', done => {
        chai.request(server)
            .put('/auth/changepassword')
            .send({
                token: teacherToken,
                oldPassword: '1Password!'
            })
            .end((err, res) => {
                res.status.should.equal(400);
                res.should.be.json;
                res.body.status.should.equal(400);
                res.body.message.should.equal('Please enter your old and new passwords');
            });
    });
});