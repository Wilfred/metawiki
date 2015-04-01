require.onResourceLoad = function(context, map) {
    // From http://stackoverflow.com/a/13877988/509706
    require.undef(map.name);
};

require.config({
    baseUrl: "/serve/js"
});

// The clientside wiki app.
require([
    'wikicircle/routing'
], function(routing) {
    routing.initialize();
});
