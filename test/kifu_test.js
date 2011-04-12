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


var kifu_board;

module('Kifu.Board', {
  setup: function() {
    kifu_board = Kifu.Board();
  }
});

test('empty board', 1, function() {
  var empty_board = {
    1: {1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null},
    2: {1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null},
    3: {1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null},
    4: {1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null},
    5: {1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null},
    6: {1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null},
    7: {1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null},
    8: {1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null},
    9: {1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null}};
  same(Kifu.Board.empty(), empty_board, 'empty board');
});

test('default pieces', 1, function() {
  var pieces = {
    FU: 18,
    KY:  4,
    KE:  4,
    GI:  4,
    KI:  4,
    KA:  2,
    HI:  2,
    OU:  2};
  same(Kifu.Board.pieces(), pieces, 'default pieces');
});

test('initialization', 3, function() {
  var board = Kifu.Board();
  same(board.board(),  Kifu.Board.empty(), 'check board');
  same(board.pieces(), Kifu.Board.pieces(), 'check pieces');
  same(board.stand(),  {black: {}, white: {}}, 'check stand');
});

test('deploy', 13, function() {
  var board  = Kifu.Board.empty();
  var pieces = Kifu.Board.pieces();

  // black: 18FU
  board[1][8] = {black: true, piece: 'FU'};
  pieces['FU'] = 17;
  ok(kifu_board.deploy(1, 8, 'FU', true));
  same(kifu_board.board(),  board,  'board1');
  same(kifu_board.pieces(), pieces, 'pieces1');

  // white: 73KA
  board[7][3] = {black: false, piece: 'KA'};
  pieces['KA'] = 1;
  ok(kifu_board.deploy(7, 3, 'KA', false));
  same(kifu_board.board(),  board,  'board2');
  same(kifu_board.pieces(), pieces, 'pieces2');

  // white: 73KA fail
  same(kifu_board.deploy(7, 3, 'KA', true), false, 'double deployment');
  same(kifu_board.board(),  board,  'board2 not changed');
  same(kifu_board.pieces(), pieces, 'pieces2 not changed');

  // 74KA: success, 75KA: fail(lack of pieces)
  board[7][4] = {black: true, piece: 'KA'};
  pieces['KA'] = 0;
  ok(kifu_board.deploy(7, 4, 'KA', true));
  same(kifu_board.deploy(7, 5, 'KA', false), false, 'lack of pieces');
  same(kifu_board.board(),  board,  'board2 not changed');
  same(kifu_board.pieces(), pieces, 'pieces2 not changed');
});

test('get and set', 6, function() {
  // 26KY
  var piece = {black: true, piece: 'KY'};
  same(kifu_board.get(2, 6), null, '26 null');
  ok(kifu_board.set(2, 6, 'KY', true), '26KY');
  same(kifu_board.get(2, 6), piece, '26KY');

  // 81KE
  var piece = {black: false, piece: 'KE'};
  same(kifu_board.get(8, 1), null, '81 null');
  ok(kifu_board.set(8, 1, 'KE', false), '81KE');
  same(kifu_board.get(8, 1), piece, '81KE');
});


})();

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2: */
