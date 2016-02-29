"use strict"; 

var mongoose = require('mongoose');

function connect(cb, opts) {
    opts = opts || {};
    var db = opts.db || "metawiki";
    mongoose.connect('mongodb://127.0.0.1/' + db, cb);
}

function disconnect(cb) {
    mongoose.connection.close(cb);
}

module.exports = {
    connect: connect,
    disconnect: disconnect
};
