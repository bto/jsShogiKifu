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

test('parse info', 0, function() {
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


})();

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2: */
