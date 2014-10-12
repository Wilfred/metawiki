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

    $.ajax({url:"/resources/" + resourceName}).done(function(page) {
        $content.html(editorTemplate({
            content: page.content,
            resourceName: resourceName
        }));

        CodeMirror.fromTextArea($('#editor').get(0), {
            lineNumbers: true
        });
    });
});

routie('md/Home');
