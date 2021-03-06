"use strict";

var async = require("async");
var db = require("./db.js");
var models = require("./models.js");

async.series(
  [
    db.connect,

    function(cb) {
      models.Counter.deleteMany({}, cb);
    },
    function(cb) {
      models.Resource.deleteMany({}, cb);
    },

    db.disconnect
  ],
  function(err) {
    if (err) {
      console.log(["Failed:", err]);
    } else {
      console.log("Deleted all resources.");
    }
  }
);
