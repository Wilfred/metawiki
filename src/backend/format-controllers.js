var CLIEngine = require("eslint").CLIEngine;

function format(req, res, next) {
    // TODO: handle missing parameters, unknown mime types and invalid
    // syntax.
    var code = req.query.code;

    var cli = new CLIEngine({
        envs: ["browser", "mocha"],
        useEslintrc: false,
        // TODO: allow users to override these.
        // TODO: ensure frontend and backend use the same rules
        rules: {
            "array-bracket-spacing": "warn",
            "comma-dangle": "warn",
            "comma-spacing": "warn",
            "dot-notation": "warn",
            "eol-last": "warn",
            "func-call-spacing": "warn",
            "indent": ["warn", 4],
            "key-spacing": "warn",
            "keyword-spacing": "warn",
            "linebreak-style": "warn",
            "new-parens": "warn",
            "no-extra-parens": "warn",
            "no-extra-semi": "warn",
            "no-implicit-coercion": "warn",
            "no-multi-spaces": "warn",
            "no-multiple-empty-lines": "warn",
            "no-trailing-spaces": "warn",
            "no-whitespace-before-property": "warn",
            "object-curly-spacing": "warn",
            "quotes": "warn",
            "quote-props": ["warn", "consistent-as-needed"],
            "semi": "warn",
            "semi-spacing": "warn",
            "space-before-blocks": "warn",
            "space-before-function-paren": ["warn", "never"],
            "space-in-parens": "warn",
            "space-infix-ops": "warn",
            "space-unary-ops": "warn",
        },
        fix: true
    });

    var report = cli.executeOnText(code);
    // TODO: test on code which requires no changes.
    res.send({code: report.results[0].output});
    // TODO: test that this is the correct MIME type
    next();
}

module.exports = {
    format: format,
};
