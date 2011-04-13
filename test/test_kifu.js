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
  same(kifu.board_init, Kifu.Board(), 'simple board_init');
  same(kifu.info,       info,         'simple info');
  same(kifu.moves,      Kifu.Move(),  'simple moves');

  // initialization with source
  var source = 'V2.2';
  info['source'] = source;
  var kifu = Kifu(source);
  same(kifu.board_init, Kifu.Board(), 'source board_init');
  same(kifu.info,       info,         'source info');
  same(kifu.moves,      Kifu.Move(),  'source moves');

  // initialization with source and format
  info['format']  = 'csa';
  info['version'] = '2.2';
  var kifu = Kifu(source, 'csa');
  same(kifu.board_init, Kifu.Board(), 'source board_init');
  same(kifu.info,       info,         'source info');
  same(kifu.moves,      Kifu.Move(),  'source moves');
});

test('next, prev', 31, function() {
  var kifu = Kifu('V2.2');
  kifu.board_init.hirate();
  kifu.parse('csa');
  kifu.moves.addMove([2, 7], [2, 6], 'FU', {black: true});
  kifu.moves.addMove([3, 3], [3, 4], 'FU', {black: false});
  var black = kifu.black;
  var board = kifu.board.clone();
  var moves = kifu.moves.clone();
  var step  = kifu.step;

  // 1st move
  var move = moves.get(1);
  board.move(move);
  black = false;
  step  = 1;
  same(kifu.next(), move,  '1st move');
  same(kifu.black,  black, '1st black');
  same(kifu.board,  board, '1st board');
  same(kifu.moves,  moves, '1st moves');
  same(kifu.step,   step,  '1st step');

  // 2nd move
  var move = moves.get(2);
  board.move(move);
  black = true;
  step  = 2;
  same(kifu.next(), move,  '2nd move');
  same(kifu.black,  black, '2nd black');
  same(kifu.board,  board, '2nd board');
  same(kifu.moves,  moves, '2nd moves');
  same(kifu.step,   step,  '2nd step');

  // 3rd move
  var move = moves.get(3);
  same(move,        undefined, '3rd move undefined');
  same(kifu.next(), move,      '3rd move');
  same(kifu.black,  black,     '3rd black');
  same(kifu.board,  board,     '3rd board');
  same(kifu.moves,  moves,     '3rd moves');
  same(kifu.step,   step,      '3rd step');

  // 2nd prev
  var move = moves.get(2);
  board.moveReverse(move);
  black = false;
  step  = 1;
  same(kifu.prev(), move,  '2nd perv move');
  same(kifu.black,  black, '2nd perv black');
  same(kifu.board,  board, '2nd perv board');
  same(kifu.moves,  moves, '2nd perv moves');
  same(kifu.step,   step,  '2nd perv step');

  // 1st prev
  var move = moves.get(1);
  board.moveReverse(move);
  black = true;
  step  = 0;
  same(kifu.prev(), move,  '1st perv move');
  same(kifu.black,  black, '1st perv black');
  same(kifu.board,  board, '1st perv board');
  same(kifu.moves,  moves, '1st perv moves');
  same(kifu.step,   step,  '1st perv step');

  // init prev
  var move = moves.get(0);
  same(kifu.prev(), move,  'init perv move');
  same(kifu.black,  black, 'init perv black');
  same(kifu.board,  board, 'init perv board');
  same(kifu.moves,  moves, 'init perv moves');
  same(kifu.step,   step,  'init perv step');
});

test('parse', 7, function() {
  var board = Kifu.Board();
  var info  = {
    format: 'csa', player_start: 'black', source: 'V2.2', version: '2.2'};
  var moves = Kifu.Move();
  var kifu = Kifu('V2.2');
  ok(kifu.parse('csa'), 'parse');
  same(kifu.black,      true,  'black');
  same(kifu.board,      board, 'board');
  same(kifu.board_init, board, 'board_init');
  same(kifu.info,       info,  'info');
  same(kifu.moves,      moves, 'moves');
  same(kifu.step,       0,     'step');
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
