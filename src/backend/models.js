"use strict";

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// todo: this should be a mutable list stored in mongo.
var MIME_TYPES = [
    'text/x-markdown',
    'application/javascript',
    'text/html',
    'test/css'
];

var counterSchema = mongoose.Schema({
    name: String,
    value: Number
});

// We use a Counter to keep track of the current highest resource ID.
var Counter = mongoose.model('Counter', counterSchema);

var resourceSchema = mongoose.Schema({
    path: String, // used for serving, not the local disk
    created: Date,
    content: String,
    localPath: String, // TODO: enforce content XOR localPath
    mimeType: String,
    // TODO: since we want to allow arbitrary fields to be defined by the
    // client, we will probably need to talk to mongo directly. We then don't
    // need this in the schema.
    bootstrapPath: String,
    id: Number
});

// Ensure .id is an auto-incrementing number.
resourceSchema.pre('save', function(next) {
    var self = this;
    if (this.id == null) {
        Counter.findOneAndUpdate({
            name: 'Resource'
        }, {
            $inc: { value: 1 }
        }, function(err, counter) {
            self.id = counter.value;
            next();
        })
    } else {
        next();
    }
});

// A resource is a blob of data that can viewed or modified over
// our REST API.
// TODO: versioning
var Resource = mongoose.model('Resource', resourceSchema);

module.exports = {
    Resource: Resource,
    Counter: Counter,
    MIME_TYPES: MIME_TYPES
};
