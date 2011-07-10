(function() {


var moves;

module('Kifu.Move', {
  setup: function() {
    moves = Kifu.Move();
  }
});

test('initialization', 1, function() {
  same(moves.records, [{type: 'init'}]);
});

test('addComment', 11, function() {
  var records = Kifu.clone(moves.records);

  // comment1
  var move1 = {type: 'init', comment: "comment1\n"};
  ok(moves.addComment('comment1'), 'comment1');
  same(moves.get(0), move1, 'comment1 move1');

  // comment2
  move1['comment'] += "comment2\n";
  records[0] = move1;
  ok(moves.addComment('comment2'), 'comment2');
  same(moves.get(0), move1, 'comment2 move1');

  // comment3
  moves.addMove([2, 7], [2, 6], 'FU');
  var move2 = Kifu.clone(moves.get(1));
  move2['comment'] = "comment3\n";
  ok(moves.addComment('comment3'), 'comment3');
  same(moves.get(0), move1, 'comment3 move1');
  same(moves.get(1), move2, 'comment3 move2');

  // comment4
  move2['comment'] += "comment4\n";
  records.push(move2);
  ok(moves.addComment('comment4'), 'comment4');
  same(moves.get(0), move1, 'comment4 move1');
  same(moves.get(1), move2, 'comment4 move2');

  // check records
  same(moves.records, records, 'records');
});

test('addMove', 6, function() {
  var records = Kifu.clone(moves.records);

  // +2726FU
  var move = {
    black: true,
    from:  {             x: 2, y: 7},
    to:    {piece: 'FU', x: 2, y: 6},
    type:  'move'};
  records.push(move);
  moves.addMove([2, 7], [2, 6], 'FU', {black: true});
  same(moves.get(1), move, '+2726FU');

  // -2326FU
  var move = {
    black: false,
    from:  {             x: 2, y: 3},
    to:    {piece: 'FU', x: 2, y: 6},
    type:  'move'};
  records.push(move);
  moves.addMove([2, 3], [2, 6], 'FU', {black: false});
  same(moves.get(2), move, '-2326FU');

  // 2800HI
  var move = {
    str:   '同　飛',
    from:  {             x: 2, y: 8},
    to:    {piece: 'HI', x: 0, y: 0},
    type:  'move'};
  records.push(move);
  moves.addMove([2, 8], [0, 0], 'HI', {str: '同　飛'});
  same(moves.get(3), move, '2800HI');

  // 0025FU
  var move = {
    str:   '２五歩打',
    from:  {             x: 0, y: 0},
    to:    {piece: 'FU', x: 2, y: 5},
    type:  'move'};
  records.push(move);
  moves.addMove([0, 0], [2, 5], 'FU', {str: '２五歩打'});
  same(moves.get(4), move, '0025FU');

  // 2600HI
  var move = {
    str:   '同　飛',
    from:  {             x: 2, y: 6},
    to:    {piece: 'HI', x: 0, y: 0},
    type:  'move'};
  records.push({type: 'MATTA'});
  records.push(move);
  moves.addSpecial('MATTA');
  moves.addMove([2, 6], [0, 0], 'HI', {str: '同　飛'});
  same(moves.get(6), move, '2600HI');

  // check records
  same(moves.records, records, 'records');
});

test('addPeriod', 9, function() {
  var records = Kifu.clone(moves.records);

  // 10sec
  var move = Kifu.clone(moves.get(0));
  move['period'] = 10;
  ok(moves.addPeriod(10), '10sec');
  same(moves.get(0), move, '10sec move');

  // 20sec
  var move = Kifu.clone(moves.get(0));
  move['period'] = 20;
  records[0] = move;
  ok(moves.addPeriod(20), '20sec');
  same(moves.get(0), move, '20sec move');

  // 15sec
  moves.addMove([2, 7], [2, 6], 'FU');
  var move = Kifu.clone(moves.get(1));
  move['period'] = 15;
  ok(moves.addPeriod(15), '15sec');
  same(moves.get(1), move, '15sec move');

  // 30sec
  var move = Kifu.clone(moves.get(1));
  move['period'] = 30;
  records.push(move);
  ok(moves.addPeriod(30), '30sec');
  same(moves.get(1), move, '30sec move');

  // check records
  same(moves.records, records, 'records');
});

test('addSpecial', 4, function() {
  var records = Kifu.clone(moves.records);

  // TORYO
  var move = {type: 'TORYO'};
  records.push(move);
  moves.addSpecial('TORYO');
  same(moves.get(1), move, 'TORYO');

  // +ILLEGAL_ACTION
  var move = {black: true, type: 'ILLEGAL_ACTION'};
  records.push(move);
  moves.addSpecial('ILLEGAL_ACTION', {black: true});
  same(moves.get(2), move, '+ILLEGAL_ACTION');

  // -ILLEGAL_ACTION
  var move = {black: false, type: 'ILLEGAL_ACTION'};
  records.push(move);
  moves.addSpecial('ILLEGAL_ACTION', {black: false});
  same(moves.get(3), move, '-ILLEGAL_ACTION');

  // check records
  same(moves.records, records, 'records');
});

test('clone', 2, function() {
  var moves2 = moves.clone();
  same(moves2, moves, 'clone');
  moves2.records[0]['comment'] = 'comment';
  QUnit.notDeepEqual(moves2, moves, 'clone');
});

test('newMove', 5, function() {
  var records = Kifu.clone(moves.records);

  same(moves.get(1), undefined, 'undefined first move');
  moves.newMove();
  same(moves.get(1), {}, 'defined first move');
  same(moves.get(2), undefined, 'undefined second move');
  moves.newMove();
  same(moves.get(2), undefined, 'undefined second move');
  records.push({});

  // check records
  same(moves.records, records, 'records');
});


})();

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2: */
