define([
    "jquery",
    "metawiki/models",
    "metawiki/templates",
    "handlebars/handlebars",
    "codemirror/lib/codemirror",
    "codemirror/addon/edit/matchbrackets",
    "codemirror/addon/edit/closebrackets",
    "codemirror/addon/selection/active-line",
    "codemirror/addon/hint/show-hint",
    "codemirror/addon/hint/anyword-hint",
    "codemirror/mode/javascript/javascript",
    "codemirror/mode/markdown/markdown",
    "codemirror/mode/css/css",
    "codemirror/mode/xml/xml"
], function($, models, templates, Handlebars, CodeMirror) {
    "use strict";

    function getMode(mimeType) {
        if (mimeType == "text/x-markdown") {
            return "markdown";
        } else if (mimeType == "application/javascript") {
            return "javascript";
        } else if (mimeType == "text/html") {
            return "xml";
        } else if (mimeType == "text/css") {
            return "css";
        }
    }

    function load(heading, resource) {
        resource = resource || new models.Resource();
        var mimeType = resource.get("mimeType") || "text/x-markdown";

        templates.$content.html(
            templates.pageTemplate({
                content: new Handlebars.SafeString(templates.editorTemplate({
                    content: resource.get("content") || "",
                    mimeType: mimeType,
                    path: resource.get("path") || "",
                    heading: heading
                }))
            })
        );

        // TODO: patching CodeMirror like this is dirty.
        CodeMirror.commands.autocomplete = function(cm) {
            cm.showHint({hint: CodeMirror.hint.anyword});
        };

        var cm = CodeMirror.fromTextArea($("#editor").get(0), {
            lineNumbers: true,
            indentUnit: 4,
            matchBrackets: true,
            styleActiveLine: true,
            autoCloseBrackets: true,
            mode: getMode(mimeType)
        });

        // TODO: this could be passed directly to fromTextArea
        cm.setOption("extraKeys", {
            "Tab": "indentAuto",
            "Ctrl-Space": "autocomplete"
        });

        var $selectMimeType = $("select[name=\"mimeType\"");
        var $formatSource = $(".format-source");

        if ($selectMimeType.val() == "application/javascript") {
            $formatSource.removeClass("hidden");
        }

        $selectMimeType.change(function(e) {
            cm.setOption("mode", getMode(this.value));
            if (this.value == "application/javascript") {
                $formatSource.removeClass("hidden");
            } else {
                $formatSource.addClass("hidden");
            }
        });

        $("input[name=execute]").click(function(e) {
            eval(cm.getValue());
            e.preventDefault();
            return false;
        });

        $formatSource.click(function(e) {
            e.preventDefault();
            var src = cm.getValue();
            fetch("/format?" + $.param({
                code: src
            })).then(function(response) {
                return response.json();
            }).then(function(data) {
                cm.getDoc().setValue(data.code);
            });
        });

        return cm;
    }

    return {
        load: load
    };
});
