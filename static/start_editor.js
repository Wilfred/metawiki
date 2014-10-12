/* jshint -W061 */ // Allow eval.
var textarea = document.getElementById("editor"),
    button = document.getElementById("eval-contents");

textarea.value = "console.log(\"hello world!\");";

var editor = CodeMirror.fromTextArea(textarea, {
    lineNumbers: true
});

button.onclick = function() {
    eval(editor.getValue());
}
