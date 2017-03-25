// jshint unused:true
// TODO: use require() to avoid having to match up all these module names
// with arguments.
define([
  "jquery",
  "metawiki/models",
  "metawiki/templates",
  "metawiki/messages",
  "handlebars/handlebars",
  "codemirror/lib/codemirror",
  "codemirror/addon/edit/matchbrackets",
  "codemirror/addon/edit/closebrackets",
  "codemirror/addon/selection/active-line",
  "codemirror/addon/hint/show-hint",
  "codemirror/addon/hint/anyword-hint",
  "codemirror/addon/hint/css-hint",
  "codemirror/addon/hint/html-hint",
  "codemirror/addon/lint/lint",
  "codemirror/addon/lint/javascript-lint",
  "codemirror/mode/javascript/javascript",
  "codemirror/mode/markdown/markdown",
  "codemirror/mode/css/css",
  "codemirror/mode/xml/xml"
], function($, models, templates, messages, Handlebars, CodeMirror) {
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

  function canAutoformat(mimeType) {
    return mimeType == "application/javascript" ||
            mimeType == "text/css";
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
      cm.showHint();
    };

    var mode = getMode(mimeType);
    var config = {
      lineNumbers: true,
      indentUnit: 2,
      matchBrackets: true,
      styleActiveLine: true,
      autoCloseBrackets: true,
      mode: mode
    };
    if (mimeType == 'application/javascript') {
      config.gutters = ["CodeMirror-lint-markers"];
      config.lint = true;
    }

    console.log(config);

    var cm = CodeMirror.fromTextArea($("#editor").get(0), config);

    // TODO: this could be passed directly to fromTextArea
    cm.setOption("extraKeys", {
      "Tab": "indentAuto",
      "Ctrl-Space": "autocomplete"
    });

    var $selectMimeType = $("select[name=\"mimeType\"");
    var $formatSource = $(".format-source");

    if (canAutoformat($selectMimeType.val())) {
      $formatSource.removeClass("hidden");
    }

    $selectMimeType.change(function(e) {
      cm.setOption("mode", getMode(this.value));
      if (canAutoformat(this.value)) {
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

     // fetch() only errors on network problems, not HTTP status codes.
    function checkStatus(response) {
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    }

    $formatSource.click(function(e) {
      e.preventDefault();
      var src = cm.getValue();
      fetch("/format?" + $.param({
        code: src,
        mimeType: $selectMimeType.val()
      })).then(checkStatus).then(function(response) {
        return response.json();
      }).then(function(data) {
        cm.getDoc().setValue(data.code);
        messages.success('Formatted', 'ESLint ran successfully');
      }).catch(function(error) {
        messages.error("Formatting failed", String(error));
      });
    });

    return cm;
  }

  return {
    load: load
  };
});
