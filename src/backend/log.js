"use strict";

var bunyan = require('bunyan');
var PrettyStream = require('bunyan-prettystream');

var prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

module.exports = new bunyan.createLogger({
  name: "metawiki",
  streams: [{
    level: 'debug',
    type: 'raw',
    stream: prettyStdOut
  }]
});
