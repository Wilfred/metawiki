/*global describe, it */

var expect = require("chai").expect;
var request = require('request');
var async = require('async');

var server = require('../server');
var db = require('../db');

var wikiServer = server.create({log: undefined});

describe("Safe views", function() {
    before(function(done) {
        async.parallel([
            db.connect,
            function(cb) {
                wikiServer.listen(9001, 'localhost', cb);
            }
        ], done);
    });

    describe("Safe view", function() {
        it("should return 200 when accessing index.html", function(done){
            request.get(
                'http://localhost:9001/safe/resource/index.html', function (err, res, body){
                    expect(err).to.equal(null);
                    expect(res.statusCode).to.equal(200);
                    done();
                });
        });
    });

    after(function(done) {
        wikiServer.close(); // sync method
        db.disconnect(done);
    });
});
