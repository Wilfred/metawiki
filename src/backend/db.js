var mongoose = require('mongoose');

function connect(cb) {
    mongoose.connect('mongodb://localhost/test', cb);
}

function disconnect(cb) {
    mongoose.connection.close(cb);
}

module.exports = {
    connect: connect,
    disconnect: disconnect
};