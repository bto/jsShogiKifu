(function() {


var kifu_obj;

module('Kifu.Kif', {
  setup: function() {
    kifu_obj = Kifu();
  }
});

test('parse info', 24, function() {
  var kifu  = kifu_obj.kifu();
  var info  = kifu['info'];
  var info2 = Kifu().kifu()['info'];

  // 対局ID
  info2['kif'] = {id: 246};
  var line = '対局ID：246';
  ok(Kifu.Kif.parseByLine(line, kifu), line);
  same(info, info2, line+' info');

  // 開始日時
  info2['start_time'] = new Date(2010, 9, 14, 9);
  var line = '開始日時：2010/10/14 9:00';
  ok(Kifu.Kif.parseByLine(line, kifu), line);
  same(info, info2, line+' info');

  // 終了日時
  info2['end_time'] = new Date(2010, 9, 15, 18, 1);
  var line = '終了日時：2010/10/15 18:01';
  ok(Kifu.Kif.parseByLine(line, kifu), line);
  same(info, info2, line+' info');

  // 表題
  info2['title'] = '竜王戦';
  var line = '表題：竜王戦';
  ok(Kifu.Kif.parseByLine(line, kifu), line);
  same(info, info2, line+' info');

  // 棋戦
  info2['event'] = '第23期竜王戦七番勝負第1局';
  var line = '棋戦：第23期竜王戦七番勝負第1局';
  ok(Kifu.Kif.parseByLine(line, kifu), line);
  same(info, info2, line+' info');

  // 持ち時間
  info2['time_limit'] = {allotted: 480};
  var line = '持ち時間：各8時間';
  ok(Kifu.Kif.parseByLine(line, kifu), line);
  same(info, info2, line+' info');

  // 消費時間
  info2['time_consumed'] = {black: 451, white: 457};
  var line = '消費時間：93▲451△457';
  ok(Kifu.Kif.parseByLine(line, kifu), line);
  same(info, info2, line+' info');

  // 場所
  info2['site'] = '長崎・にっしょうかん別邸紅葉亭';
  var line = '場所：長崎・にっしょうかん別邸紅葉亭';
  ok(Kifu.Kif.parseByLine(line, kifu), line);
  same(info, info2, line+' info');

  // 先手
  info2['player_black'] = '渡辺　明';
  var line = '先手：渡辺　明';
  ok(Kifu.Kif.parseByLine(line, kifu), line);
  same(info, info2, line+' info');

  // 後手
  info2['player_white'] = '羽生善治';
  var line = '後手：羽生善治';
  ok(Kifu.Kif.parseByLine(line, kifu), line);
  same(info, info2, line+' info');

  // 携帯先手
  info2['kif']['携帯先手'] = '渡辺';
  var line = '携帯先手：渡辺';
  ok(Kifu.Kif.parseByLine(line, kifu), line);
  same(info, info2, line+' info');

  // 携帯後手
  info2['kif']['携帯後手'] = '羽生';
  var line = '携帯後手：羽生';
  ok(Kifu.Kif.parseByLine(line, kifu), line);
  same(info, info2, line+' info');
});

test('parse initial board hirate', 2, function() {
  var kifu  = kifu_obj.kifu();
  var board = Kifu.Board().hirate();

  // 平手
  var line = '手合割：平手　　';
  ok(Kifu.Kif.parseByLine(line, kifu), line);
  same(kifu['board'], board, line+' board');
});

test('parse moves', 14, function() {
  var kifu  = kifu_obj.kifu();
  var moves = Kifu.Move();

  // * comment1
  moves.addComment('comment1');
  var line = "*comment1";
  ok(Kifu.Kif.parseByLine(line, kifu), line);
  same(kifu['moves'], moves, line+' move');

  // * comment2
  moves.addComment('comment2');
  var line = "*comment2";
  ok(Kifu.Kif.parseByLine(line, kifu), line);
  same(kifu['moves'], moves, line+' move');

  //    1 ７六歩(77)   ( 0:00/00:00:00)
  moves.addMove([7, 7], [7, 6], 'FU', {str: '７六歩'});
  var line = "   1 ７六歩(77)   ( 0:00/00:00:00)";
  ok(Kifu.Kif.parseByLine(line, kifu), line);
  same(kifu['moves'], moves, line+' move');

  // * comment3
  moves.addComment('comment3');
  var line = "*comment3";
  ok(Kifu.Kif.parseByLine(line, kifu), line);
  same(kifu['moves'], moves, line+' move');

  //    2 同　歩(73)   ( 0:00/00:00:00)
  moves.addMove([7, 3], [0, 0], 'FU', {str: '同　歩'});
  var line = "   2 同　歩(73)   ( 0:00/00:00:00)";
  ok(Kifu.Kif.parseByLine(line, kifu), line);
  same(kifu['moves'], moves, line+' move');

  //    3 ５五角打     ( 0:00/00:00:00)
  moves.addMove([0, 0], [5, 5], 'KA', {str: '５五角打'});
  var line = "   3 ５五角打     ( 0:00/00:00:00)";
  ok(Kifu.Kif.parseByLine(line, kifu), line);
  same(kifu['moves'], moves, line+' move');

  //    4 投了         ( 0:00/00:00:00)
  moves.addSpecial('TORYO');
  var line = "   4 投了         ( 0:00/00:00:00)";
  ok(Kifu.Kif.parseByLine(line, kifu), line);
  same(kifu['moves'], moves, line+' move');
});


})();

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2: */
