var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
var request = chai.request;

var helpers = require('./helpers');

describe('Autoformat', function() {
    beforeEach(helpers.testPrepare);

    it("should return 200 when formatting", function(done) {
        request('http://localhost:9001')
            .get('/format')
            .query({code: 'functionfoo(x,y){x+1;y+2;}', mimeType: 'application/javascript'})
            .end(function (err, response) {
                expect(response).to.have.status(200);
                done();
            });
    });

    it("should return formatted JS", function(done) {
        request('http://localhost:9001')
            .get('/format')
            .query({code: "function foo(x,y){\nx+1\nx={'a': 1}\n}", mimeType: 'application/javascript'})
            .end(function (err, response) {
                expect(response.body).to.deep.equal({
                    code: "function foo(x, y) {\n    x + 1;\n    x = {a: 1};\n}\n"
                });
                done();
            });
    });

    afterEach(helpers.teardownServer);
});
