var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

// A resource is a blob of data that can viewed or modified over
// our REST API.
// TODO: versioning
var Resource = mongoose.model('Resource', {
    category: String,
    path: String,
    content: String
});

module.exports = Resource;
