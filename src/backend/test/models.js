var chai = require('chai');
var expect = chai.expect;

var helpers = require('./helpers');
var Resource = require('../models').Resource;

describe('Saving models', function() {
    beforeEach(helpers.testPrepare);

    it("should have an ID after saving", function(done) {
        new Resource({
            path: 'foo',
            content: 'bar'
        }).save(function(err, resource) {
            expect(resource.id).to.equal(1);
            done();
        });
    });

    afterEach(helpers.teardownServer);
});
