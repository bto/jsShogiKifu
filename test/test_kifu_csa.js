(function() {


var parser;

module('Kifu.Csa', {
  setup: function() {
    parser = Kifu.Csa(Kifu());
  }
});

test('parse version', 4, function() {
  var info = Kifu().info;

  // version 2
  info['version'] = '2';
  var line = 'V2';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');

  // version 2.2
  info['version'] = '2.2';
  var line = 'V2.2';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');
});

test('parse player', 4, function() {
  var info = Kifu().info;

  // black player
  info['player_black'] = '大山康晴';
  var line = 'N+大山康晴';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');

  // white player
  info['player_white'] = '升田幸三';
  var line = 'N-升田幸三';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');
});

test('parse info', 18, function() {
  var info = Kifu().info;

  // EVENT
  info['event'] = '名人戦';
  var line = '$EVENT:名人戦';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');

  // SITE
  info['site'] = '陣屋';
  var line = '$SITE:陣屋';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');

  // START_TIME
  info['start_time'] = new Date(2011, 3, 7, 9, 45, 10);
  var line = '$START_TIME:2011/04/07 09:45:10';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');

  // START_TIME 2
  info['start_time'] = new Date(2010, 9, 25);
  var line = '$START_TIME:2010/10/25';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');

  // END_TIME
  info['end_time'] = new Date(2011, 3, 8, 10, 20, 30);
  var line = '$END_TIME:2011/04/08 10:20:30';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');

  // END_TIME 2
  info['end_time'] = new Date(2010, 9, 26);
  var line = '$END_TIME:2010/10/26';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');

  // TIME_LIMIT
  info['time_limit'] = {allotted: 360, extra: 60};
  var line = '$TIME_LIMIT:06:00+60';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');

  // TIME_LIMIT 2
  info['time_limit'] = {allotted: 0, extra: 0};
  var line = '$TIME_LIMIT:00:00+00';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');

  // OPENING
  info['opening'] = '相矢倉';
  var line = '$OPENING:相矢倉';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');
});

test('parse initial board hirate', 4, function() {
  var suite = Kifu.Suite().hirate();

  // hirate
  var line = 'PI';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.suite_init, suite, line+' suite');

  // hirate komaochi
  parser.kifu.suite_init = Kifu.Suite();
  suite.cellRemove(8, 2, 'HI');
  suite.cellRemove(2, 2, 'KA');
  var line = 'PI82HI22KA';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.suite_init, suite, line+' suite');
});

