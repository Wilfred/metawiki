require.config({
  baseUrl: "/serve"
});

// The entry point for the app.
define(function(require) {
  var Backbone = require('backbone');
  var routing = require('metawiki/routing');

  Backbone.history.start();

  if (Backbone.history.getHash() === "") {
    routing.navigate("page/Home", {trigger: true});
  }
});
