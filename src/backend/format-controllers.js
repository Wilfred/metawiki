var formatRules = require("../../.eslintrc-format.json").rules;
var CLIEngine = require("eslint").CLIEngine;

// Eslint does not really run in the browser. See
// https://groups.google.com/forum/#!topic/eslint/_If8mxLNdgI and
// https://github.com/eslint/eslint/issues/2585
function format(req, res, next) {
    // TODO: handle missing parameters, unknown mime types and invalid
    // syntax.
    var code = req.query.code;

    // TODO: test on code which requires no changes.
    res.send({code: formatJs(code)});
    // TODO: test that this is the correct MIME type
    next();
}

function formatJs(src) {
    var cli = new CLIEngine({
        envs: ["browser", "mocha"],
        useEslintrc: false,
        // TODO: allow users to override these.
        rules: formatRules,
        fix: true
    });

    var report = cli.executeOnText(src);
    // TODO: test on code which requires no changes.
    return report.results[0].output;
}

module.exports = {
    format: format
};
