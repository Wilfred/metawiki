/*global Handlebars, routie */

// The clientside wiki app.

// Models.
var Resource = {
    fetch: function fetch(resourceName, callback) {
        $.ajax({url:"/resources/" + resourceName}).done(function(resource) {
            // TODO: Handle 404 and 500.
            callback(null, resource);
        });
    }, save: function save(name, content, callback) {
        $.ajax({
            url:"/resources/" + name,
            data: {name: name, content: content},
            type: 'PUT',
        }).done(function(resource) {
            // TODO: Handle 404 and 500.
            callback(null, resource);
        });
    }
}

// Templating.
Handlebars.registerHelper('ifEqual', function(v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

var $content = $("#content"),
    editorTemplate = Handlebars.compile($("#editor-template").html());

function getHash() {
    return window.location.hash.substring(1);
}

// Controllers with routing.
// TODO: separate these.
routie({
    'md/:pageName': function viewController(pageName) {
        console.log(['load pageName', pageName]);
        console.trace();
        Resource.fetch("md/" + pageName, function(err, page) {
            $content.html(marked(page.content));
        });
    },
            
    'edit*': function editController() {
        // Of the form 'edit?foo/bar'
        var hashPath = window.location.hash.substring(1);
        var resourceName = hashPath.split('?')[1];

        Resource.fetch(resourceName, function(err, resource) {
            var editor = loadEditor("Editing", resource);

            // TODO: we should narrow this to children of the edit form.
            // TODO: create too.
            $('input[type=submit]').click(function() {
                var $input = $(this);
           
                Resource.save(resourceName, editor.getValue(), function() {
                    // don't go anywhere if we said 'save and continue'
                    if ($input.attr('name') != 'save-continue') {
                        // TODO: go to the relevant edited page
                        routie('md/Home');
                    }
                });
                return false;
            });
        });  
    },

    'new*': function newController() {
        loadEditor("New", null);
    }
});

// Views.
function loadEditor(heading, resource) {
    var mimeType = resource ? resource.mimeType : "text/x-markdown"
    var mode = "javascript"
  
    if (mimeType == "text/x-markdown") {
        mode = "markdown";
    } else if (mimeType == "text/html") {
        mode = "xml";
    } else if (mimeType == "text/css") {
        mode = "css";
    }
  
    $content.html(editorTemplate({
        content: resource ? resource.content : "",
        mimeType: mimeType,
        path: resource ? resource.path : "",
        heading: heading
    }));

    var cm = CodeMirror.fromTextArea($('#editor').get(0), {
        lineNumbers: true,
        indentUnit: 4,
        mode: mode
    })
    
    cm.setOption("extraKeys", {
        Tab: function(cm) {
            var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
            cm.replaceSelection(spaces);
        }
    });

    $('input[name=execute]').click(function() {
        /* jshint evil: true */
        eval(cm.getValue());
        /* jshint evil: false */
        return false
    });

    return cm;
}

// Initialisation.
if (getHash() === "") {
    routie('md/Home');
}
