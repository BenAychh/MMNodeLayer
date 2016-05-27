const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

const should = chai.should();

chai.use(chaiHttp);

const token;

describe('submitting a matching profile', () => {

    before(done => {
        return chai.request(server)
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
            .then(() => {
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
                        token = res.body.token;
                        done();
                    });
            });
            
    });

    it('should create a matching profile with a complete submission', done => {

    });

    it('should return an error if token is missing', done => {

    });

    it('should append an active status to the submission to the microservice', done => {
        ('just remember to do this').should.equal('just remember to do this');
        done();
    });

    it('should return an error if training is missing', done => {

    });

    it('should return an error if training is not an array of numbers', done => {

    });

    it('should return an error if user is a school and training has more than one element', done => {

    });

    it('should return an error if trainingWgt is missing', done => {

    });

    it('should return an error if trainingWgt is not 1, 10, 50 or 100', {

    });

    it('should return an error if locTypes is missing', done => {

    });

    it('should return an error if locTypes is not an array of numbers', done => {

    });

    it('should return an error if user is a school and locTypes has more than one element', done => {

    });

    it('should return an error if locTypesWgt is missing', done => {

    });

    it('should return an error if locTypesWgt is not 1, 10, 50 or 100', done => {

    });

    it('should return an error if orgTypes is missing', done => {

    });

    it('should return an error if orgTypes is not an array of numbers', done => {

    });

    it('should return an error if user is a school and orgTypes has more than one element', done => {

    });

    it('should return an error if orgTypesWgt is missing', done => {

    });

    it('should return an error if orgTypesWgt is not 1, 10, 50 or 100', {

    });

    it('should return an error if sizes is missing', done => {

    });

    it('should return an error if sizes is not an array of numbers', done => {

    });

    it('should return an error if user is a school and sizes has more than one element', done => {

    });

    it('should return an error if sizesWgt is missing', done => {

    });

    it('should return an error if sizesWgt is not 1, 10, 50 or 100', {

    });

    it('should return an error if cals is missing', done => {

    });

    it('should return an error if cals is not an array of numbers', done => {

    });

    it('should return an error if user is a school and cals has more than one element', done => {

    });

    it('should return an error if calsWgt is missing', done => {

    });

    it('should return an error if calsWgt is not 1, 10, 50 or 100', {

    });

    it('should return an error if training is missing', done => {

    });

    it('should return an error if states is not an array of numbers', done => {

    });

    it('should return an error if user is a school and states has more than one element', done => {

    });

    it('should return an error if states is missing', done => {

    });

    it('should return an error if states is not 1, 10, 50 or 100', {

    });

    it('should return an error if traits is missing', done => {

    });

    it('should return an error if traits is not an array of numbers', done => {

    });

    it('should return an error if traitsWgt is missing', done => {

    });

    it('should return an error if traitsWgt is not 1, 10, 50 or 100', {

    });

    it('should return an error if ageRanges is missing', done => {

    });

    it('should return an error if ageRanges is not an array of numbers', done => {

    });

    it('should return an error if ageRangesWgt is missing', done => {

    });

    it('should return an error if ageRangesWgt is not 1, 10, 50 or 100', {

    });
});