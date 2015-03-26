"use strict"; 

var mongoose = require('mongoose');

// A resource is a blob of data that can viewed or modified over
// our REST API.
// TODO: versioning
// TODO: mimeType will need to be immutable if we have a
// separate 'approver' user type.
var Resource = mongoose.model('Resource', {
    path: String,
    content: String,
    localPath: String, // TODO: enforce content XOR localPath
    mimeType: String,
    // TODO: since we want to allow arbitrary fields to be defined by the
    // client, we will probably need to talk to mongo directly. We then don't
    // need this in the schema.
    bootstrapPath: String,
});

module.exports = {
    Resource: Resource
};
