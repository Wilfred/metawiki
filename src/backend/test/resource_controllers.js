/*global describe, it, before, after, beforeEach, afterEach */
"use strict";

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
var request = chai.request;

var _ = require('underscore');

var helpers = require('./helpers');
var Resource = require('../models').Resource;


// Create a test resource in the database, and pass it to the
// callback.
function insertResource(opts, cb) {
    opts = opts || {};

    var testResource = new Resource({
        path: opts.path || 'test_path',
        content: opts.content || 'test_content',
        mimeType: opts.mimeType || 'test_mimetype',
    });
    testResource.save(function() {
        cb(testResource);
    });
}

describe("Homepage", function() {
    beforeEach(helpers.testPrepare);

    it("should return 200 from /", function(done) {
        insertResource({
            path: 'metawiki/index.html',
        }, function() {
            request('http://localhost:9001')
                .get('/')
                .end(function (err, response) {
                    expect(response).to.have.status(200);
                    done();
                });
        });
    });

    it("should return 404 if there's no index.html", function(done) {
        request('http://localhost:9001')
            .get('/')
            .end(function (err, response) {
                expect(response).to.have.status(404);
                done();
            });
    });

    afterEach(helpers.teardownServer);
});

describe("Serving resources", function() {
    beforeEach(helpers.testPrepare);

    it("should be able to serve HTML", function(done) {
        insertResource({
            path: 'html/index.html',
            mimeType: 'text/html'
        }, function() {
            request('http://localhost:9001')
                .get('/serve/html/index.html')
                .end(function (err, response) {
                    expect(response).to.have.status(200);

                    expect(response.headers['content-type'])
                        .to.equal('text/html; charset=UTF-8');

                    done();
                });
        });
    });

    it("should 404 if no resource with that path", function(done) {
        request('http://localhost:9001')
            .get('/serve/no/such/resource')
            .end(function (err, response) {
                expect(response).to.have.status(404);

                done();
            });
    });

    afterEach(helpers.teardownServer);
});

describe("Accessing resources", function() {
    beforeEach(helpers.testPrepare);

    it("should return the resource requested", function(done) {
        var testResource = new Resource({
            'path': 'foo',
            'content': 'foo'
        });
        testResource.save(function() {
            request('http://localhost:9001')
                .get('/resources/foo')
                .end(function (err, response) {
                    expect(response).to.have.status(200);

                    var expected = testResource.toObject();
                    // Ignore ID and created for the time being.
                    response.body._id = null;
                    expected._id = null;
                    response.body.created = null;
                    expected.created = null;

                    expect(response.body).to.deep.equal(expected);

                    done();
                });
        });
    });

    it("should return 404 for nonexistent resources", function(done) {
        request('http://localhost:9001')
            .get('/resources/foo')
            .end(function (err, response) {
                expect(response).to.have.status(404);
                done();
            });
    });

    it("should return all resources", function(done) {
        var testResource = new Resource({
            'path': 'foo',
            'content': 'foo'
        });
        testResource.save(function() {
            request('http://localhost:9001')
                .get('/resources')
                .end(function (err, response) {
                    expect(response).to.have.status(200);
                    expect(response.body.length).to.equal(1);

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
            .end(function (err, response) {
                expect(response).to.have.status(200);

                Resource.find({
                    'path': 'foo'
                }, function(err, resources) {
                    expect(resources.length).to.equal(1);
                    expect(resources[0].content).to.equal("bar");
                    done();
                });
            });
    });

    it("should error if the resource already exists", function(done) {
        var testResource = new Resource({
            'path': 'fooz',
            'content': 'foo'
        });
        testResource.save(function() {
            request('http://localhost:9001')
                .post('/resources/fooz')
                .field('content', 'foo')
                .end(function (err, response) {
                    expect(response).to.have.status(400);

                    Resource.find({
                        'path': 'foo'
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
        insertResource({
            content: 'foo'
        }, function (testResource) {
            request('http://localhost:9001')
                .put('/resources/' + encodeURIComponent(testResource.path))
                .field('content', 'bar')
                .field('mimeType', 'application/javascript')
                .end(function (err, response) {
                    expect(response).to.have.status(200);

                    Resource.findOne({
                        path: testResource.path,
                        latest: true,
                    }, function(err, resource) {
                        expect(resource.content).to.equal("bar");
                        done();
                    });
                });
        });
    });

    it("should change resource mime type", function(done) {
        insertResource({
            mimeType: 'application/javascript'
        }, function(testResource) {
            request('http://localhost:9001')
                .put('/resources/' + testResource.path)
                .field('content', 'foo123')
                .field('mimeType', 'text/css')
                .end(function (err, response) {
                    expect(response).to.have.status(200);

                    Resource.findOne({
                        path: testResource.path,
                        latest: true,
                    }, function(err, resource) {
                        expect(resource.mimeType).to.equal("text/css");
                        done();
                    });
                });
        });
    });

    it("should create a new version", function(done) {
        insertResource({
            content: "oldcontent"
        }, function (testResource) {
            request('http://localhost:9001')
                .put('/resources/' + encodeURIComponent(testResource.path))
                .field('content', 'newcontent')
                .field('mimeType', 'whatever')
                .end(function () {
                    Resource.find({
                        path: testResource.path
                    }, function(err, resources) {
                        var oldResources = _.where(resources, {content: 'oldcontent'});
                        var newResources = _.where(resources, {content: 'newcontent'});

                        // We should have one old version, and the current version.
                        expect(oldResources.length).to.equal(1);
                        expect(newResources.length).to.equal(1);

                        // We should have set latest only on the new resource.
                        expect(oldResources[0].latest).to.equal(false);
                        expect(newResources[0].latest).to.equal(true);

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
            .end(function (err, response) {
                expect(response).to.have.status(404);
                done();
            });
    });

    it("should 400 on missing parameters", function(done) {
        insertResource({}, function(testResource) {
            request('http://localhost:9001')
                .put('/resources/' + testResource.path)
                .field('mimeType', 'text/css')
                .end(function (err, response) {
                    expect(response).to.have.status(400);
                    done();
                });
        });
    });

    afterEach(helpers.teardownServer);
});
