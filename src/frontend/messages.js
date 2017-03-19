define(function(require) {
  "use strict";

  var Push = require('push/push');

  function message(title, body, icon) {
    Push.create(title, {
      body: body,
      icon: '/serve/' + icon,
      timeout: 3000,
      onClick: function() {
        window.focus();
        this.close();
      }
    });
  }

  function success(title, body) {
    message(title, body, "Ok.png");
  }

  function error(title, body) {
    message(title, body, "Error.png");
  }

  return {
    success: success,
    error: error
  };
});
