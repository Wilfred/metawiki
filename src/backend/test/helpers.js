var async = require('async');
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);


var server = require('../server');
var db = require('../db');

var SERVER_PORT = 9001;
var testServer = null;

// Start the backend server and connect to our database.
function startServer(cb) {
    async.parallel([
        db.connect,
        function(_cb) {
            testServer = server.create({log: undefined});
            testServer.listen(SERVER_PORT, 'localhost', _cb);
        }
    ], cb);
}

function teardownServer(cb) {
    testServer.close(); // sync method
    db.disconnect(cb);
}

module.exports = {
    startServer: startServer,
    teardownServer: teardownServer
};
