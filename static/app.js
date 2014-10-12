// The clientside wiki app.
var $content = $("#content"),
    editorTemplate = Handlebars.compile($("#editor-template").html());

routie('md/:pageName', function(pageName) {
    $.ajax({url:"/resources/md/" + pageName}).done(function(page) {
        $content.html(marked(page.content));
    });
});

routie('edit/*', function() {
    var resourceName = window.location.hash.substr("#edit/".length);
    $content.html(editorTemplate({
        content: "some content",
        resourceName: resourceName
    }));
});

routie('md/Home');
