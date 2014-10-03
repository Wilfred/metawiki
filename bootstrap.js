var fs = require("fs");
var db = require('./db.js');

db.connect();

db.Resource.findOneAndUpdate({
    category: 'template',
    path: 'index.html',
}, {
    content: fs.readFileSync('index.html', {encoding: 'utf8'})
}, {
    upsert: true
}, function(x) {
    db.disconnect();
});
