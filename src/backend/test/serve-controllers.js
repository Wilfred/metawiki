/*global describe, it, before, after, beforeEach, afterEach */

var chai = require("chai");
var chaiHttp = require("chai-http");
chai.use(chaiHttp);
var expect = chai.expect;
var request = chai.request;

var Resource = require("../models").Resource;
var helpers = require("./helpers");

describe("Serving resources", function() {
  beforeEach(helpers.testPrepare);

  it("should be able to serve HTML", function(done) {
    new Resource({
      path: "html/index.html",
      content: "foo",
      mimeType: "text/html"
    }).save(function() {
      request("http://localhost:9001")
        .get("/serve/html/index.html")
        .end(function(err, response) {
          expect(response).to.have.status(200);

          expect(response.headers["content-type"]).to.equal(
            "text/html; charset=UTF-8"
          );

          done();
        });
    });
  });

  it("should 404 if no resource with that path", function(done) {
    request("http://localhost:9001")
      .get("/serve/no/such/resource")
      .end(function(err, response) {
        expect(response).to.have.status(404);

        done();
      });
  });

  afterEach(helpers.teardownServer);
});
