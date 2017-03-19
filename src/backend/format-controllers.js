var restify = require('restify');
var formatRules = require("../../.eslintrc-format.json").rules;
var CLIEngine = require("eslint").CLIEngine;

var postcss = require('postcss');
var stylefmt = require('stylefmt');

function SyntaxError(message) {
  this.name = 'SyntaxError';
  this.message = message;
  this.stack = (new Error()).stack;
}
SyntaxError.prototype = new Error();

// TODO: it would be nice to move the formatting into the browser,
// wherever possible.
function format(req, res, next) {
  var code = req.query.code;
  var mimeType = req.query.mimeType;

  try {
    if (mimeType == 'application/javascript') {
      res.send({code: formatJs(code)});
      next();
    } else if (mimeType == 'text/css') {
      formatCss(code, function(err, formatted) {
        if (err) {
          next(new restify.BadRequestError(err.message));
          return;
        }
        res.send({code: formatted});
        next();
      });
    } else {
      next(new restify.BadRequestError("Invalid MIME type: " + mimeType));
    }
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
  var result = report.results[0];

  if (report.errorCount > 0) {
    var message = result.messages[0];
    throw new SyntaxError(
            String(message.line) + ":" + message.column +
                " " + message.message);
  }

    // If the code is already well formatted, eslint does not return
    // any output.
  return result.output || src;
}

// Format CSS text `src` and call `cb` with the result.
function formatCss(src, cb) {
  postcss([
    stylefmt
  ]).process(src).then(function(result) {
    cb(null, result.css);
  }).catch(function() {
    cb(new SyntaxError("CSS syntax error"));
  });
}

module.exports = {
  format: format
};
