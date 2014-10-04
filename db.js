var mongoose = require('mongoose');

function connect() {
    mongoose.connect('mongodb://localhost/test');
}

function disconnect() {
    mongoose.connection.close();
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
