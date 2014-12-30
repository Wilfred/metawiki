/*global describe, it */

var expect = require("chai").expect;
var request = require('request');
var async = require('async');

var server = require('../server');
var db = require('../db');

describe("Initial load", function() {
    before(function(done) {
        async.parallel([
            db.connect,
            function(cb) {
                server.listen(9001, 'localhost', cb);
            }
        ], done);
    });

    // TODO: add a sanity check test that we have mongo available.
    
    describe("Homepage", function() {
        it("should return 200 from /", function(done){
            request.get(
                'http://localhost:9001/', function (err, res, body){
                    expect(err).to.equal(null);
                    expect(res.statusCode).to.equal(200);
                    done();
                });
        });
    });

    after(function(done) {
        server.close(); // sync method
        db.disconnect(done);
    });
});
