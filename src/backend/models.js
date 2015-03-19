var mongoose = require('mongoose');

// A resource is a blob of data that can viewed or modified over
// our REST API.
// TODO: versioning
// TODO: mimeType will need to be immutable.
var Resource = mongoose.model('Resource', {
    path: String,
    content: String,
    localPath: String, // TODO: enforce content XOR localPath
    mimeType: String
});

module.exports = {
    Resource: Resource
};