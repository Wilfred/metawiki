// The clientside wiki app.
var $content = $("#content");

routie('md/:pageName', function(pageName) {
    $.ajax({url:"/resources/md/" + pageName}).done(function(page) {
        $content.html(marked(page.content));
    });
    
});

routie('md/Home');
