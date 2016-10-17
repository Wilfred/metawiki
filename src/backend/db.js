"use strict"; 

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

function connect(cb, opts) {
    opts = opts || {};
    var db = opts.db || "metawiki";
    mongoose.connect('mongodb://localhost/' + db, cb);
}

function disconnect(cb) {
    mongoose.connection.close(cb);
}

module.exports = {
    connect: connect,
    disconnect: disconnect
};
