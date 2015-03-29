require.config({
    baseUrl: "/serve/js"
});

// The clientside wiki app.
require([
    'wikicircle/routing'
], function(routing) {
    routing.initialize();
});
