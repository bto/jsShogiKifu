(function() {


var parser;

module('Kifu.Kif', {
  setup: function() {
    parser = Kifu.Kif(Kifu());
  }
});

test('parse info', 26, function() {
  var info = Kifu().info;

  // 対局ID
  info['kif'] = {id: 246};
  var line = '対局ID：246';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');

  // 開始日時
  info['start_time'] = new Date(2010, 9, 14, 9);
  var line = '開始日時：2010/10/14 9:00';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');

  // 終了日時
  info['end_time'] = new Date(2010, 9, 15, 18, 1);
  var line = '終了日時：2010/10/15 18:01';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');

  // 表題
  info['title'] = '竜王戦';
  var line = '表題：竜王戦';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');

  // 棋戦
  info['event'] = '第23期竜王戦七番勝負第1局';
  var line = '棋戦：第23期竜王戦七番勝負第1局';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');

  // 持ち時間
  info['time_limit'] = {allotted: 480};
  var line = '持ち時間：各8時間';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');

  // 消費時間
  info['time_consumed'] = {black: 451, white: 457};
  var line = '消費時間：93▲451△457';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');

  // 場所
  info['site'] = '長崎・にっしょうかん別邸紅葉亭';
  var line = '場所：長崎・にっしょうかん別邸紅葉亭';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');

  // 戦型：横歩取り
  info['opening'] = '横歩取り';
  var line = '戦型：横歩取り';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');

  // 先手
  info['player_black'] = '渡辺　明';
  var line = '先手：渡辺　明';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');

  // 後手
  info['player_white'] = '羽生善治';
  var line = '後手：羽生善治';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');

  // 携帯先手
  info['kif']['携帯先手'] = '渡辺';
  var line = '携帯先手：渡辺';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');

  // 携帯後手
  info['kif']['携帯後手'] = '羽生';
  var line = '携帯後手：羽生';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.info, info, line+' info');
});

test('parse initial board hirate', 2, function() {
  var suite = Kifu.Suite().hirate();

  // 平手
  var line = '手合割：平手　　';
  ok(parser.parseByLine(line), line);
  same(parser.kifu.suite_init, suite, line+' suite');
});

test('parse moves', 16, function() {
  var moves = Kifu.Move();

  // * comment1
  moves.addComment('comment1');
  var line = "*comment1";
  ok(parser.parseByLine(line), line);
  same(parser.kifu.moves, moves, line+' move');

  // * comment2
  moves.addComment('comment2');
  var line = "*comment2";
  ok(parser.parseByLine(line), line);
  same(parser.kifu.moves, moves, line+' move');

  //    1 ７六歩(77)   ( 0:00/00:00:00)
  moves.addMove([7, 7], [7, 6], 'FU', {str: '７六歩'});
  var line = "   1 ７六歩(77)   ( 0:00/00:00:00)";
  ok(parser.parseByLine(line), line);
  same(parser.kifu.moves, moves, line+' move');

  // * comment3
  moves.addComment('comment3');
  var line = "*comment3";
  ok(parser.parseByLine(line), line);
  same(parser.kifu.moves, moves, line+' move');

  //    2 同　歩(73)   +
  moves.addMove([7, 3], [0, 0], 'FU', {str: '同　歩'});
  var line = "   2 同　歩(73)   +";
  ok(parser.parseByLine(line), line);
  same(parser.kifu.moves, moves, line+' move');

  //    3 ５五角打     
  moves.addMove([0, 0], [5, 5], 'KA', {str: '５五角打'});
  var line = "   3 ５五角打     ";
  ok(parser.parseByLine(line), line);
  same(parser.kifu.moves, moves, line+' move');

  //    4 ８八飛成(82)
  moves.addMove([8, 2], [8, 8], 'RY', {str: '８八飛成'});
  var line = "   4 ８八飛成(82)";
  ok(parser.parseByLine(line), line);
  same(parser.kifu.moves, moves, line+' move');

  //    5 投了         ( 0:00/00:00:00)
  moves.addSpecial('TORYO');
  var line = "   5 投了         ( 0:00/00:00:00)";
  ok(parser.parseByLine(line), line);
  same(parser.kifu.moves, moves, line+' move');
});

test('strip', 3, function() {
  same(parser.strip('  foo  '),   'foo', 'foo');
  same(parser.strip('　bar　'),   'bar', 'bar');
  same(parser.strip(' 　baz 　'), 'baz', 'baz');
});

test('toDate', 2, function() {
  var date = '2011/5/4 9:00';
  same(parser.toDate(date), new Date(2011, 4, 4, 9), date);

  var date = '2010/11/25 18:15';
  same(parser.toDate(date), new Date(2010, 10, 25, 18, 15), date);
});

test('toLines', 1, function() {
  var source = "foo\r\nbar\rbaz\nfoo2\nbar2\nbaz2\n";
  var lines  = ['foo', 'bar', 'baz', 'foo2', 'bar2', 'baz2'];
  same(parser.toLines(source), lines, source);
});


})();

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2: */
