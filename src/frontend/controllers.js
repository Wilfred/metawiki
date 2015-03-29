// The clientside wiki app.
define([
    'wikicircle/models',
    'handlebars/handlebars',
    'marked/marked',
    'codemirror/lib/codemirror',
    'codemirror/addon/edit/matchbrackets',
    "codemirror/mode/javascript/javascript",
    "codemirror/mode/markdown/markdown",
    "codemirror/mode/css/css",
    "codemirror/mode/xml/xml",
    'jquery/jquery'
], function(models, Handlebars, marked, CodeMirror) {
    var Resource = models.Resource;
    
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
    
    
    // Views.
    function loadEditor(heading, resource) {
        var mimeType = resource ? resource.mimeType : "text/x-markdown";
        var mode = "javascript";
        
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
            matchBrackets: true,
            mode: mode
        });
        
        cm.setOption("extraKeys", {
            Tab: "indentAuto"
        });
        
        $('input[name=execute]').click(function() {
            /* jshint evil: true */
            eval(cm.getValue());
            /* jshint evil: false */
            return false;
        });
        
        return cm;
    }
    
    // Controllers
    function viewController(pageName) {
        Resource.fetch("md/" + pageName, function(err, page) {
            $content.html(marked(page.content));
        });
    }
    
    function editController() {    
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
    }
    
    function newController() {
        var editor = loadEditor("New", null);
        
        $('input[type=submit]').click(function() {
            var $input = $(this);
            var resourceName = $('input[name=path]').val();
            
            Resource.create(resourceName, editor.getValue(), function() {
                // don't go anywhere if we said 'save and continue'
                if ($input.attr('name') != 'save-continue') {
                    // TODO: go to the relevant edited page
                    routie('md/Home');
                }
            });
            return false;
        });
    }
    
    // TODO: these names are a little redundant with the module name
    return {
        viewController: viewController,
        editController: editController,
        newController: newController
    };
});
