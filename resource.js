var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

// A resource a blob of piece of data that can viewed or modified over
// our REST API.
// TODO: versioning
var Resource = mongoose.model('Resource', {
    category: String,
    path: String,
    content: String
});

var hello = new Resource({
    category: 'template',
    path: 'index.html',
    content: 'hello world!'
});
hello.save(function (err) {
  if (err) {
      console.log('Failed to save resource!');
  } else {
      console.log('Saved.')
  }
});

