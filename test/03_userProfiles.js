var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');

var should = chai.should();

chai.use(chaiHttp);

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
    it('should return an error if the avatar file exists and is not a png or jpg', done => {

    })
    it('should return an error if the avatar file exists and is greater than 1MB', done => {

    })
});
describe('get user profile', () => {
    it('should get user profile information with valid email', done => {

    })
    it('should return error if the user does not exist', done => {

    })
    it('should return error with malformed email', done => {

    })
});
describe('updating user profile information', () => {
    it('should update profile information when valid updates are passed', done => {

    })
    it('should return an error if the user already exists', done => {

    })
    it('should return an error if the email is malformed', done => {

    })
    it('should return an error with a missing email', done => {

    })
    it('should return an error if displayName is not a string', done => {

    })
    it('should return an error if displayName is greater than 50 characters', done => {

    })
    it('should return an error if the lastName is not a string', done => {

    })
    it('should return an error if the lastName is longer than 30 characters', done => {

    })
    it('should return an error if the description is not a string', done => {

    })
    it('should return an error if the description is longer than 500 characters', done => {

    })
    it('should return an error if state is not a string', done => {

    })
    it('should return an error if state is longer than two characters', done => {

    })
});
describe('following another user/adding staff', () => {
    it('should add another user to the profile follow list given correct criteria', done => {

    })
    it('should should return an error if email key is missing', done => {

    })
    it('should return an error if follow key is missing', done => {

    })
    it('should return an error if the email value is not an email', done => {

    })
    it('should return an error if user email is not in profile database', done => {

    })
    it('should return an error if email to follow is not in profile database', done => {

    })
    it('should return an error if the follow value is not an email', done => {

    })
    it('should return an error if the email to follow is already in the user profile "follow" array', done => {

    })
});
describe('unfollowing another user/removing staff', () => {
    it('should add another user to the profile follow list given correct criteria', done => {

    })
    it('should should return an error if email key is missing', done => {

    })
    it('should return an error if the email value is not an email', done => {

    })
    it('should return an error if unfollow key is missing', done => {

    })
    it('should return an error if the unfollow value is not an email', done => {

    })
    it('should return an error if user email is not in profile database', done => {

    })
    it('should return an error if email to follow is not in the user profile "follow" array', done => {

    })
});