test('parse initial board all', 16, function() {
  var suite = Kifu.Suite();

  // 1st line
  suite.cellDeploy(9, 1, 'KY', false);
  suite.cellDeploy(8, 1, 'KE', false);
  suite.cellDeploy(7, 1, 'GI', false);
  suite.cellDeploy(6, 1, 'KI', false);
  suite.cellDeploy(5, 1, 'OU', false);
  suite.cellDeploy(4, 1, 'KI', false);
  suite.cellDeploy(3, 1, 'GI', false);
  suite.cellDeploy(2, 1, 'KE', false);
  var line = 'P1-KY-KE-GI-KI-OU-KI-GI-KE * ';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.suite_init, suite, line+' suite');

  // 2nd line
  suite.cellDeploy(8, 2, 'HI', false);
  var line = 'P2 * -HI *  *  *  *  *  *  * ';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.suite_init, suite, line+' suite');

  // 3rd line
  suite.cellDeploy(9, 3, 'FU', false);
  suite.cellDeploy(8, 3, 'FU', false);
  suite.cellDeploy(7, 3, 'FU', false);
  suite.cellDeploy(6, 3, 'FU', false);
  suite.cellDeploy(5, 3, 'FU', false);
  suite.cellDeploy(4, 3, 'FU', false);
  suite.cellDeploy(3, 3, 'FU', false);
  suite.cellDeploy(2, 3, 'FU', false);
  suite.cellDeploy(1, 3, 'FU', false);
  var line = 'P3-FU-FU-FU-FU-FU-FU-FU-FU-FU';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.suite_init, suite, line+' suite');

  // 4-6 line
  var line = 'P4 *  *  *  *  *  *  *  *  * ';
  ok(parser.parseByLine(line), line);
  var line = 'P5 *  *  *  *  *  *  *  *  * ';
  ok(parser.parseByLine(line), line);
  var line = 'P6 *  *  *  *  *  *  *  *  * ';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.suite_init, suite, line+' suite');

  // 7th line
  suite.cellDeploy(9, 7, 'FU', true);
  suite.cellDeploy(8, 7, 'FU', true);
  suite.cellDeploy(7, 7, 'FU', true);
  suite.cellDeploy(6, 7, 'FU', true);
  suite.cellDeploy(5, 7, 'FU', true);
  suite.cellDeploy(4, 7, 'FU', true);
  suite.cellDeploy(3, 7, 'FU', true);
  suite.cellDeploy(2, 7, 'FU', true);
  suite.cellDeploy(1, 7, 'FU', true);
  var line = 'P7+FU+FU+FU+FU+FU+FU+FU+FU+FU';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.suite_init, suite, line+' suite');

  // 8th line
  suite.cellDeploy(8, 8, 'KA', true);
  suite.cellDeploy(2, 8, 'HI', true);
  var line = 'P8 * +KA *  *  *  *  * +HI * ';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.suite_init, suite, line+' suite');

  // 9th line
  suite.cellDeploy(9, 9, 'KY', true);
  suite.cellDeploy(8, 9, 'KE', true);
  suite.cellDeploy(7, 9, 'GI', true);
  suite.cellDeploy(6, 9, 'KI', true);
  suite.cellDeploy(5, 9, 'OU', true);
  suite.cellDeploy(4, 9, 'KI', true);
  suite.cellDeploy(3, 9, 'GI', true);
  suite.cellDeploy(2, 9, 'KE', true);
  suite.cellDeploy(1, 9, 'KY', true);
  var line = 'P9+KY+KE+GI+KI+OU+KI+GI+KE+KY';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.suite_init, suite, line+' suite');
});

test('parse initial board each', 8, function() {
  var suite = Kifu.Suite();

  // P+63RY00KI
  suite.cellDeploy(6, 3, 'RY', true);
  suite.standDeploy('KI', true);
  var line = 'P+63RY00KI';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.suite_init, suite, line+' suite');

  // P+00KI
  suite.standDeploy('KI', true);
  var line = 'P+00KI';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.suite_init, suite, line+' suite');

  // P-42OU33GI22KI23FU
  suite.cellDeploy(4, 2, 'OU', false);
  suite.cellDeploy(3, 3, 'GI', false);
  suite.cellDeploy(2, 2, 'KI', false);
  suite.cellDeploy(2, 3, 'FU', false);
  var line = 'P-42OU33GI22KI23FU';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.suite_init, suite, line+' suite');

  // P-00AL
  suite.standDeploy('AL', false);
  var line = 'P-00AL';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.suite_init, suite, line+' suite');
});

test('parse start player', 5, function() {
  var info = Kifu().info;

  // -
  info['player_start'] = 'white';
  var line = '-';
  same(parser.kifu.info['player_start'], undefined, 'first status');
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');

  // +
  info['player_start'] = 'black';
  var line = '+';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');
});

test('parse moves', 20, function() {
  var moves = Kifu.Move();

  // '*comment1'
  moves.addComment('comment1');
  var line = "'*comment1";
  ok(parser.parseByLine(line), line);
  same(parser.kifu.moves, moves, line+' move');

  // '*comment2'
  moves.addComment('comment2');
  var line = "'*comment2";
  ok(parser.parseByLine(line), line);
  same(parser.kifu.moves, moves, line+' move');

  // '+2726FU'
  moves.addMove([2, 7], [2, 6], 'FU', {black: true});
  var line = '+2726FU';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.moves, moves, line+' move');

  // 'T10'
  moves.addPeriod(10);
  var line = 'T10';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.moves, moves, line+' move');

  // '*comment3'
  moves.addComment('comment3');
  var line = "'*comment3";
  ok(parser.parseByLine(line), line);
  same(parser.kifu.moves, moves, line+' move');

  // '-0055KA'
  moves.addMove([0, 0], [5, 5], 'KA', {black: false});
  var line = '-0055KA';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.moves, moves, line+' move');

  // 'T30'
  moves.addPeriod(30);
  var line = 'T30';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.moves, moves, line+' move');

  // %TORYO
  moves.addSpecial('TORYO');
  var line = '%TORYO';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.moves, moves, line+' move');

  // %+ILLEGAL_ACTION
  moves.addSpecial('ILLEGAL_ACTION', {black: true});
  var line = '%+ILLEGAL_ACTION';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.moves, moves, line+' move');

  // %-ILLEGAL_ACTION
  moves.addSpecial('ILLEGAL_ACTION', {black: false});
  var line = '%-ILLEGAL_ACTION';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.moves, moves, line+' move');
});

