/*global describe, it */

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
var request = chai.request;

var helpers = require('./helpers');

describe("Resource views", function() {
    before(helpers.startServer);

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

    after(helpers.teardownServer);
});
