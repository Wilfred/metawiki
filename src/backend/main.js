var server = require('./server');
var db = require('./db');

db.connect();

var wikiServer = server.create();
wikiServer.listen(9000, function() {
    console.log('==> %s server listening at %s',
                wikiServer.name, wikiServer.url);
});

