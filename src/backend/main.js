"use strict";

var server = require("./server");
var db = require("./db");

var PORT = process.env.PORT || 9002;

db.connect(function() {
  var wikiServer = server.create();
  wikiServer.listen(PORT, function() {
    console.log(
      "==> %s server listening at %s",
      wikiServer.name,
      wikiServer.url
    );
  });
});
