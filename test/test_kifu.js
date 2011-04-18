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

    var info = kifu.info;
    same(info['format'], 'csa', 'check format');
    same(info['source'], source, 'source');
  });
});

test('capitalize', 1, function() {
  var s = Kifu.capitalize('foo');
  same(s, 'Foo', 'capitalize');
});

test('clone', 6, function() {
  // simple object
  var h1 = {foo: 'foo'};
  var h2 = Kifu.clone(h1);
  same(h1, h2, 'same simple object');
  h2['foo'] = 'bar';
  QUnit.notDeepEqual(h1, h2, 'different simple object');

  // deep object
  h1 = {foo: 'foo', bar: {bar: 'bar', baz: null}};
  h2 = Kifu.clone(h1);
  same(h1, h2, 'same deep object');
  h2['bar']['baz'] = 'baz';
  QUnit.notDeepEqual(h1, h2, 'different deep object');

  // simple array
  var a1 = [1, 2, null];
  var a2 = Kifu.clone(a1);
  same(a1, a2, 'same simple array');

  // deep array
  var a1 = [1, null, {foo: 'bar'}];
  var a2 = Kifu.clone(a1);
  same(a1, a2, 'same deep array');
});

test('load', 2, function() {
  var source = document.getElementById('csa1').innerHTML;
  same(Kifu.load('csa1'), source, 'load by id');
  same(Kifu.load('foo bar baz'), 'foo bar baz', 'load by string');
});

test('noConflict', 2, function() {
  same(typeof Kifu, 'function');
  var k = Kifu.noConflict();
  same(typeof Kifu, 'undefined');
  Kifu = k;
});

test('initialization', 9, function() {
  // simple initialization
  var kifu = Kifu();
  var info = {player_start: 'black'};
  same(kifu.suite_init, Kifu.Suite(), 'simple suite_init');
  same(kifu.info,       info,         'simple info');
  same(kifu.moves,      Kifu.Move(),  'simple moves');

  // initialization with source
  var source = 'V2.2';
  info['source'] = source;
  var kifu = Kifu(source);
  same(kifu.suite_init, Kifu.Suite(), 'source suite_init');
  same(kifu.info,       info,         'source info');
  same(kifu.moves,      Kifu.Move(),  'source moves');

  // initialization with source and format
  info['format']  = 'csa';
  info['version'] = '2.2';
  var kifu = Kifu(source, 'csa');
  same(kifu.suite_init, Kifu.Suite(), 'source suite_init');
  same(kifu.info,       info,         'source info');
  same(kifu.moves,      Kifu.Move(),  'source moves');
});

test('moveNext, movePrev', 31, function() {
  var kifu = Kifu('V2.2');
  kifu.suite_init.hirate();
  kifu.parse('csa');
  kifu.moves.addMove([2, 7], [2, 6], 'FU', {black: true});
  kifu.moves.addMove([3, 3], [3, 4], 'FU', {black: false});
  var black = kifu.black;
  var moves = kifu.moves.clone();
  var step  = kifu.step;
  var suite = kifu.suite.clone();

  // 1st move
  var move = moves.get(1);
  suite.move(move);
  black = false;
  step  = 1;
  same(kifu.moveNext(), move,  '1st move');
  same(kifu.black,  black, '1st black');
  same(kifu.moves,  moves, '1st moves');
  same(kifu.step,   step,  '1st step');
  same(kifu.suite,  suite, '1st suite');

  // 2nd move
  var move = moves.get(2);
  suite.move(move);
  black = true;
  step  = 2;
  same(kifu.moveNext(), move,  '2nd move');
  same(kifu.black,  black, '2nd black');
  same(kifu.moves,  moves, '2nd moves');
  same(kifu.step,   step,  '2nd step');
  same(kifu.suite,  suite, '2nd suite');

  // 3rd move
  var move = moves.get(3);
  same(move,        undefined, '3rd move undefined');
  same(kifu.moveNext(), move,      '3rd move');
  same(kifu.black,  black,     '3rd black');
  same(kifu.moves,  moves,     '3rd moves');
  same(kifu.step,   step,      '3rd step');
  same(kifu.suite,  suite,     '3rd suite');

  // 2nd prev
  var move = moves.get(2);
  suite.moveReverse(move);
  black = false;
  step  = 1;
  same(kifu.movePrev(), move,  '2nd perv move');
  same(kifu.black,  black, '2nd perv black');
  same(kifu.moves,  moves, '2nd perv moves');
  same(kifu.step,   step,  '2nd perv step');
  same(kifu.suite,  suite, '2nd perv suite');

  // 1st prev
  var move = moves.get(1);
  suite.moveReverse(move);
  black = true;
  step  = 0;
  same(kifu.movePrev(), move,  '1st perv move');
  same(kifu.black,  black, '1st perv black');
  same(kifu.moves,  moves, '1st perv moves');
  same(kifu.step,   step,  '1st perv step');
  same(kifu.suite,  suite, '1st perv suite');

  // init prev
  var move = moves.get(0);
  same(kifu.movePrev(), move,  'init perv move');
  same(kifu.black,  black, 'init perv black');
  same(kifu.moves,  moves, 'init perv moves');
  same(kifu.step,   step,  'init perv step');
  same(kifu.suite,  suite, 'init perv suite');
});

