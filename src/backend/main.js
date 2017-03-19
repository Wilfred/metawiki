"use strict";

var server = require('./server');
var db = require('./db');

// FIXME: this is actually asynchronous.
db.connect();

var wikiServer = server.create();
wikiServer.listen(9002, function() {
  console.log('==> %s server listening at %s',
              wikiServer.name, wikiServer.url);
});
