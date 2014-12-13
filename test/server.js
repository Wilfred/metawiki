/*global describe, it */

var expect = require("chai").expect;
var request = require('request');
var server = require('../server');

describe("Backend REST API", function() {
    before(function(done) {
        server.listen(9001, 'localhost', done);
    });
    
    describe("homepage", function() {
        it("should return 200 from /", function(done){

            request.get('http://localhost:8000', function (err, res, body){
                expect(res.statusCode).to.equal(205);
                done();
            });
        });
    });

    after(function(done) {
        server.close();
        done();
    })
});
