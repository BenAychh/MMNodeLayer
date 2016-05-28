'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

const should = chai.should();

chai.use(chaiHttp);

let teacherToken;

describe('a user makes a request to see their suggested maches', () => {

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

    it('should return an array of the user\'s suggested matches', done => {
        chai.request(server)
            .post('/matches/suggested')
            .send({
                token: teacherToken
            })
            .end((err, res) => {
                res.status.should.equal(200);
                res.should.be.json;
                res.body.status.should.equal(200);
                res.body.message.should.equal('Returning suggested matches');
                res.body.suggestedMatches.should.eql([]);
            });
    });
    
    it('should return an error if the token is missing', done => {
       chai.request(server)
       .post('/matches/suggested')
       .send({})
       .end((err, res) => {
           res.status.should.equal(403);
           res.should.be.json;
           res.body.status.should.equal(403);
           res.body.message.should.equal('Please log in');
       }) 
    });

});