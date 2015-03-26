var async = require('async');
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);


var server = require('../server');
var db = require('../db');
var Resource = require('../models.js').Resource;

var SERVER_PORT = 9001;
var TEST_DB_NAME = "testing";
var testServer = null;

function freshTestDB(cb) {
    async.series([
        function(_cb) {
            db.connect(_cb, {db: TEST_DB_NAME});
        },
        function(_cb) {
            Resource.remove({}, _cb);
        }
    ], cb);
}

function startServer(cb) {
    testServer = server.create({log: undefined});
    testServer.listen(SERVER_PORT, 'localhost', cb);
}

function testPrepare(cb) {
    async.parallel([freshTestDB, startServer], cb);
}

function teardownServer(cb) {
    testServer.close(); // sync method
    db.disconnect(cb);
}

module.exports = {
    testPrepare: testPrepare,
    teardownServer: teardownServer
};
