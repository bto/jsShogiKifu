(function() {


module('Kifu');

test('ajax', 2, function() {
  stop(1000);

  var source;
  jQuery.ajax({dataType: 'text', type: 'GET', url: 'csa1.txt',
    success: function(s) {
      source = s;
    }
  });

  Kifu.ajax({url: 'csa1.txt'}, 'csa', function(kifu) {
    start();

    var info = kifu.info('info');
    same(info['format'], 'csa', 'check format');
    same(info['source'], source, 'source');
  });
});

test('capitalize', 1, function() {
  var s = Kifu.capitalize('foo');
  same(s, 'Foo', 'capitalize');
});

test('clone', 4, function() {
  var h1 = {foo: 'foo'};
  var h2 = Kifu.clone(h1);
  same(h1, h2, 'wheter same object');

  h2['foo'] = 'bar';
  QUnit.notDeepEqual(h1, h2, 'whether different object');

  h1 = {foo: 'foo', bar: {bar: 'bar', baz: null}};
  h2 = Kifu.clone(h1);
  same(h1, h2, 'wheter same object 2');

  h2['bar']['baz'] = 'baz';
  QUnit.notDeepEqual(h1, h2, 'whether different object 2');
});

test('load', 2, function() {
  same(Kifu.load('csa1'), "\nV2.2\n", 'load by id');
  same(Kifu.load('foo bar baz'), 'foo bar baz', 'load by string');
});

test('noConflict', 2, function() {
  same(typeof Kifu, 'function');
  var k = Kifu.noConflict();
  same(typeof Kifu, 'undefined');
  Kifu = k;
});


})();

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2: */
