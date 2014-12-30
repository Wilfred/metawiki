var server = require('./server');
var db = require('./db');

db.connect();

server.listen(9000, function() {
    console.log('==> %s server listening at %s', server.name, server.url);
});

