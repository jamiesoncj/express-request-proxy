var assert = require('assert');
var supertest = require('supertest');
var _ = require('lodash');
var proxy = require("..");
var setup = require('./setup');

describe('http headers', function() {
  beforeEach(setup.beforeEach);
  afterEach(setup.afterEach);

  beforeEach(function() {
    this.server.all('/proxy', proxy(this.proxyOptions));
    this.server.use(setup.errorHandler);
  });

  it('passes through content-type', function(done) {
    supertest(this.server).get('/proxy')
      .expect(200)
      .expect('Content-Type', /^application\/json/)
      .end(done);
  });

  it('passes correct Content-Length for post requests', function(done) {
    var postData = {foo: 1};

    supertest(this.server).post('/proxy')
      .set('Content-Type', 'application/json')
      .send(postData)
      .expect(200)
      .expect('Content-Type', /^application\/json/)
      .expect(function(res) {
        assert.equal(parseInt(res.body.headers['content-length']),
          JSON.stringify(postData).length);
      })
      .end(done);
  });

  it('uses correct user-agent', function(done) {
    supertest(this.server).get('/proxy')
      .expect(200)
      .expect(function(res) {
        assert.equal(res.body.headers['user-agent'], 'express-api-proxy')
      })
      .end(done);
    });
});
