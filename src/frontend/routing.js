define([
    'wikicircle/controllers',
    'routie/routie'
], function(controllers) {
    // TODO: all pages view
    routie({
        'md/:pageName': controllers.viewController,
        'edit*': controllers.editController,
        'new*': controllers.newController      
    });
    
    function getHash() {
        return window.location.hash.substring(1);
    }
    
    function initialize() {
        if (getHash() === "") {
            routie('md/Home');
        }
    }
    
    return {
        initialize: initialize
    };
});
