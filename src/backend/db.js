"use strict";

var mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;

var MONGO_HOST = process.env.MONGO_HOST || "localhost";

function connect(cb, opts) {
  opts = opts || {};
  var db = opts.db || "metawiki";
  var url = "mongodb://" + MONGO_HOST + "/" + db;
  mongoose.connect(url, cb);
}

function disconnect(cb) {
  mongoose.connection.close(cb);
}

module.exports = {
  connect: connect,
  disconnect: disconnect
};
