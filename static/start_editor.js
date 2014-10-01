/* jshint -W061 */
var textarea = document.getElementById("editor"),
    button = document.getElementById("eval-contents");

textarea.value = "console.log(\"hello world!\");";

CodeMirror.fromTextArea(textarea, {
    lineNumbers: true
});

button.onclick = function() {
    eval(textarea.value);
}
