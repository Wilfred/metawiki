/*global phantom */

// TODO: use phantom-proxy so we can do everything in the same test
// suite.

'use strict';
var process = require("child_process");
var webpage = require('webpage');

var child = process.spawn('node', ['src/backend/main.js']);

// Give the server 2 seconds to start up.
setTimeout(function() {
    var page = webpage.create();

    page.open("http://localhost:9002", function(status) {
        if (status != 'success') {
            console.log("Could not access site!");

            child.kill();
            phantom.exit(1);
        }

        // Give the page 2 seconds to load.
        setTimeout(function() {
            var heading = page.evaluate(function() {
                var h2 = document.getElementsByTagName('h2')[0];
                return h2;
            });

            var exitCode = 0;
            if (!heading) {
                console.log("Could not find the heading!");
                exitCode = 1;
            } else if (heading.textContent != '∞ metawiki') {
                console.log("Unexpected header value:", heading.textContent);
                exitCode = 1;
            } else {
                console.log("Success!", heading.textContent);
            }

            child.kill();
            phantom.exit(exitCode);
        }, 2000);
    });

}, 2000);
