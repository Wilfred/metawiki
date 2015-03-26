/*global describe, it, before, after */
"use strict";

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
var request = chai.request;

var helpers = require('./helpers');
var Resource = require('../models').Resource;


describe("Resource views", function() {
    before(helpers.testPrepare);

    // TODO: add a sanity check test that we have mongo available.
    
    describe("Homepage", function() {
        it("should return 200 from /", function(done) {
            // TODO: factor this out.
            new Resource({
                'path': 'html/index.html',
                'content': 'foo'
            }).save(function() {
                request('http://localhost:9001')
                    .get('/')
                    .end(function (err, response) {
                        expect(response).to.have.status(200);
                        done();
                    });
            });
        });
    });

    describe("Editing resources", function() {
        it("should change the requested resource", function(done) {
            var testResource = new Resource({
                'path': 'foo',
                'content': 'foo'
            });
            testResource.save(function() {
                request('http://localhost:9001')
                    .put('/resources/' + testResource.path)
                    .field('content', 'bar')
                    .end(function (err, response) {
                        expect(response).to.have.status(200);
                        
                        
                        Resource.find({
                            'path': testResource.path
                        }, function(err, resources) {
                            expect(resources.length).to.equal(1);
                            done();
                            // expect(changedResource.path).to.equal("bar");
                        });
                    });
            });

            
        });
    });

    after(helpers.teardownServer);
});
