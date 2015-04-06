require.config({
    baseUrl: "/serve"
});

// The clientside wiki app.
require([
    'backbone',
    'metawiki/routing', // defines our routes
], function(Backbone, routing) {
    Backbone.history.start();

    routing.navigate('md/Home', {trigger: true});
});
