/*global describe, it, before, after, beforeEach, afterEach */
"use strict";

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
var request = chai.request;

var helpers = require('./helpers');
var Resource = require('../models').Resource;
var _ = require('lodash');

describe("Homepage", function() {
  beforeEach(helpers.testPrepare);

  it("should return 200 from /", function(done) {
    new Resource({
      path: 'metawiki/index.html',
      content: 'foo'
    }).save(function() {
      request('http://localhost:9001')
                .get('/')
                .end(function(err, response) {
                  expect(response).to.have.status(200);
                  done();
                });
    });
  });

  it("should return 404 if there's no index.html", function(done) {
    request('http://localhost:9001')
            .get('/')
            .end(function(err, response) {
              expect(response).to.have.status(404);
              done();
            });
  });

  afterEach(helpers.teardownServer);
});

describe("Accessing resources", function() {
  beforeEach(helpers.testPrepare);

  it("should return the resource requested", function(done) {
    new Resource({
      path: 'foo',
      content: 'foo'
    }).save(function() {
      request('http://localhost:9001')
                .get('/resources/foo')
                .end(function(err, response) {
                  expect(response).to.have.status(200);

                  var result = _.omitBy(response.body, function(v, k) {
                    return k.startsWith("_");
                  });
                  expect(result).to.deep.equal({
                    path: 'foo',
                    content: 'foo',
                    id: 1
                  });

                  done();
                });
    });
  });

  it("should return 404 for nonexistent resources", function(done) {
    request('http://localhost:9001')
            .get('/resources/foo')
            .end(function(err, response) {
              expect(response).to.have.status(404);
              done();
            });
  });

  it("should return all resources", function(done) {
    var testResource = new Resource({
      path: 'foo',
      content: 'foo'
    });
    testResource.save(function() {
      request('http://localhost:9001')
                .get('/resources')
                .end(function(err, response) {
                  expect(response).to.have.status(200);
                  expect(response.body.length).to.equal(1);

                  var result = _.omitBy(response.body[0], function(v, k) {
                    return k.startsWith("_");
                  });
                  expect(result).to.deep.equal({
                    path: 'foo',
                    content: 'foo',
                    id: 1
                  });

                  done();
                });
    });
  });

  afterEach(helpers.teardownServer);
});

describe("Creating resources", function() {
  before(helpers.testPrepare);

  it("should create a resource", function(done) {
    request('http://localhost:9001')
            .post('/resources/foo')
            .field('content', 'bar')
            .end(function(err, response) {
              expect(response).to.have.status(200);

              Resource.find({
                path: 'foo'
              }, function(err, resources) {
                expect(resources.length).to.equal(1);
                expect(resources[0].content).to.equal("bar");
                done();
              });
            });
  });

  it("should error if the resource already exists", function(done) {
    var testResource = new Resource({
      path: 'fooz',
      content: 'foo'
    });
    testResource.save(function() {
      request('http://localhost:9001')
                .post('/resources/fooz')
                .field('content', 'foo')
                .end(function(err, response) {
                  expect(response).to.have.status(400);

                  Resource.find({
                    path: 'foo'
                  }, function(err, resources) {
                    expect(resources.length).to.equal(1);
                    done();
                  });
                });
    });
  });

  after(helpers.teardownServer);
});

describe("Editing resources", function() {
  beforeEach(helpers.testPrepare);

  it("should change resource content", function(done) {
    var testResource = new Resource({
      path: 'foo',
      content: 'foo',
      mimeType: 'application/javascript'
    });
    testResource.save(function() {
      request('http://localhost:9001')
                .put('/resources/' + encodeURIComponent(testResource.path))
                .field('content', 'bar')
                .field('mimeType', 'application/javascript')
                .end(function(err, response) {
                  expect(response).to.have.status(200);

                  Resource.find({
                    path: testResource.path
                  }, function(err, resources) {
                    expect(resources.length).to.equal(1);
                    expect(resources[0].content).to.equal("bar");
                    done();
                  });
                });
    });
  });

  it("should change resource mime type", function(done) {
    var testResource = new Resource({
      path: 'foo',
      content: 'foo',
      mimeType: 'application/javascript'
    });
    testResource.save(function() {
      request('http://localhost:9001')
                .put('/resources/' + testResource.path)
                .field('content', 'foo')
                .field('mimeType', 'text/css')
                .end(function(err, response) {
                  expect(response).to.have.status(200);

                  Resource.find({
                    path: testResource.path
                  }, function(err, resources) {
                    expect(resources.length).to.equal(1);
                    expect(resources[0].mimeType).to.equal("text/css");
                    done();
                  });
                });
    });
  });

  it("should 404 on editing nonexistent resources", function(done) {
    request('http://localhost:9001')
            .put('/resources/no-such-resource')
            .field('content', 'bar')
            .field('mimeType', 'text/css')
            .end(function(err, response) {
              expect(response).to.have.status(404);
              done();
            });
  });

  it("should 400 on missing parameters", function(done) {
    var testResource = new Resource({
      path: 'foo',
      content: 'foo',
      mimeType: 'application/javascript'
    });
    testResource.save(function() {
      request('http://localhost:9001')
                .put('/resources/' + testResource.path)
                .field('mimeType', 'text/css')
                .end(function(err, response) {
                  expect(response).to.have.status(400);
                  done();
                });
    });
  });

  afterEach(helpers.teardownServer);
});
