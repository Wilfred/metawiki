var server = require('./server');

server.listen(9000, function() {
    console.log('==> %s server listening at %s', server.name, server.url);
});

