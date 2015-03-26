"use strict"; 

var mongoose = require('mongoose');

function connect(cb, opts) {
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
