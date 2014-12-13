var server = require('./server');

server.listen(8080, function() {
    console.log('==> %s server listening at %s', server.name, server.url);
});

