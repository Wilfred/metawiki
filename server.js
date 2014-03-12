var http = require('http');
var Resource = require('./resource.js');

http.createServer(function (req, res) {
    // TODO: support other content-types.
    res.writeHead(200, {'Content-Type': 'text/html'});

    Resource.findOne({'path': 'index.html'}, function(err, indexResource) {
        res.end(indexResource.content);
    });
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');

