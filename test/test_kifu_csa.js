(function() {


var kifu_obj;

module('Kifu.Csa', {
  setup: function() {
    kifu_obj = Kifu();
  }
});

test('parse version', 4, function() {
  var kifu = kifu_obj.kifu();
  var info = kifu['info'];

  // version 2
  ok(Kifu.Csa.parseByLine('V2', kifu), 'parse version 2');
  same(info['version'], '2', 'check version 2');

  // version 2.2
  ok(Kifu.Csa.parseByLine('V2.2', kifu), 'parse version 2.2');
  same(info['version'], '2.2', 'check version 2.2');
});

test('parse player', 4, function() {
  var kifu = kifu_obj.kifu();
  var info = kifu['info'];

  // black player
  ok(Kifu.Csa.parseByLine('N+大山康晴', kifu), 'parse black player');
  same(info['player_black'], '大山康晴', 'check black player');

  // white player
  ok(Kifu.Csa.parseByLine('N-升田幸三', kifu), 'parse white player');
  same(info['player_white'], '升田幸三', 'check white player');
});

test('parse info', 18, function() {
  var kifu = kifu_obj.kifu();
  var info = kifu['info'];

  // EVENT
  ok(Kifu.Csa.parseByLine('$EVENT:名人戦', kifu), 'parse info event');
  same(info['event'], '名人戦', 'check info event');

  // SITE
  ok(Kifu.Csa.parseByLine('$SITE:陣屋', kifu), 'parse info site');
  same(info['site'], '陣屋', 'check info site');

  // START_TIME
  var start_time = new Date(2011, 3, 7, 9, 45, 10);
  ok(Kifu.Csa.parseByLine('$START_TIME:2011/04/07 09:45:10', kifu), 'parse start_time');
  same(info['start_time'], start_time, 'check info start_time');

  // START_TIME 2
  var start_time = new Date(2010, 9, 25);
  ok(Kifu.Csa.parseByLine('$START_TIME:2010/10/25', kifu), 'parse start_time 2');
  same(info['start_time'], start_time, 'check info start_time 2');

  // END_TIME
  var end_time = new Date(2011, 3, 8, 10, 20, 30);
  ok(Kifu.Csa.parseByLine('$END_TIME:2011/04/08 10:20:30', kifu), 'parse end_time');
  same(info['end_time'], end_time, 'check info end_time');

  // END_TIME 2
  var end_time = new Date(2010, 9, 26);
  ok(Kifu.Csa.parseByLine('$END_TIME:2010/10/26', kifu), 'parse end_time 2');
  same(info['end_time'], end_time, 'check info end_time 2');

  // TIME_LIMIT
  ok(Kifu.Csa.parseByLine('$TIME_LIMIT:06:00+60', kifu), 'parse time_limit');
  same(info['time_limit'], {allotted: 360, extra: 60}, 'check time_limit');

  // TIME_LIMIT 2
  ok(Kifu.Csa.parseByLine('$TIME_LIMIT:00:00+00', kifu), 'parse time_limit 2');
  same(info['time_limit'], {allotted: 0, extra: 0}, 'check time_limit 2');

  // OPENING
  ok(Kifu.Csa.parseByLine('$OPENING:相矢倉', kifu), 'parse info opening');
  same(info['opening'], '相矢倉', 'check info opening');
});

test('parse initial board hirate', 4, function() {
  var kifu  = kifu_obj.kifu();
  var board = Kifu.Board().hirate();

  // hirate
  ok(Kifu.Csa.parseByLine('PI', kifu), 'parse hirate');
  same(kifu['board'], board, 'check hirate board');

  // hirate komaochi
  kifu['board'] = Kifu.Board();
  board.cellRemove(8, 2, 'HI');
  board.cellRemove(2, 2, 'KA');
  ok(Kifu.Csa.parseByLine('PI82HI22KA', kifu), 'parse hirate komaochi');
  same(kifu['board'], board, 'check hirate komaochi board');
});

test('parse initial board all', 16, function() {
  var kifu  = kifu_obj.kifu();
  var board = Kifu.Board();

  // 1st line
  board.cellDeploy(9, 1, 'KY', false);
  board.cellDeploy(8, 1, 'KE', false);
  board.cellDeploy(7, 1, 'GI', false);
  board.cellDeploy(6, 1, 'KI', false);
  board.cellDeploy(5, 1, 'OU', false);
  board.cellDeploy(4, 1, 'KI', false);
  board.cellDeploy(3, 1, 'GI', false);
  board.cellDeploy(2, 1, 'KE', false);
  var line = 'P1-KY-KE-GI-KI-OU-KI-GI-KE * ';
  ok(Kifu.Csa.parseByLine(line, kifu), 'parse 1st line');
  same(kifu['board'], board, 'check 1st line');

  // 2nd line
  board.cellDeploy(8, 2, 'HI', false);
  var line = 'P2 * -HI *  *  *  *  *  *  * ';
  ok(Kifu.Csa.parseByLine(line, kifu), 'parse 2nd line');
  same(kifu['board'], board, 'check 2nd line');

  // 3rd line
  board.cellDeploy(9, 3, 'FU', false);
  board.cellDeploy(8, 3, 'FU', false);
  board.cellDeploy(7, 3, 'FU', false);
  board.cellDeploy(6, 3, 'FU', false);
  board.cellDeploy(5, 3, 'FU', false);
  board.cellDeploy(4, 3, 'FU', false);
  board.cellDeploy(3, 3, 'FU', false);
  board.cellDeploy(2, 3, 'FU', false);
  board.cellDeploy(1, 3, 'FU', false);
  var line = 'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU';
  ok(Kifu.Csa.parseByLine(line, kifu), 'parse 3rd line');
  same(kifu['board'], board, 'check 3rd line');

  // 4-6 line
  var line = 'P4 *  *  *  *  *  *  *  *  * ';
  ok(Kifu.Csa.parseByLine(line, kifu), 'parse 4th line');
  var line = 'P5 *  *  *  *  *  *  *  *  * ';
  ok(Kifu.Csa.parseByLine(line, kifu), 'parse 5th line');
  var line = 'P6 *  *  *  *  *  *  *  *  * ';
  ok(Kifu.Csa.parseByLine(line, kifu), 'parse 6th line');
  same(kifu['board'], board, 'check 4-6 line');

  // 7th line
  board.cellDeploy(9, 7, 'FU', true);
  board.cellDeploy(8, 7, 'FU', true);
  board.cellDeploy(7, 7, 'FU', true);
  board.cellDeploy(6, 7, 'FU', true);
  board.cellDeploy(5, 7, 'FU', true);
  board.cellDeploy(4, 7, 'FU', true);
  board.cellDeploy(3, 7, 'FU', true);
  board.cellDeploy(2, 7, 'FU', true);
  board.cellDeploy(1, 7, 'FU', true);
  var line = 'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU';
  ok(Kifu.Csa.parseByLine(line, kifu), 'parse 7th line');
  same(kifu['board'], board, 'check 7th line');

  // 8th line
  board.cellDeploy(8, 8, 'KA', true);
  board.cellDeploy(2, 8, 'HI', true);
  var line = 'P8 * +KA *  *  *  *  * +HI * ';
  ok(Kifu.Csa.parseByLine(line, kifu), 'parse 8th line');
  same(kifu['board'], board, 'check 8th line');

  // 9th line
  board.cellDeploy(9, 9, 'KY', true);
  board.cellDeploy(8, 9, 'KE', true);
  board.cellDeploy(7, 9, 'GI', true);
  board.cellDeploy(6, 9, 'KI', true);
  board.cellDeploy(5, 9, 'OU', true);
  board.cellDeploy(4, 9, 'KI', true);
  board.cellDeploy(3, 9, 'GI', true);
  board.cellDeploy(2, 9, 'KE', true);
  board.cellDeploy(1, 9, 'KY', true);
  var line = 'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY';
  ok(Kifu.Csa.parseByLine(line, kifu), 'parse 9th line');
  same(kifu['board'], board, 'check 9th line');
});

test('parse initial board each', 6, function() {
  var kifu  = kifu_obj.kifu();
  var board = Kifu.Board();

  // P+63RY00KI
  board.cellDeploy(6, 3, 'RY', true);
  board.standDeploy('KI', true);
  ok(Kifu.Csa.parseByLine('P+63RY00KI', kifu), 'P+63RY00KI');
  same(kifu['board'], board, 'P+63RY00KI board');

  // P+00KI
  board.standDeploy('KI', true);
  ok(Kifu.Csa.parseByLine('P+00KI', kifu), 'P+00KI');
  same(kifu['board'], board, 'P+00KI board');

  // P-42OU33GI22KI23FU00AL
  board.cellDeploy(4, 2, 'OU', false);
  board.cellDeploy(3, 3, 'GI', false);
  board.cellDeploy(2, 2, 'KI', false);
  board.cellDeploy(2, 3, 'FU', false);
  board.standDeploy('AL', false);
  var line = 'P-42OU33GI22KI23FU00AL';
  ok(Kifu.Csa.parseByLine(line, kifu), line);
  same(kifu['board'], board, line+' board');
});


})();

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2: */
