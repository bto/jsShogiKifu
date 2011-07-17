(function() {


var suite;

module('Kifu.Suite', {
  setup: function() {
    suite = Kifu.Suite();
  }
});

test('boardEmpty', 1, function() {
  var board = {};
  for (var i = 1; i <= 9; i++) {
    board[i] = {}
    for (var j = 1; j <= 9; j++) {
      board[i][j] = null;
    }
  };
  same(Kifu.Suite.boardEmpty(), board, 'boardEmpty');
});

test('piecesDefault', 1, function() {
  var pieces = {FU: 18, KY: 4, KE: 4, GI: 4, KI: 4, KA: 2, HI: 2, OU: 2};
  same(Kifu.Suite.piecesDefault(), pieces, 'piecesDefault');
});

test('standEmpty', 1, function() {
  var stand = {FU: 0, KY: 0, KE: 0, GI: 0, KI: 0, KA: 0, HI: 0, OU: 0};
  same(Kifu.Suite.standEmpty(), stand, 'standEmpty');
});

test('initialization', 3, function() {
  var stand = {black: Kifu.Suite.standEmpty(), white: Kifu.Suite.standEmpty()};
  same(suite.board,  Kifu.Suite.boardEmpty(), 'board');
  same(suite.pieces, Kifu.Suite.piecesDefault(), 'pieces');
  same(suite.stand,  stand, 'stand');
});

test('cellDeploy, cellRemove', 34, function() {
  var board  = Kifu.clone(suite.board);
  var pieces = Kifu.clone(suite.pieces);
  var stand  = Kifu.clone(suite.stand);

  // deploy +18FU
  board[1][8] = {is_black: true, piece: 'FU'};
  pieces['FU'] = 17;
  ok(suite.cellDeploy(1, 8, 'FU', true), 'deploy +18FU');
  same(suite.board,  board,  'deploy +18FU board');
  same(suite.pieces, pieces, 'deploy +18FU pieces');
  same(suite.stand,  stand,  'deploy +18FU stand');

  // deploy -73KA
  board[7][3] = {is_black: false, piece: 'KA'};
  pieces['KA'] = 1;
  ok(suite.cellDeploy(7, 3, 'KA', false), 'deploy -73KA' );
  same(suite.board,  board,  'deploy -73KA board');
  same(suite.pieces, pieces, 'deploy -73KA pieces');
  same(suite.stand,  stand,  'deploy -73KA stand');

  // deploy +73KA fail
  same(suite.cellDeploy(7, 3, 'KA', true), false, 'deploy +73KA');
  same(suite.board,  board,  'deploy +73KA board');
  same(suite.pieces, pieces, 'deploy +73KA pieces');
  same(suite.stand,  stand,  'deploy +73KA stand');

  // deploy +74UM: success, deploy +75KA: fail(lack of pieces)
  board[7][4] = {is_black: true, piece: 'UM'};
  pieces['KA'] = 0;
  ok(suite.cellDeploy(7, 4, 'UM', true), 'deploy +74UM');
  same(suite.cellDeploy(7, 5, 'KA', false), false, 'deploy +75KA');
  same(suite.board,  board,  'deploy +74UM board');
  same(suite.pieces, pieces, 'deploy +74UM pieces');
  same(suite.stand,  stand,  'deploy +74UM stand');

  // remove 18FU
  board[1][8] = null;
  pieces['FU'] = 18;
  ok(suite.cellRemove(1, 8, 'FU'), 'remove 18FU');
  same(suite.board,  board,  'remove 18FU board');
  same(suite.pieces, pieces, 'remove 18FU pieces');
  same(suite.stand,  stand,  'remove 18FU stand');

  // remove 73: success, remove 73: fail
  board[7][3] = null;
  pieces['KA'] = 1;
  ok(suite.cellRemove(7, 3), 'remove 73');
  same(suite.cellRemove(7, 3), false, 'remove 73');
  same(suite.board,  board,  'remove 73 board');
  same(suite.pieces, pieces, 'remove 73 pieces');
  same(suite.stand,  stand,  'remove 73 stand');

  // remove 74HI: fail
  same(suite.cellRemove(7, 4, 'HI'), false, 'remove 74HI');
  same(suite.board,  board,  'remove 74HI board');
  same(suite.pieces, pieces, 'remove 74HI pieces');
  same(suite.stand,  stand,  'remove 74HI stand');

  // remove 74UM
  board[7][4] = null;
  pieces['KA'] = 2;
  ok(suite.cellRemove(7, 4, 'UM'), 'remove 74UM');
  same(suite.board,  board,  'remove 74UM board');
  same(suite.pieces, pieces, 'remove 74UM pieces');
  same(suite.stand,  stand,  'remove 74UM stand');
});

test('cellGet, cellSet, cellTrash', 10, function() {
  // +26KY
  var piece = {is_black: true, piece: 'KY'};
  same(suite.cellGet(2, 6), null, 'get 26');
  ok(suite.cellSet(2, 6, 'KY', true), 'set +26KY');
  same(suite.cellGet(2, 6), piece, 'get 26');

  // -26HI
  var piece = {is_black: false, piece: 'HI'};
  ok(suite.cellSet(2, 6, 'HI', false), 'set -26HI');
  same(suite.cellGet(2, 6), piece, 'get 26');
  same(suite.cellTrash(2, 6, 'KA'), false, 'trash 26KA');
  same(suite.cellGet(2, 6), piece, 'get 26');
  ok(suite.cellTrash(2, 6), 'trash 26');
  same(suite.cellGet(2, 6), null, 'get 26');
  same(suite.cellTrash(2, 6), false, 'trash 26');
});

test('clone', 2, function() {
  var suite2 = suite.clone();
  same(suite2, suite, 'clone');
  suite2.stand['black']['FU'] = 1;
  QUnit.notDeepEqual(suite2, suite, 'clone');
});

test('hirate', 4, function() {
  var board = {
    1: {
      1: {is_black: false, piece: 'KY'},
      2: null,
      3: {is_black: false, piece: 'FU'},
      4: null,
      5: null,
      6: null,
      7: {is_black: true, piece: 'FU'},
      8: null,
      9: {is_black: true, piece: 'KY'}},
    2: {
      1: {is_black: false, piece: 'KE'},
      2: {is_black: false, piece: 'KA'},
      3: {is_black: false, piece: 'FU'},
      4: null,
      5: null,
      6: null,
      7: {is_black: true, piece: 'FU'},
      8: {is_black: true, piece: 'HI'},
      9: {is_black: true, piece: 'KE'}},
    3: {
      1: {is_black: false, piece: 'GI'},
      2: null,
      3: {is_black: false, piece: 'FU'},
      4: null,
      5: null,
      6: null,
      7: {is_black: true, piece: 'FU'},
      8: null,
      9: {is_black: true, piece: 'GI'}},
    4: {
      1: {is_black: false, piece: 'KI'},
      2: null,
      3: {is_black: false, piece: 'FU'},
      4: null,
      5: null,
      6: null,
      7: {is_black: true, piece: 'FU'},
      8: null,
      9: {is_black: true, piece: 'KI'}},
    5: {
      1: {is_black: false, piece: 'OU'},
      2: null,
      3: {is_black: false, piece: 'FU'},
      4: null,
      5: null,
      6: null,
      7: {is_black: true, piece: 'FU'},
      8: null,
      9: {is_black: true, piece: 'OU'}},
    6: {
      1: {is_black: false, piece: 'KI'},
      2: null,
      3: {is_black: false, piece: 'FU'},
      4: null,
      5: null,
      6: null,
      7: {is_black: true, piece: 'FU'},
      8: null,
      9: {is_black: true, piece: 'KI'}},
    7: {
      1: {is_black: false, piece: 'GI'},
      2: null,
      3: {is_black: false, piece: 'FU'},
      4: null,
      5: null,
      6: null,
      7: {is_black: true, piece: 'FU'},
      8: null,
      9: {is_black: true, piece: 'GI'}},
    8: {
      1: {is_black: false, piece: 'KE'},
      2: {is_black: false, piece: 'HI'},
      3: {is_black: false, piece: 'FU'},
      4: null,
      5: null,
      6: null,
      7: {is_black: true, piece: 'FU'},
      8: {is_black: true, piece: 'KA'},
      9: {is_black: true, piece: 'KE'}},
    9: {
      1: {is_black: false, piece: 'KY'},
      2: null,
      3: {is_black: false, piece: 'FU'},
      4: null,
      5: null,
      6: null,
      7: {is_black: true, piece: 'FU'},
      8: null,
      9: {is_black: true, piece: 'KY'}}
  };

  var pieces = {
    FU: 0,
    KY: 0,
    KE: 0,
    GI: 0,
    KI: 0,
    KA: 0,
    HI: 0,
    OU: 0};

  var stand = Kifu.clone(suite.stand);

  ok(suite.hirate(), 'hirate');
  same(suite.board,  board,  'hirate board');
  same(suite.pieces, pieces, 'hirate pieces');
  same(suite.stand,  stand,  'hirate stand');
});

test('move, moveReverse', 32, function() {
  suite.hirate();
  var board  = Kifu.clone(suite.board);
  var pieces = Kifu.clone(suite.pieces);
  var stand  = Kifu.clone(suite.stand);
  var states = [];

  // +2726FU
  board[2][7] = null;
  board[2][6] = {is_black: true, piece: 'FU'};
  states.push({
    title:  '+2726FU',
    board:  Kifu.clone(board),
    pieces: Kifu.clone(pieces),
    stand:  Kifu.clone(stand),
    move:   {
      is_black: true,
      from:     {piece: 'FU', x: 2, y: 7},
      to:       {piece: 'FU', x: 2, y: 6}}});

  // -8288RY
  board[8][2] = null;
  board[8][8] = {is_black: false, piece: 'RY'};
  stand['white']['KA'] = 1;
  states.push({
    title:  '+8288RY',
    board:  Kifu.clone(board),
    pieces: Kifu.clone(pieces),
    stand:  Kifu.clone(stand),
    move:   {
      is_black: false,
      stand:    {piece: 'KA', stand: 'KA'},
      from:     {piece: 'HI', x: 8, y: 2},
      to:    {piece: 'RY', x: 8, y: 8}}});

  // +7988GI
  board[7][9] = null;
  board[8][8] = {is_black: true, piece: 'GI'};
  stand['black']['HI'] = 1;
  states.push({
    title:  '+7988GI',
    board:  Kifu.clone(board),
    pieces: Kifu.clone(pieces),
    stand:  Kifu.clone(stand),
    move:  {
      is_black: true,
      stand:    {piece: 'RY', stand: 'HI'},
      from:     {piece: 'GI', x: 7, y: 9},
      to:       {piece: 'GI', x: 8, y: 8}}});

  // -0055KA
  board[5][5] = {is_black: false, piece: 'KA'};
  stand['white']['KA'] = 0;
  states.push({
    title:  '-0055KA',
    board:  Kifu.clone(board),
    pieces: Kifu.clone(pieces),
    stand:  Kifu.clone(stand),
    move:   {
      is_black: false,
      from:     {piece: 'KA', x: 0, y: 0},
      to:       {piece: 'KA', x: 5, y: 5}}});

  for (var i in states) {
    var state = states[i];
    var title = state['title'];
    ok(suite.move(state['move']), title);
    same(suite.board,  state['board'],  title+' board');
    same(suite.pieces, state['pieces'], title+' pieces');
    same(suite.stand,  state['stand'],  title+' stand');
  }

  for (var i = states.length-1; 0 <= i; i--) {
    var state      = states[i];
    var state_prev = states[i-1];
    var title      = state['title'];

    if (!state_prev) {
      var b = Kifu.Suite().hirate();
      state_prev = {
        board:  b.board,
        pieces: b.pieces,
        stand:  b.stand};
    }

    ok(suite.moveReverse(state['move']), 'reverse '+title);
    same(suite.board,  state_prev['board'],  'reverse '+title+' board');
    same(suite.pieces, state_prev['pieces'], 'reverse '+title+' pieces');
    same(suite.stand,  state_prev['stand'],  'reverse '+title+' stand');
  }
});

test('standDeploy, standRemove', 16, function() {
  var pieces = Kifu.clone(suite.pieces);
  var stand  = Kifu.clone(suite.stand);

  // +KA
  pieces['KA'] = 1;
  stand['black']['KA'] = 1;
  ok(suite.standDeploy('KA', true), '+KA');
  same(suite.pieces, pieces, '+KA pieces');
  same(suite.stand,  stand,  '+KA stand');

  // -KA
  pieces['KA'] = 0;
  stand['white']['KA'] = 1;
  ok(suite.standDeploy('KA', false), '-KA');
  same(suite.standDeploy('KA', false), false, '-KA');
  same(suite.pieces, pieces, '-KA pieces');
  same(suite.stand,  stand,  '-KA stand');

  // +AL
  pieces = Kifu.Suite.standEmpty();
  pieces['OU'] = 2;
  stand['black'] = Kifu.Suite.piecesDefault();
  stand['black']['KA'] = 1;
  stand['black']['OU'] = 0;
  ok(suite.standDeploy('AL', true), '+AL');
  same(suite.pieces, pieces, '+AL pieces');
  same(suite.stand,  stand,  '+AL stand');

  // remove -KA
  stand['white']['KA'] = 0;
  ok(suite.standRemove('KA', false), 'remove -KA');
  same(suite.stand, stand, 'remove -KA stand');

  // remove +KA
  stand['black']['KA'] = 0;
  ok(suite.standRemove('KA', true), 'remove +KA');
  same(suite.standRemove('KA', true), false, 'remove +KA');
  same(suite.stand, stand, 'remove +KA stand');
  same(suite.standRemove('KA', true), false, 'remove +KA');
});

test('standSet, standTrash', 9, function() {
  var stand = Kifu.clone(suite.stand);

  // +FU
  stand['black']['FU'] = 1;
  ok(suite.standSet('FU', true), '+FU');
  same(suite.stand, stand, '+FU stand');

  // -KY
  stand['white']['KY'] = 1;
  ok(suite.standSet('KY', false), '-KY');
  same(suite.stand, stand, '-KY stand');

  // trash -KY
  stand['white']['KY'] = 0;
  ok(suite.standTrash('KY', false), 'trash -KY');
  same(suite.stand, stand, 'trash -KY stand');

  // trash +FU
  stand['black']['FU'] = 0;
  ok(suite.standTrash('FU', true), 'trash +FU');
  same(suite.stand, stand, 'trash +FU stand');
  same(suite.standTrash('FU', true), false, 'trash +FU');
});


})();

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2: */
