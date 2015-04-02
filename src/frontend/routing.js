define([
    'wikicircle/controllers',
    'routie/routie'
], function(controllers) {
    // TODO: all pages view
    routie({
        'md/:pageName': controllers.viewPage,
        'edit*': controllers.editPage,
        'new*': controllers.newPage      
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
