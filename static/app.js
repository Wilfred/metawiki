// The clientside wiki app.
var $content = $("#content");

routie('md/:page', function(page) {
    $content.html('page is: ' + page);
});

routie('md/Home');
