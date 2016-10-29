var restify = require('restify');
var formatRules = require("../../.eslintrc-format.json").rules;
var CLIEngine = require("eslint").CLIEngine;

function SyntaxError(message) {
    this.name = 'SyntaxError';
    this.message = message;
    this.stack = (new Error()).stack;
}
SyntaxError.prototype = new Error();

// TODO: it would be nice to move the formatting into the browser,
// wherever possible.
function format(req, res, next) {
    // TODO: handle missing parameters and unknown mime types.
    var code = req.query.code;

    // TODO: test on code which requires no changes.
    try {
        res.send({code: formatJs(code)});
        next();
    } catch (e) {
        if (e.name == 'SyntaxError') {
            next(new restify.BadRequestError(e.message));
        } else {
            throw e;
        }
    }
}

// Eslint does not really run in the browser. See
// https://groups.google.com/forum/#!topic/eslint/_If8mxLNdgI and
// https://github.com/eslint/eslint/issues/2585
function formatJs(src) {
    var cli = new CLIEngine({
        envs: ["browser", "mocha"],
        useEslintrc: false,
        // TODO: allow users to override these.
        rules: formatRules,
        fix: true
    });

    var report = cli.executeOnText(src);

    if (report.errorCount > 0) {
        throw new SyntaxError("JS syntax error");
    }

    // TODO: test on code which requires no changes.
    return report.results[0].output;
}

module.exports = {
    format: format
};
