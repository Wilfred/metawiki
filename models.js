var mongoose = require('mongoose');

// TODO: this should be a database value, not hard-coded.
var MIME_TYPES = [
    'application/octet-stream',
    'application/javascript',
    'text/html',
    'text/css',
    'text/plain'
];


// A resource is a blob of data that can viewed or modified over
// our REST API.
// TODO: versioning
// TODO: mimeType will need to be immutable.
var Resource = mongoose.model('Resource', {
    path: String,
    
    content: String,
    mimeType: String
});

module.exports = {
    Resource: Resource
};

