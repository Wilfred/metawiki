var Resource = require('./resource.js');

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

