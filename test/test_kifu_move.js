(function() {


var kifu_move;

module('Kifu.Move', {
  setup: function() {
    kifu_move = Kifu.Move();
  }
});

test('initialization', 1, function() {
  same(kifu_move.moves, [{type: 'init'}]);
});

test('addComment', 11, function() {
  var moves = Kifu.clone(kifu_move.moves);

  // comment1
  var move1 = {type: 'init', comment: "comment1\n"};
  ok(kifu_move.addComment('comment1'), 'comment1');
  same(kifu_move.get(0), move1, 'comment1 move1');

  // comment2
  move1['comment'] += "comment2\n";
  moves[0] = move1;
  ok(kifu_move.addComment('comment2'), 'comment2');
  same(kifu_move.get(0), move1, 'comment2 move1');

  // comment3
  kifu_move.addMove([2, 7], [2, 6], 'FU');
  var move2 = Kifu.clone(kifu_move.get(1));
  move2['comment'] = "comment3\n";
  ok(kifu_move.addComment('comment3'), 'comment3');
  same(kifu_move.get(0), move1, 'comment3 move1');
  same(kifu_move.get(1), move2, 'comment3 move2');

  // comment4
  move2['comment'] += "comment4\n";
  moves.push(move2);
  ok(kifu_move.addComment('comment4'), 'comment4');
  same(kifu_move.get(0), move1, 'comment4 move1');
  same(kifu_move.get(1), move2, 'comment4 move2');

  // check moves
  same(kifu_move.moves, moves, 'moves');
});

test('addMove', 6, function() {
  var moves = Kifu.clone(kifu_move.moves);

  // +2726FU
  var move = {
    black: true,
    from:  {             x: 2, y: 7},
    to:    {piece: 'FU', x: 2, y: 6},
    type:  'move'};
  moves.push(move);
  kifu_move.addMove([2, 7], [2, 6], 'FU', {black: true});
  same(kifu_move.get(1), move, '+2726FU');

  // -2326FU
  var move = {
    black: false,
    from:  {             x: 2, y: 3},
    to:    {piece: 'FU', x: 2, y: 6},
    type:  'move'};
  moves.push(move);
  kifu_move.addMove([2, 3], [2, 6], 'FU', {black: false});
  same(kifu_move.get(2), move, '-2326FU');

  // 2800HI
  var move = {
    str:   '同　飛',
    from:  {             x: 2, y: 8},
    to:    {piece: 'HI', x: 2, y: 6},
    type:  'move'};
  moves.push(move);
  kifu_move.addMove([2, 8], [0, 0], 'HI', {str: '同　飛'});
  same(kifu_move.get(3), move, '2800HI');

  // 0025FU
  var move = {
    str:   '２五歩打',
    from:  {             x: 0, y: 0},
    to:    {piece: 'FU', x: 2, y: 5},
    type:  'move'};
  moves.push(move);
  kifu_move.addMove([0, 0], [2, 5], 'FU', {str: '２五歩打'});
  same(kifu_move.get(4), move, '0025FU');

  // 2600HI
  var move = {
    str:   '同　飛',
    from:  {             x: 2, y: 6},
    to:    {piece: 'HI', x: 2, y: 5},
    type:  'move'};
  moves.push({type: 'MATTA'});
  moves.push(move);
  kifu_move.addSpecial('MATTA');
  kifu_move.addMove([2, 6], [0, 0], 'HI', {str: '同　飛'});
  same(kifu_move.get(6), move, '2600HI');

  // check moves
  same(kifu_move.moves, moves, 'moves');
});

test('addPeriod', 9, function() {
  var moves = Kifu.clone(kifu_move.moves);

  // 10sec
  var move = Kifu.clone(kifu_move.get(0));
  move['period'] = 10;
  ok(kifu_move.addPeriod(10), '10sec');
  same(kifu_move.get(0), move, '10sec move');

  // 20sec
  var move = Kifu.clone(kifu_move.get(0));
  move['period'] = 20;
  moves[0] = move;
  ok(kifu_move.addPeriod(20), '20sec');
  same(kifu_move.get(0), move, '20sec move');

  // 15sec
  kifu_move.addMove([2, 7], [2, 6], 'FU');
  var move = Kifu.clone(kifu_move.get(1));
  move['period'] = 15;
  ok(kifu_move.addPeriod(15), '15sec');
  same(kifu_move.get(1), move, '15sec move');

  // 30sec
  var move = Kifu.clone(kifu_move.get(1));
  move['period'] = 30;
  moves.push(move);
  ok(kifu_move.addPeriod(30), '30sec');
  same(kifu_move.get(1), move, '30sec move');

  // check moves
  same(kifu_move.moves, moves, 'moves');
});

test('addSpecial', 4, function() {
  var moves = Kifu.clone(kifu_move.moves);

  // TORYO
  var move = {type: 'TORYO'};
  moves.push(move);
  kifu_move.addSpecial('TORYO');
  same(kifu_move.get(1), move, 'TORYO');

  // +ILLEGAL_ACTION
  var move = {black: true, type: 'ILLEGAL_ACTION'};
  moves.push(move);
  kifu_move.addSpecial('ILLEGAL_ACTION', {black: true});
  same(kifu_move.get(2), move, '+ILLEGAL_ACTION');

  // -ILLEGAL_ACTION
  var move = {black: false, type: 'ILLEGAL_ACTION'};
  moves.push(move);
  kifu_move.addSpecial('ILLEGAL_ACTION', {black: false});
  same(kifu_move.get(3), move, '-ILLEGAL_ACTION');

  // check moves
  same(kifu_move.moves, moves, 'moves');
});

test('newMove', 5, function() {
  var moves = Kifu.clone(kifu_move.moves);

  same(kifu_move.get(1), undefined, 'undefined first move');
  kifu_move.newMove();
  same(kifu_move.get(1), {}, 'defined first move');
  same(kifu_move.get(2), undefined, 'undefined second move');
  kifu_move.newMove();
  same(kifu_move.get(2), undefined, 'undefined second move');
  moves.push({});

  // check moves
  same(kifu_move.moves, moves, 'moves');
});


})();

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2: */
