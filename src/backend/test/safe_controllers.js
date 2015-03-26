/*global describe, it, before, after */
"use strict";

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
var request = chai.request;

var helpers = require('./helpers');

describe("Safe views", function() {
    before(helpers.startServer);

    describe("Safe resource view", function() {
        it("should return 200 when accessing index.html", function(done){
            request("http://localhost:9001")
                .get('/safe/resource/html/index.html')
                .end(function (err, response) {
                    expect(response).to.have.status(200);
                    done();
                });
        });

        it("should return 404 if a resource doesn't exist", function(done){
            request("http://localhost:9001")
                .get('/safe/resource/nosuchfile.txt')
                .end(function (err, response) {
                    expect(response).to.have.status(404);
                    done();
                });
        });
    });

    after(helpers.teardownServer);
});
