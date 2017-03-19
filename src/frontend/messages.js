define(function(require) {
    "use strict";

    var Push = require('push/push');

    Push.create("Hello world!", {
        body: "How's it hangin'?",
        icon: 'icon.png',
        timeout: 4000,
        onClick: function() {
            window.focus();
            this.close();
        }
    });
});
