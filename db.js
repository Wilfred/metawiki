var mongoose = require('mongoose');

function connect(cb) {
    mongoose.connect('mongodb://localhost/test', cb);
}

function disconnect(cb) {
    mongoose.connection.close(cb);
}

// A resource is a blob of data that can viewed or modified over
// our REST API.
// TODO: versioning
var Resource = mongoose.model('Resource', {
    // TODO: rename this to 'type'.
    category: String,
    path: String,
    content: String
});

module.exports = {
    Resource: Resource,
    connect: connect,
    disconnect: disconnect
};
