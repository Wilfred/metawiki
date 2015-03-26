/*global describe, it, before, after */
"use strict";

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
var request = chai.request;

var helpers = require('./helpers');
var Resource = require('../models').Resource;


describe("Homepage", function() {
    before(helpers.testPrepare);
    
    it("should return 200 from /", function(done) {
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

    after(helpers.teardownServer);
});

describe("Editing resources", function() {
    before(helpers.testPrepare);

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
                        expect(resources[0].content).to.equal("bar");
                        done();
                    });
                });
        });
    });

    it("should 404 on editing nonexistent resources", function(done) {
        request('http://localhost:9001')
            .put('/resources/no-such-resource')
            .field('content', 'bar')
            .end(function (err, response) {
                expect(response).to.have.status(404);
                done(); 
            });
    });

    after(helpers.teardownServer);
});
