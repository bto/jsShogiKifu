(function() {


function areasToHash(areas) {
  var result = {};
  var l = areas.length;
  for (var i = 0; i < l; i++) {
    var area     = areas[i];
    var x        = area[0];
    var y        = area[1];
    result[x]    = result[x] || {};
    result[x][y] = true;
  }
  return result;
}

var Prepare = Kifu.Prepare;

module('Kifu.Prepare');

test('checkFromAreas', 2, function() {
  var suite = Kifu.Suite();

  // +11GI
  suite.cellSet(1, 2, 'GI', true);
  suite.cellSet(2, 1, 'KI', true);
  suite.cellSet(2, 2, 'GI', false);
  var move = {from: {piece: 'GI'}, is_black: true, to: {x: 1, y: 1}};
  same(Prepare.checkFromAreas(suite, move), [[1, 2]], '+11GI');
  suite.cellTrash(1, 2);
  suite.cellTrash(2, 1);
  suite.cellTrash(2, 2);

  // -99KI
  suite.cellSet(8, 8, 'KI', false);
  suite.cellSet(8, 9, 'KI', false);
  suite.cellSet(9, 8, 'KI', false);
  var move = {from: {piece: 'KI'}, is_black: false, to: {x: 9, y: 9}};
  var expected = areasToHash([[8, 8], [8, 9], [9, 8]]);
  var result   = areasToHash(Prepare.checkFromAreas(suite, move));
  same(result, expected, '-99KI');
});

test('checkStandArea', 0, function() {
  var suite = Kifu.Suite();

  suite.standSet('KI', false);
  var move = {from: {piece: 'KI'}, is_black: true, to: {x: 5, y: 5}};
  same(Prepare.checkStandArea(suite, move), null, '+0055KI');
  move.is_black = false;
  same(Prepare.checkStandArea(suite, move), [0, 0], '-0055KI');

  suite.standSet('FU', true);
  suite.cellSet(5, 7, 'FU', true);
  suite.cellSet(4, 3, 'FU', false);
  suite.cellSet(4, 2, 'TO', true);
  var move = {from: {piece: 'FU'}, is_black: true, to: {x: 5, y: 5}};
  same(Prepare.checkStandArea(suite, move), null, '+0055FU');
  move.to.x = 4;
  same(Prepare.checkStandArea(suite, move), [0, 0], '+0045FU');
});

test('findFromAreasFU', 2, function() {
  var suite = Kifu.Suite();

  var move = {is_black: true, to: {x: 5, y: 5}};
  same(Prepare.findFromAreasFU(suite, move), [[5, 6]], 'FU black');

  move.is_black = false;
  same(Prepare.findFromAreasFU(suite, move), [[5, 4]], 'FU white');
});

test('findFromAreasKY', 2, function() {
  var suite = Kifu.Suite();
  suite.cellSet(5, 2, 'KY', false);
  suite.cellSet(5, 8, 'KY', true);

  var move = {is_black: true, to: {x: 5, y: 5}};
  same(Prepare.findFromAreasKY(suite, move), [[5, 8]], 'KY black');

  move.is_black = false;
  same(Prepare.findFromAreasKY(suite, move), [[5, 2]], 'KY white');
});

test('findFromAreasKE', 2, function() {
  var suite = Kifu.Suite();

  var move     = {is_black: true, to: {x: 5, y: 5}};
  var expected = areasToHash([[4, 7], [6, 7]]);
  var result   = areasToHash(Prepare.findFromAreasKE(suite, move));
  same(result, expected, 'KE black');

  move.is_black = false;
  var expected = areasToHash([[4, 3], [6, 3]]);
  var result   = areasToHash(Prepare.findFromAreasKE(suite, move));
  same(result, expected, 'KE white');
});

test('findFromAreasGI', 2, function() {
  var suite = Kifu.Suite();

  // GI
  var move     = {is_black: true, to: {x: 5, y: 5}};
  var expected = areasToHash([[4, 4], [6, 4], [4, 6], [5, 6], [6, 6]]);
  var result   = areasToHash(Prepare.findFromAreasGI(suite, move));
  same(result, expected, 'GI black');

  move.is_black = false;
  var expected  = areasToHash([[4, 6], [6, 6], [4, 4], [5, 4], [6, 4]]);
  var result    = areasToHash(Prepare.findFromAreasGI(suite, move));
  same(result, expected, 'GI white');
});

test('findFromAreas{KI, TO, NY, NK, NG}', 10, function() {
  var suite = Kifu.Suite();

  var move     = {is_black: true, to: {x: 5, y: 5}};
  var expected = areasToHash([[5, 4], [4, 5], [6, 5], [4, 6], [5, 6], [6, 6]]);
  var result   = areasToHash(Prepare.findFromAreasKI(suite, move));
  same(result, expected, 'KI black');
  var result   = areasToHash(Prepare.findFromAreasTO(suite, move));
  same(result, expected, 'TO black');
  var result   = areasToHash(Prepare.findFromAreasNY(suite, move));
  same(result, expected, 'NY black');
  var result   = areasToHash(Prepare.findFromAreasNK(suite, move));
  same(result, expected, 'NK black');
  var result   = areasToHash(Prepare.findFromAreasNG(suite, move));
  same(result, expected, 'NG black');

  move.is_black = false;
  var expected = areasToHash([[5, 6], [4, 5], [6, 5], [4, 4], [5, 4], [6, 4]]);
  var result   = areasToHash(Prepare.findFromAreasKI(suite, move));
  same(result, expected, 'KI white');
  var result   = areasToHash(Prepare.findFromAreasTO(suite, move));
  same(result, expected, 'TO white');
  var result   = areasToHash(Prepare.findFromAreasNY(suite, move));
  same(result, expected, 'NY white');
  var result   = areasToHash(Prepare.findFromAreasNK(suite, move));
  same(result, expected, 'NK white');
  var result   = areasToHash(Prepare.findFromAreasNG(suite, move));
  same(result, expected, 'NG white');
});

test('findFromAreas{KA, UM}', 4, function() {
  var suite = Kifu.Suite();

  suite.cellSet(9, 1, 'KA', false);
  suite.cellSet(8, 8, 'KA', true);
  suite.cellSet(1, 9, 'KA', true);
  var move     = {is_black: true, to: {x: 5, y: 5}};
  var expected = areasToHash([[9, 1], [8, 8], [1, 9]]);
  var result   = areasToHash(Prepare.findFromAreasKA(suite, move));
  same(result, expected, 'KA black');
  var expected = areasToHash([
    [9, 1], [8, 8], [1, 9], [5, 4], [4, 5], [6, 5], [5, 6]]);
  var result   = areasToHash(Prepare.findFromAreasUM(suite, move));
  same(result, expected, 'UM black');

  suite.cellTrash(8, 8);
  suite.cellSet(2, 2, 'KA', false);
  move.is_black = false;
  var expected = areasToHash([[2, 2], [9, 1], [1, 9]]);
  var result   = areasToHash(Prepare.findFromAreasKA(suite, move));
  same(result, expected, 'KA white');
  var expected = areasToHash([
    [2, 2], [9, 1], [1, 9], [5, 4], [4, 5], [6, 5], [5, 6]]);
  var result   = areasToHash(Prepare.findFromAreasUM(suite, move));
  same(result, expected, 'UM white');
  suite.cellTrash(2, 2);
  suite.cellTrash(9, 1);
  suite.cellTrash(1, 9);
});

test('findFromAreas{HI, RY}', 4, function() {
  var suite = Kifu.Suite();

  suite.cellSet(2, 5, 'HI', true);
  suite.cellSet(9, 5, 'HI', true);
  suite.cellSet(5, 9, 'HI', true);
  var move     = {is_black: true, to: {x: 5, y: 5}};
  var expected = areasToHash([[2, 5], [9, 5], [5, 9]]);
  var result   = areasToHash(Prepare.findFromAreasHI(suite, move));
  same(result, expected, 'HI black');
  var expected = areasToHash([
    [2, 5], [9, 5], [5, 9], [4, 4], [4, 6], [6, 4], [6, 6]]);
  var result   = areasToHash(Prepare.findFromAreasRY(suite, move));
  same(result, expected, 'RY black');

  suite.cellTrash(2, 5);
  suite.cellSet(5, 2, 'HI', true);
  move.is_black = false;
  var expected  = areasToHash([[5, 2], [9, 5], [5, 9]]);
  var result    = areasToHash(Prepare.findFromAreasHI(suite, move));
  same(result, expected, 'HI white');
  var expected  = areasToHash([
    [5, 2], [9, 5], [5, 9], [4, 4], [4, 6], [6, 4], [6, 6]]);
  var result    = areasToHash(Prepare.findFromAreasRY(suite, move));
  same(result, expected, 'RY white');
  suite.cellTrash(5, 2);
  suite.cellTrash(9, 5);
  suite.cellTrash(5, 9);
});

test('findFromAreasOU', 2, function() {
  var suite = Kifu.Suite();

  var move     = {is_black: true, to: {x: 5, y: 5}};
  var expected = areasToHash([
    [4, 4], [4, 5], [4, 6], [5, 4], [5, 6], [6, 4], [6, 5], [6, 6]]);
  var result   = areasToHash(Prepare.findFromAreasOU(suite, move));
  same(result, expected, 'OU black');

  move.is_black = false;
  var result   = areasToHash(Prepare.findFromAreasOU(suite, move));
  same(result, expected, 'OU white');
});

test('moveStr', 2, function() {
  var move = {from: {piece: 'FU'}, to: {piece: 'FU', x: 5, y: 7}, put: true}
  same(Prepare.moveStr(move), '５七歩打', '５七歩打');

  var move = {from: {piece: 'GI'}, to: {piece: 'NG'},
    direction: 'left', movement: 'up', is_same_place: true}
  same(Prepare.moveStr(move), '同銀左上成', '同銀左上成');
});

test('prepare', 3, function() {
  var kifu   = Kifu();
  var suite  = kifu.suite_init;
  var moves  = kifu.moves;
  var moves2 = Kifu.clone(moves);

  /*
   * P1-KI-KI-KI
   * P2 *  *  * 
   * P3+GI+GI+GI
   */
  suite.cellSet(9, 1, 'KI', false);
  suite.cellSet(8, 1, 'KI', false);
  suite.cellSet(7, 1, 'KI', false);
  suite.cellSet(9, 3, 'GI', true);
  suite.cellSet(8, 3, 'GI', true);
  suite.cellSet(7, 3, 'GI', true);
  suite.standSet('GI', true);
  // ８二銀左成
  moves.addMove({from: {x: 9, y: 3}, to: {piece: 'NG', x: 8, y: 2}})
  moves2.addMove({
    from: {piece: 'GI', x: 9, y: 3}, to: {piece: 'NG', x: 8, y: 2},
    direction: 'left', is_same_place: false, movement: false, put: false,
    is_black: true, str: '８二銀左成'})
  // 同金右上
  moves.addMove({to: {piece: 'KI', x: 0, y: 0}, direction: 'right'})
  moves2.addMove({
    from: {piece: 'KI', x: 9, y: 1}, to: {piece: 'KI', x: 8, y: 2},
    direction: 'right', is_same_place: true, movement: false, put: false,
    stand: {piece: 'NG', stand: 'GI'}, is_black: false, str: '同金右'})
  // ７二銀打
  moves.addMove({to: {piece: 'GI', x: 7, y: 2}, put: true})
  moves2.addMove({
    from: {piece: 'GI', x: 0, y: 0}, to: {piece: 'GI', x: 7, y: 2},
    direction: false, is_same_place: false, movement: false, put: true,
    is_black: true, str: '７二銀打'})
  Prepare.prepare(kifu);
  same(moves.get(1), moves2.get(1), 'prepare move 1');
  same(moves.get(2), moves2.get(2), 'prepare move 2');
  same(moves.get(3), moves2.get(3), 'prepare move 3');
});

test('prepareFromCell', 12, function() {
  var suite = Kifu.Suite();

  // 55歩
  suite.cellSet(5, 6, 'FU', true);
  var move  = {from: {}, is_black: true, to: {piece: 'FU', x: 5, y: 5}};
  var move2 = {from: {piece: 'FU', x: 5, y: 6}, to: {piece: 'FU', x: 5, y: 5},
    is_black: true, direction: false, movement: false, put: false};
  ok(Prepare.prepareFromCell(suite, move), '55歩');
  same(move, move2, '55歩');
  suite.cellTrash(5, 6);

  // 55歩(打)
  suite.standSet('FU', true);
  var move  = {from: {}, is_black: true, to: {piece: 'FU', x: 5, y: 5}};
  var move2 = {from: {piece: 'FU', x: 0, y: 0}, to: {piece: 'FU', x: 5, y: 5},
    is_black: true, direction: false, movement: false, put: false};
  ok(Prepare.prepareFromCell(suite, move), '55歩(打)');
  same(move, move2, '55歩(打)');
  suite.standTrash('FU', true);

  // 55香打
  suite.cellSet(5, 6, 'KY', true);
  suite.standSet('KY', true);
  var move  = {
    from: {x: 0, y: 0}, is_black: true, to: {piece: 'KY', x: 5, y: 5}};
  var move2 = {from: {piece: 'KY', x: 0, y: 0}, to: {piece: 'KY', x: 5, y: 5},
    is_black: true, direction: false, movement: false, put: true};
  ok(Prepare.prepareFromCell(suite, move), '55香打');
  same(move, move2, '55香打');
  suite.cellTrash(5, 6);
  suite.standTrash('KY', true);

  // 55香
  suite.cellSet(5, 6, 'KY', true);
  suite.standSet('KY', true);
  var move  = {from: {}, is_black: true, to: {piece: 'KY', x: 5, y: 5}};
  var move2 = {from: {piece: 'KY', x: 5, y: 6}, to: {piece: 'KY', x: 5, y: 5},
    is_black: true, direction: false, movement: false, put: false};
  ok(Prepare.prepareFromCell(suite, move), '55香');
  same(move, move2, '55香');
  suite.cellTrash(5, 6);
  suite.standTrash('KY', true);

  // 55銀直
  suite.cellSet(4, 6, 'GI', true);
  suite.cellSet(5, 6, 'GI', true);
  var move  = {from: {}, is_black: true, to: {piece: 'GI', x: 5, y: 5},
    direction: 'straight_up'};
  var move2 = {from: {piece: 'GI', x: 5, y: 6}, to: {piece: 'GI', x: 5, y: 5},
    is_black: true, direction: 'straight_up', movement: false, put: false};
  ok(Prepare.prepareFromCell(suite, move), '55銀直');
  same(move, move2, '55銀直');
  suite.cellTrash(4, 6);
  suite.cellTrash(5, 6);

  // 55銀左
  suite.cellSet(4, 6, 'GI', true);
  suite.cellSet(5, 6, 'GI', true);
  var move  = {
    from: {x: 4, y: 6}, is_black: true, to: {piece: 'GI', x: 5, y: 5}};
  var move2 = {from: {piece: 'GI', x: 4, y: 6}, to: {piece: 'GI', x: 5, y: 5},
    is_black: true, direction: 'right', movement: false, put: false};
  ok(Prepare.prepareFromCell(suite, move), '55銀左');
  same(move, move2, '55銀左');
  suite.cellTrash(4, 6);
  suite.cellTrash(5, 6);
});

test('prepareFromCellByMovement', 52, function() {
  /*
   * P1 * +KI * 
   * P2 *  *  * 
   * P3+KI+KI+KI
   */
  // 82金左
  var move  = {from: {}, is_black: true, to: {x: 8, y: 2}, direction: 'left'};
  var areas = [[9, 3], [8, 1], [8, 3], [7, 3]];
  var move2 = Kifu.clone(move);
  move2.from.x = 9;
  move2.from.y = 3;
  ok(Prepare.prepareFromCellByMovement(move, areas), '82金左');
  same(move, move2, '82金左');

  // 82金直
  move.direction  = 'straight_up';
  move2.direction = 'straight_up';
  move2.from.x    = 8;
  move2.from.y    = 3;
  ok(Prepare.prepareFromCellByMovement(move, areas), '82金直');
  same(move, move2, '82金直');

  // 82金右
  move.direction  = 'right';
  move2.direction = 'right';
  move2.from.x = 7;
  move2.from.y = 3;
  ok(Prepare.prepareFromCellByMovement(move, areas), '82金右');
  same(move, move2, '82金右');

  /*
   * P1-KI-KI-KI
   * P2 *  *  * 
   * P3 * -KI * 
   */
  // 82金右
  var move  = {from: {}, is_black: false, to: {x: 8, y: 2}, direction: 'right'};
  var areas = [[9, 1], [8, 1], [8, 3], [7, 1]];
  var move2 = Kifu.clone(move);
  move2.from.x = 9;
  move2.from.y = 1;
  ok(Prepare.prepareFromCellByMovement(move, areas), '82金右');
  same(move, move2, '82金右');

  // 82金直
  move.direction  = 'straight_up';
  move2.direction = 'straight_up';
  move2.from.x    = 8;
  move2.from.y    = 1;
  ok(Prepare.prepareFromCellByMovement(move, areas), '82金直');
  same(move, move2, '82金直');

  // 82金左
  move.direction  = 'left';
  move2.direction = 'left';
  move2.from.x = 7;
  move2.from.y = 1;
  ok(Prepare.prepareFromCellByMovement(move, areas), '82金左');
  same(move, move2, '82金左');

  /*
   * P1 * +KI *
   * P2 *  * +KI
   * P3+KI *  * 
   */
  // 82金上
  var move     = {from: {}, is_black: true, to: {x: 8, y: 2}, movement: 'up'};
  var areas    = [[9, 3], [8, 1], [7, 2]];
  var move2    = Kifu.clone(move);
  move2.from.x = 9;
  move2.from.y = 3;
  ok(Prepare.prepareFromCellByMovement(move, areas), '82金上');
  same(move, move2, '82金上');

  // 82金寄
  move.movement  = 'horizon';
  move2.movement = 'horizon';
  move2.from.x   = 7;
  move2.from.y   = 2;
  ok(Prepare.prepareFromCellByMovement(move, areas), '82金寄');
  same(move, move2, '82金寄');

  // 82金引
  move.movement  = 'down';
  move2.movement = 'down';
  move2.from.x   = 8;
  move2.from.y   = 1;
  ok(Prepare.prepareFromCellByMovement(move, areas), '82金引');
  same(move, move2, '82金引');

  /*
   * P1-KI *  *
   * P2 *  * -KI
   * P3 * -KI * 
   */
  // 82金上
  var move     = {from: {}, is_black: false, to: {x: 8, y: 2}, movement: 'up'};
  var areas    = [[9, 1], [8, 3], [7, 2]];
  var move2    = Kifu.clone(move);
  move2.from.x = 9;
  move2.from.y = 1;
  ok(Prepare.prepareFromCellByMovement(move, areas), '82金上');
  same(move, move2, '82金上');

  // 82金寄
  move.movement  = 'horizon';
  move2.movement = 'horizon';
  move2.from.x   = 7;
  move2.from.y   = 2;
  ok(Prepare.prepareFromCellByMovement(move, areas), '82金寄');
  same(move, move2, '82金寄');

  // 82金引
  move.movement  = 'down';
  move2.movement = 'down';
  move2.from.x   = 8;
  move2.from.y   = 3;
  ok(Prepare.prepareFromCellByMovement(move, areas), '82金引');
  same(move, move2, '82金引');

  /*
   * P1 * +TO * 
   * P2+TO * +TO
   * P3+TO+TO+TO
   */
  // 82と左寄
  var move     = {
    from: {}, is_black: true, to: {x: 8, y: 2},
    direction: 'left', movement: 'horizon'};
  var areas    = [[9, 2], [9, 3], [8, 1], [8, 3], [7, 2], [7, 3]];
  var move2    = Kifu.clone(move);
  move2.from.x = 9;
  move2.from.y = 2;
  ok(Prepare.prepareFromCellByMovement(move, areas), '82と左寄');
  same(move, move2, '82と左寄');

  // 82と左上
  move.movement  = 'up';
  move2.movement = 'up';
  move2.from.x   = 9;
  move2.from.y   = 3;
  ok(Prepare.prepareFromCellByMovement(move, areas), '82と左上');
  same(move, move2, '82と左上');

  // 82と右上
  move.direction  = 'right';
  move2.direction = 'right';
  move2.from.x    = 7;
  move2.from.y    = 3;
  ok(Prepare.prepareFromCellByMovement(move, areas), '82と右上');
  same(move, move2, '82と右上');

  // 82と右寄
  move.movement  = 'horizon';
  move2.movement = 'horizon';
  move2.from.x   = 7;
  move2.from.y   = 2;
  ok(Prepare.prepareFromCellByMovement(move, areas), '82と右寄');
  same(move, move2, '82と右寄');

  /*
   * P1-GI * -GI
   * P2 *  *  * 
   * P3-GI * -GI
   */
  // 82銀右引
  var move     = {
    from: {}, is_black: false, to: {x: 8, y: 2},
    direction: 'right', movement: 'down'};
  var areas    = [[9, 1], [9, 3], [7, 1], [7, 3]];
  var move2    = Kifu.clone(move);
  move2.from.x = 9;
  move2.from.y = 3;
  ok(Prepare.prepareFromCellByMovement(move, areas), '82銀右引');
  same(move, move2, '82銀右引');

  // 82銀左引
  move.direction  = 'left';
  move2.direction = 'left';
  move2.from.x    = 7;
  move2.from.y    = 3;
  ok(Prepare.prepareFromCellByMovement(move, areas), '82銀左引');
  same(move, move2, '82銀左引');

  /*
   * P1 *  *  * 
   * P2+UM+UM * 
   */
  // 81馬左
  var move  =
    {from: {piece: 'UM'}, is_black: true, to: {x: 8, y: 1}, direction: 'left'};
  var areas = [[9, 2], [8, 2]];
  var move2 = Kifu.clone(move);
  move2.from.x = 9;
  move2.from.y = 2;
  ok(Prepare.prepareFromCellByMovement(move, areas), '81馬左');
  same(move, move2, '81馬左');

  // 81馬右
  move.direction  = 'right';
  move2.direction = 'right';
  move2.from.x    = 8;
  move2.from.y    = 2;
  ok(Prepare.prepareFromCellByMovement(move, areas), '81馬右');
  same(move, move2, '81馬右');

  /*
   * P1-UM-UM * 
   * P2 *  *  * 
   */
  // 82馬右
  var move  = {
    from: {piece: 'UM'}, is_black: false, to: {x: 8, y: 2}, direction: 'right'};
  var areas = [[9, 1], [8, 1]];
  var move2 = Kifu.clone(move);
  move2.from.x = 9;
  move2.from.y = 1;
  ok(Prepare.prepareFromCellByMovement(move, areas), '82馬右');
  same(move, move2, '82馬右');

  // 82馬左
  move.direction  = 'left';
  move2.direction = 'left';
  move2.from.x    = 8;
  move2.from.y    = 1;
  ok(Prepare.prepareFromCellByMovement(move, areas), '82馬左');
  same(move, move2, '82馬左');

  /*
   * P1 *  *  * 
   * P2+RY+RY * 
   */
  // 81竜左
  var move  =
    {from: {piece: 'RY'}, is_black: true, to: {x: 8, y: 1}, direction: 'left'};
  var areas = [[9, 2], [8, 2]];
  var move2 = Kifu.clone(move);
  move2.from.x = 9;
  move2.from.y = 2;
  ok(Prepare.prepareFromCellByMovement(move, areas), '81竜左');
  same(move, move2, '81竜左');

  // 81竜右
  move.direction  = 'right';
  move2.direction = 'right';
  move2.from.x    = 8;
  move2.from.y    = 2;
  ok(Prepare.prepareFromCellByMovement(move, areas), '81竜右');
  same(move, move2, '81竜右');

  /*
   * P1-RY-RY * 
   * P2 *  *  * 
   */
  // 82竜右
  var move  = {
    from: {piece: 'RY'}, is_black: false, to: {x: 8, y: 2}, direction: 'right'};
  var areas = [[9, 1], [8, 1]];
  var move2 = Kifu.clone(move);
  move2.from.x = 9;
  move2.from.y = 1;
  ok(Prepare.prepareFromCellByMovement(move, areas), '82竜右');
  same(move, move2, '82竜右');

  // 82竜左
  move.direction  = 'left';
  move2.direction = 'left';
  move2.from.x    = 8;
  move2.from.y    = 1;
  ok(Prepare.prepareFromCellByMovement(move, areas), '82竜左');
  same(move, move2, '82竜左');
});

test('prepareFromPiece', 6, function() {
  var suite = Kifu.Suite();

  var move  = {from: {piece: 'FU'}};
  var move2 = Kifu.clone(move);
  ok(Prepare.prepareFromPiece(suite, move));
  same(move, move2);

  var move  = {from: {}, to: {piece: 'FU'}};
  var move2 = Kifu.clone(move);
  move2.from.piece = 'FU';
  ok(Prepare.prepareFromPiece(suite, move));
  same(move, move2);

  suite.cellSet(5, 4, 'FU', true);
  var move  = {from: {x: 5, y: 4}, to: {piece: 'TO'}};
  var move2 = Kifu.clone(move);
  move2.from.piece = 'FU';
  ok(Prepare.prepareFromPiece(suite, move));
  same(move, move2);
});

test('prepareInfo', 2, function() {
  var info  = {};
  var info2 = {player_start: 'black'};
  Prepare.prepareInfo(info);
  same(info, info2);

  var info  = {player_start: 'white'};
  var info2 = {player_start: 'white'};
  Prepare.prepareInfo(info);
  same(info, info2);
});

test('prepareMovement', 52, function() {
  /*
   * P1 * +KI * 
   * P2 *  *  * 
   * P3+KI+KI+KI
   */
  // 82金左
  var move  = {from: {x: 9, y: 3}, is_black: true, to: {x: 8, y: 2}};
  var areas = [[9, 3], [8, 1], [8, 3], [7, 3]];
  var move2 = Kifu.clone(move);
  move2.direction = 'left';
  move2.movement  = false;
  ok(Prepare.prepareMovement(move, areas), '82金左');
  same(move, move2, '82金左');

  // 82金直
  move.from.x = move2.from.x = 8;
  move.from.y = move2.from.y = 3;
  move2.direction = 'straight_up';
  move2.movement  = false;
  ok(Prepare.prepareMovement(move, areas), '82金直');
  same(move, move2, '82金直');

  // 82金右
  move.from.x = move2.from.x = 7;
  move.from.y = move2.from.y = 3;
  move2.direction = 'right';
  move2.movement  = false;
  ok(Prepare.prepareMovement(move, areas), '82金右');
  same(move, move2, '82金右');

  /*
   * P1-KI-KI-KI
   * P2 *  *  * 
   * P3 * -KI * 
   */
  // 82金右
  var move  = {from: {x: 9, y: 1}, is_black: false, to: {x: 8, y: 2}};
  var areas = [[9, 1], [8, 1], [8, 3], [7, 1]];
  var move2 = Kifu.clone(move);
  move2.direction = 'right';
  move2.movement  = false;
  ok(Prepare.prepareMovement(move, areas), '82金右');
  same(move, move2, '82金右');

  // 82金直
  move.from.x = move2.from.x = 8;
  move.from.y = move2.from.y = 1;
  move2.direction = 'straight_up';
  move2.movement  = false;
  ok(Prepare.prepareMovement(move, areas), '82金直');
  same(move, move2, '82金直');

  // 82金左
  move.from.x = move2.from.x = 7;
  move.from.y = move2.from.y = 1;
  move2.direction = 'left';
  move2.movement  = false;
  ok(Prepare.prepareMovement(move, areas), '82金左');
  same(move, move2, '82金左');

  /*
   * P1 * +KI *
   * P2 *  * +KI
   * P3+KI *  * 
   */
  // 82金上
  var move     = {from: {x: 9, y: 3}, is_black: true, to: {x: 8, y: 2}};
  var areas    = [[9, 3], [8, 1], [7, 2]];
  var move2    = Kifu.clone(move);
  move2.direction = false;
  move2.movement  = 'up';
  ok(Prepare.prepareMovement(move, areas), '82金上');
  same(move, move2, '82金上');

  // 82金寄
  move.from.x = move2.from.x = 7;
  move.from.y = move2.from.y = 2;
  move2.direction = false;
  move2.movement  = 'horizon';
  ok(Prepare.prepareMovement(move, areas), '82金寄');
  same(move, move2, '82金寄');

  // 82金引
  move.from.x = move2.from.x = 8;
  move.from.y = move2.from.y = 1;
  move2.direction = false;
  move2.movement  = 'down';
  ok(Prepare.prepareMovement(move, areas), '82金引');
  same(move, move2, '82金引');

  /*
   * P1-KI *  *
   * P2 *  * -KI
   * P3 * -KI * 
   */
  // 82金上
  var move     = {from: {x: 9, y: 1}, is_black: false, to: {x: 8, y: 2}};
  var areas    = [[9, 1], [8, 3], [7, 2]];
  var move2    = Kifu.clone(move);
  move2.direction = false;
  move2.movement  = 'up';
  ok(Prepare.prepareMovement(move, areas), '82金上');
  same(move, move2, '82金上');

  // 82金寄
  move.from.x = move2.from.x = 7;
  move.from.y = move2.from.y = 2;
  move2.direction = false;
  move2.movement  = 'horizon';
  ok(Prepare.prepareMovement(move, areas), '82金寄');
  same(move, move2, '82金寄');

  // 82金引
  move.from.x = move2.from.x = 8;
  move.from.y = move2.from.y = 3;
  move2.direction = false;
  move2.movement  = 'down';
  ok(Prepare.prepareMovement(move, areas), '82金引');
  same(move, move2, '82金引');

  /*
   * P1 * +TO * 
   * P2+TO * +TO
   * P3+TO+TO+TO
   */
  // 82と左寄
  var move     = {from: {x: 9, y: 2}, is_black: true, to: {x: 8, y: 2}};
  var areas    = [[9, 2], [9, 3], [8, 1], [8, 3], [7, 2], [7, 3]];
  var move2    = Kifu.clone(move);
  move2.direction = 'left';
  move2.movement  = 'horizon';
  ok(Prepare.prepareMovement(move, areas), '82と左寄');
  same(move, move2, '82と左寄');

  // 82と左上
  move.from.x = move2.from.x = 9;
  move.from.y = move2.from.y = 3;
  move2.direction = 'left';
  move2.movement  = 'up';
  ok(Prepare.prepareMovement(move, areas), '82と左上');
  same(move, move2, '82と左上');

  // 82と右上
  move.from.x = move2.from.x = 7;
  move.from.y = move2.from.y = 3;
  move2.direction = 'right';
  move2.movement  = 'up';
  ok(Prepare.prepareMovement(move, areas), '82と右上');
  same(move, move2, '82と右上');

  // 82と右寄
  move.from.x = move2.from.x = 7;
  move.from.y = move2.from.y = 2;
  move2.direction = 'right';
  move2.movement  = 'horizon';
  ok(Prepare.prepareMovement(move, areas), '82と右寄');
  same(move, move2, '82と右寄');

  /*
   * P1-GI * -GI
   * P2 *  *  * 
   * P3-GI * -GI
   */
  // 82銀右引
  var move     = {from: {x: 9, y: 3}, is_black: false, to: {x: 8, y: 2}};
  var areas    = [[9, 1], [9, 3], [7, 1], [7, 3]];
  var move2    = Kifu.clone(move);
  move2.direction = 'right';
  move2.movement  = 'down';
  ok(Prepare.prepareMovement(move, areas), '82銀右引');
  same(move, move2, '82銀右引');

  // 82銀左引
  move.from.x = move2.from.x = 7;
  move.from.y = move2.from.y = 3;
  move2.direction = 'left';
  move2.movement  = 'down';
  ok(Prepare.prepareMovement(move, areas), '82銀左引');
  same(move, move2, '82銀左引');

  /*
   * P1 *  *  * 
   * P2+UM+UM * 
   */
  // 81馬左
  var move  =
    {from: {piece: 'UM', x: 9, y: 2}, is_black: true, to: {x: 8, y: 1}};
  var areas = [[9, 2], [8, 2]];
  var move2 = Kifu.clone(move);
  move2.direction = 'left';
  move2.movement  = false;
  ok(Prepare.prepareMovement(move, areas), '81馬左');
  same(move, move2, '81馬左');

  // 81馬右
  move.from.x = move2.from.x = 8;
  move.from.y = move2.from.y = 2;
  move2.direction = 'right';
  move2.movement  = false;
  ok(Prepare.prepareMovement(move, areas), '81馬右');
  same(move, move2, '81馬右');

  /*
   * P1-UM-UM * 
   * P2 *  *  * 
   */
  // 82馬右
  var move  = {
    from: {piece: 'UM', x: 9, y: 1}, is_black: false, to: {x: 8, y: 2}};
  var areas = [[9, 1], [8, 1]];
  var move2 = Kifu.clone(move);
  move2.direction = 'right';
  move2.movement  = false;
  ok(Prepare.prepareMovement(move, areas), '82馬右');
  same(move, move2, '82馬右');

  // 82馬左
  move.from.x = move2.from.x = 8;
  move.from.y = move2.from.y = 1;
  move2.direction = 'left';
  move2.movement  = false;
  ok(Prepare.prepareMovement(move, areas), '82馬左');
  same(move, move2, '82馬左');

  /*
   * P1 *  *  * 
   * P2+RY+RY * 
   */
  // 81竜左
  var move  =
    {from: {piece: 'RY', x: 9, y: 2}, is_black: true, to: {x: 8, y: 1}};
  var areas = [[9, 2], [8, 2]];
  var move2 = Kifu.clone(move);
  move2.direction = 'left';
  move2.movement  = false;
  ok(Prepare.prepareMovement(move, areas), '81竜左');
  same(move, move2, '81竜左');

  // 81竜右
  move.from.x = move2.from.x = 8;
  move.from.y = move2.from.y = 2;
  move2.direction = 'right';
  move2.movement  = false;
  ok(Prepare.prepareMovement(move, areas), '81竜右');
  same(move, move2, '81竜右');

  /*
   * P1-RY-RY * 
   * P2 *  *  * 
   */
  // 82竜右
  var move  = {
    from: {piece: 'RY', x: 9, y: 1}, is_black: false, to: {x: 8, y: 2}};
  var areas = [[9, 1], [8, 1]];
  var move2 = Kifu.clone(move);
  move2.direction = 'right';
  move2.movement  = false;
  ok(Prepare.prepareMovement(move, areas), '82竜右');
  same(move, move2, '82竜右');

  // 82竜左
  move.from.x = move2.from.x = 8;
  move.from.y = move2.from.y = 1;
  move2.direction = 'left';
  move2.movement  = false;
  ok(Prepare.prepareMovement(move, areas), '82竜左');
  same(move, move2, '82竜左');
});


})();

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2: */
