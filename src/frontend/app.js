require.config({
    baseUrl: "/serve/js"
});

// The clientside wiki app.
require([
    'backbone',
    'wikicircle/routing', // defines our routes
], function(Backbone, routing) {
    Backbone.history.start();

    routing.navigate('md/Home', {trigger: true});
});
