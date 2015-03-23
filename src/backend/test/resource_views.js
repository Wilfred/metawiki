/*global describe, it */

var chai = require('chai');
var chaiHttp = require('chai-http');

chai.use(chaiHttp);
var expect = chai.expect;
var request = chai.request;

var async = require('async');

var server = require('../server');
var db = require('../db');

var wikiServer = server.create({log: undefined});

describe("Resource views", function() {
    before(function(done) {
        async.parallel([
            db.connect,
            function(cb) {
                wikiServer.listen(9001, 'localhost', cb);
            }
        ], done);
    });

    // TODO: add a sanity check test that we have mongo available.
    
    describe("Homepage", function() {
        it("should return 200 from /", function(done) {
            request('http://localhost:9001')
                .get('/')
                .end(function (err, response) {
                    expect(response).to.have.status(200);
                    done();
                });
        });
    });

    after(function(done) {
        wikiServer.close(); // sync method
        db.disconnect(done);
    });
});
