/*global CompilerContext */
describe('track ids', function() {
  var context;
  beforeEach(function() {
    context = {is: {a: 'foo'}, slave: {driver: 'bar'}};
  });

  it('should not include anything without the flag', function() {
    var template = CompilerContext.compile('{{wycats is.a slave.driver}}');

    var helpers = {
      wycats: function(passiveVoice, noun, options) {
        equal(options.ids, undefined);
        equal(options.hashIds, undefined);

        return 'success';
      }
    };

    equals(template({}, {helpers: helpers}), 'success');
  });
  it('should include argument ids', function() {
    var template = CompilerContext.compile('{{wycats is.a slave.driver}}', {trackIds: true});

    var helpers = {
      wycats: function(passiveVoice, noun, options) {
        equal(options.ids[0], 'is.a');
        equal(options.ids[1], 'slave.driver');

        return "HELP ME MY BOSS " + options.ids[0] + ':' + passiveVoice + ' ' + options.ids[1] + ':' + noun;
      }
    };

    equals(template(context, {helpers: helpers}), 'HELP ME MY BOSS is.a:foo slave.driver:bar');
  });
  it('should include hash ids', function() {
    var template = CompilerContext.compile('{{wycats bat=is.a baz=slave.driver}}', {trackIds: true});

    var helpers = {
      wycats: function(options) {
        equal(options.hashIds.bat, 'is.a');
        equal(options.hashIds.baz, 'slave.driver');

        return "HELP ME MY BOSS " + options.hashIds.bat + ':' + options.hash.bat + ' ' + options.hashIds.baz + ':' + options.hash.baz;
      }
    };

    equals(template(context, {helpers: helpers}), 'HELP ME MY BOSS is.a:foo slave.driver:bar');
  });
  it('should note ../ and ./ references', function() {
    var template = CompilerContext.compile('{{wycats ./is.a ../slave.driver}}', {trackIds: true});

    var helpers = {
      wycats: function(passiveVoice, noun, options) {
        equal(options.ids[0], 'is.a');
        equal(options.ids[1], '../slave.driver');

        return "HELP ME MY BOSS " + options.ids[0] + ':' + passiveVoice + ' ' + options.ids[1] + ':' + noun;
      }
    };

    equals(template(context, {helpers: helpers}), 'HELP ME MY BOSS is.a:foo ../slave.driver:undefined');
  });
  it('should note @data references', function() {
    var template = CompilerContext.compile('{{wycats @is.a @slave.driver}}', {trackIds: true});

    var helpers = {
      wycats: function(passiveVoice, noun, options) {
        equal(options.ids[0], '@is.a');
        equal(options.ids[1], '@slave.driver');

        return "HELP ME MY BOSS " + options.ids[0] + ':' + passiveVoice + ' ' + options.ids[1] + ':' + noun;
      }
    };

    equals(template({}, {helpers: helpers, data:context}), 'HELP ME MY BOSS @is.a:foo @slave.driver:bar');
  });

  it('should return null for constants', function() {
    var template = CompilerContext.compile('{{wycats 1 "foo" key=false}}', {trackIds: true});

    var helpers = {
      wycats: function(passiveVoice, noun, options) {
        equal(options.ids[0], null);
        equal(options.ids[1], null);
        equal(options.hashIds.key, null);

        return "HELP ME MY BOSS " + passiveVoice + ' ' + noun + ' ' + options.hash.key;
      }
    };

    equals(template(context, {helpers: helpers}), 'HELP ME MY BOSS 1 foo false');
  });
  it('should return true for subexpressions', function() {
    var template = CompilerContext.compile('{{wycats (sub)}}', {trackIds: true});

    var helpers = {
      sub: function() { return 1; },
      wycats: function(passiveVoice, options) {
        equal(options.ids[0], true);

        return "HELP ME MY BOSS " + passiveVoice;
      }
    };

    equals(template(context, {helpers: helpers}), 'HELP ME MY BOSS 1');
  });

  describe('builtin helpers', function() {
    var helpers = {
      wycats: function(name, options) {
        return name + ':' + options.data.contextPath + '\n';
      }
    };

    describe('#each', function() {
      it('should track contextPath for arrays', function() {
        var template = CompilerContext.compile('{{#each array}}{{wycats name}}{{/each}}', {trackIds: true});

        equals(template({array: [{name: 'foo'}, {name: 'bar'}]}, {helpers: helpers}), 'foo:array.0\nbar:array.1\n');
      });
      it('should track contextPath for keys', function() {
        var template = CompilerContext.compile('{{#each object}}{{wycats name}}{{/each}}', {trackIds: true});

        equals(template({object: {foo: {name: 'foo'}, bar: {name: 'bar'}}}, {helpers: helpers}), 'foo:object.foo\nbar:object.bar\n');
      });
      it('should handle nesting', function() {
        var template = CompilerContext.compile('{{#each .}}{{#each .}}{{wycats name}}{{/each}}{{/each}}', {trackIds: true});

        equals(template({array: [{name: 'foo'}, {name: 'bar'}]}, {helpers: helpers}), 'foo:.array..0\nbar:.array..1\n');
      });
    });
    describe('#with', function() {
      it('should track contextPath', function() {
        var template = CompilerContext.compile('{{#with field}}{{wycats name}}{{/with}}', {trackIds: true});

        equals(template({field: {name: 'foo'}}, {helpers: helpers}), 'foo:field\n');
      });
      it('should handle nesting', function() {
        var template = CompilerContext.compile('{{#with bat}}{{#with field}}{{wycats name}}{{/with}}{{/with}}', {trackIds: true});

        equals(template({bat: {field: {name: 'foo'}}}, {helpers: helpers}), 'foo:bat.field\n');
      });
    });
    describe('#blockHelperMissing', function() {
      it('should track contextPath for arrays', function() {
        var template = CompilerContext.compile('{{#field}}{{wycats name}}{{/field}}', {trackIds: true});

        equals(template({field: [{name: 'foo'}]}, {helpers: helpers}), 'foo:field.0\n');
      });
      it('should track contextPath for keys', function() {
        var template = CompilerContext.compile('{{#field}}{{wycats name}}{{/field}}', {trackIds: true});

        equals(template({field: {name: 'foo'}}, {helpers: helpers}), 'foo:field\n');
      });
      it('should handle nesting', function() {
        var template = CompilerContext.compile('{{#bat}}{{#field}}{{wycats name}}{{/field}}{{/bat}}', {trackIds: true});

        equals(template({bat: {field: {name: 'foo'}}}, {helpers: helpers}), 'foo:bat.field\n');
      });
    });
  });
});
