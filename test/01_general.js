var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');

var should = chai.should();

chai.use(chaiHttp);

describe('Bad requests correctly 404', done => {
  it('404s on improper GET request', done => {
    chai.request(server)
    .get('/something/that/does/not/exist')
    .end((err, res) => {
      res.should.have.status(404);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.status.should.equal(404);
      res.body["requested resource"].should.equal('/something/that/does/not/exist');
      res.body["requested method"].should.equal('GET');
      res.body.message.should.equal('Not Found');
      done();
    });
  });
  it('404s on improper POST request', done => {
    chai.request(server)
    .POST('/something/that/does/not/exist')
    .end((err, res) => {
      res.should.have.status(404);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.status.should.equal(404);
      res.body["requested resource"].should.equal('/something/that/does/not/exist');
      res.body["requested method"].should.equal('POST');
      res.body.message.should.equal('Not Found');
      done();
    });
  });
  it('404s on improper PUT request', done => {
    chai.request(server)
    .put('/something/that/does/not/exist')
    .end((err, res) => {
      res.should.have.status(404);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.status.should.equal(404);
      res.body["requested resource"].should.equal('/something/that/does/not/exist');
      res.body["requested method"].should.equal('PUT');
      res.body.message.should.equal('Not Found');
      done();
    });
  });
  it('404s on improper DELETE request', done => {
    chai.request(server)
    .delete('/something/that/does/not/exist')
    .end((err, res) => {
      res.should.have.status(404);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.status.should.equal(404);
      res.body["requested resource"].should.equal('/something/that/does/not/exist');
      res.body["requested method"].should.equal('DELETE');
      res.body.message.should.equal('Not Found');
      done();
    });
  })
})