test('toLines', 2, function() {
  var source = "foo\r\nbar\rbaz\nfoo2\nbar2\nbaz2\n";
  var lines  = ['foo', 'bar', 'baz', 'foo2', 'bar2', 'baz2'];
  same(parser.toLines(source), lines, source);

  var source = "foo,\r\nbar\rbaz,\nfoo2,\nbar2\nbaz2\n";
  var lines  = ['foobar', 'bazfoo2bar2', 'baz2'];
  same(parser.toLines(source), lines, source);
});

test('parse', 1, function() {
  var source = "'----------棋譜ファイルの例\"example.csa\"-----------------\n\
'バージョン\n\
V2.2\n\
'対局者名\n\
N+NAKAHARA\n\
N-YONENAGA\n\
'棋譜情報\n\
'棋戦名\n\
$EVENT:13th World Computer Shogi Championship\n\
'対局場所\n\
$SITE:KAZUSA ARC\n\
'開始日時\n\
$START_TIME:2003/05/03 10:30:00\n\
'終了日時\n\
$END_TIME:2003/05/03 11:11:05\n\
'持ち時間:25分、切れ負け\n\
$TIME_LIMIT:00:25+00\n\
'戦型:矢倉\n\
$OPENING:YAGURA\n\
'平手の局面\n\
P1-KY-KE-GI-KI-OU-KI-GI-KE-KY\n\
P2 * -HI *  *  *  *  * -KA * \n\
P3-FU-FU-FU-FU-FU-FU-FU-FU-FU\n\
P4 *  *  *  *  *  *  *  *  * \n\
P5 *  *  *  *  *  *  *  *  * \n\
P6 *  *  *  *  *  *  *  *  * \n\
P7+FU+FU+FU+FU+FU+FU+FU+FU+FU\n\
P8 * +KA *  *  *  *  * +HI * \n\
P9+KY+KE+GI+KI+OU+KI+GI+KE+KY\n\
'先手番\n\
+\n\
'指し手と消費時間\n\
+2726FU\n\
T12\n\
-3334FU\n\
T6\n\
%CHUDAN\n\
'---------------------------------------------------------\n\
";

  var kifu  = Kifu();
  var suite = kifu.suite_init;
  var info  = kifu.info;
  var moves = kifu.moves;
  info['source']       = source;
  info['version']      = '2.2';
  info['player_black'] = 'NAKAHARA';
  info['player_white'] = 'YONENAGA';
  info['event']        = '13th World Computer Shogi Championship';
  info['site']         = 'KAZUSA ARC';
  info['start_time']   = new Date(2003, 4, 3, 10, 30);
  info['end_time']     = new Date(2003, 4, 3, 11, 11, 5);
  info['time_limit']   = {allotted: 25, extra: 0};
  info['opening']      = 'YAGURA';
  info['player_start'] = 'black';
  suite.hirate();
  moves.addMove([2, 7], [2, 6], 'FU', {black: true});
  moves.addPeriod(12);
  moves.addMove([3, 3], [3, 4], 'FU', {black: false});
  moves.addPeriod(6);
  moves.addSpecial('CHUDAN');

  parser.kifu.source(source);
  parser.parse();
  same(parser.kifu, kifu, 'sample csa');
});


})();

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2: */
