define([
    'metawiki/models',
    'metawiki/templates',
    'handlebars/handlebars',
    'codemirror/lib/codemirror',
    'codemirror/addon/edit/matchbrackets',
    "codemirror/mode/javascript/javascript",
    "codemirror/mode/markdown/markdown",
    "codemirror/mode/css/css",
    "codemirror/mode/xml/xml",
    'jquery'
], function(models, templates, Handlebars, CodeMirror) {
    "use strict";
 
    function load(heading, resource) {
        resource = resource || new models.Resource();
        var mimeType = resource.get('mimeType') || "text/x-markdown";
        var mode = "javascript";
        
        if (mimeType == "text/x-markdown") {
            mode = "markdown";
        } else if (mimeType == "text/html") {
            mode = "xml";
        } else if (mimeType == "text/css") {
            mode = "css";
        }
        
        templates.$content.html(
            templates.pageTemplate({
                content: new Handlebars.SafeString(templates.editorTemplate({
                    content: resource.get('content') || "",
                    mimeType: mimeType,
                    path: resource.get('path') || "",
                    heading: heading
                }))
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
        
        $('input[name=execute]').click(function(e) {
            eval(cm.getValue());
            e.preventDefault();
            return false;
        });
        
        return cm;
    }
    
    return {
        load: load
    };
});