test('parse', 7, function() {
  var info  = {
    format: 'csa', player_start: 'black', source: 'V2.2', version: '2.2'};
  var kifu  = Kifu('V2.2');
  var moves = Kifu.Move();
  var suite = Kifu.Suite();
  ok(kifu.parse('csa'), 'parse');
  same(kifu.black,      true,  'black');
  same(kifu.info,       info,  'info');
  same(kifu.moves,      moves, 'moves');
  same(kifu.step,       0,     'step');
  same(kifu.suite,      suite, 'suite');
  same(kifu.suite_init, suite, 'suite_init');
});

test('prepare', 10, function() {
  var kifu  = Kifu();
  var moves = Kifu.Move();
  kifu.suite_init.hirate();

  // -3334FU
  kifu.moves.addMove([3, 3], [3, 4], 'FU', {black: false, str: '34foo'});
  moves.addMove([3, 3], [3, 4], 'FU', {black: false, str: '34foo'});
  var move = moves.get(1);
  move['from']['piece'] = 'FU';
  ok(kifu.prepare(), 'prepare');
  same(kifu.moves, moves, '-3334FU');

  // 2878HI
  kifu.moves.addMove([2, 8], [7, 8], 'HI');
  moves.addMove([2, 8], [7, 8], 'HI');
  var move = moves.get(2);
  move['black']         = true;
  move['from']['piece'] = 'HI';
  move['str']           = '７八飛';
  ok(kifu.prepare(), 'prepare');
  same(kifu.moves, moves, '2878HI');

  // 8100NK
  kifu.moves.addMove([8, 1], [0, 0], 'NK');
  moves.addMove([8, 1], [0, 0], 'NK');
  var move = moves.get(3);
  move['black']         = false;
  move['from']['piece'] = 'KE';
  move['to']['x']       = 7;
  move['to']['y']       = 8;
  move['stand']         = {piece: 'HI', stand: 'HI'};
  move['str']           = '７八桂成';
  ok(kifu.prepare(), 'prepare');
  same(kifu.moves, moves, '8100NK');

  // 7900GI
  kifu.moves.addMove([7, 9], [0, 0], 'GI');
  moves.addMove([7, 9], [0, 0], 'GI');
  var move = moves.get(4);
  move['black']         = true;
  move['from']['piece'] = 'GI';
  move['to']['x']       = 7;
  move['to']['y']       = 8;
  move['stand']         = {piece: 'NK', stand: 'KE'};
  move['str']           = '７八銀';
  ok(kifu.prepare(), 'prepare');
  same(kifu.moves, moves, '7900GI');

  // 0055KA
  kifu.moves.addMove([0, 0], [5, 5], 'KA');
  moves.addMove([0, 0], [5, 5], 'KA');
  var move = moves.get(5);
  move['black']         = false;
  move['from']['piece'] = 'KA';
  move['str']           = '５五角打';
  ok(kifu.prepare(), 'prepare');
  same(kifu.moves, moves, '0055KA');
});

test('source', 5, function() {
  var kifu = Kifu();

  same(kifu.source(), undefined, 'first status');

  // string
  var source = 'V2.2';
  same(kifu.source(source), source, source);
  same(kifu.source(), source, source);

  // document id
  var source = document.getElementById('csa1').innerHTML;
  same(kifu.source('csa1'), source, source);
  same(kifu.source(), source, source);
});


})();

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2: */
