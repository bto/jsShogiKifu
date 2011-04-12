(function() {


var kifu_obj;

module('Kifu.Csa', {
  setup: function() {
    kifu_obj = Kifu();
  }
});

test('parse version', 4, function() {
  var kifu = kifu_obj.kifu();

  // version 2
  ok(Kifu.Csa.parseByLine('V2', kifu), 'parse version 2');
  same(kifu['info']['version'], '2', 'check version 2');

  // version 2.2
  ok(Kifu.Csa.parseByLine('V2.2', kifu), 'parse version 2.2');
  same(kifu['info']['version'], '2.2', 'check version 2.2');
});

test('parse player', 4, function() {
  var kifu = kifu_obj.kifu();

  // black player
  ok(Kifu.Csa.parseByLine('N+OOYAMA', kifu), 'parse black player');
  same(kifu['info']['player_black'], 'OOYAMA', 'check black player');

  // white player
  ok(Kifu.Csa.parseByLine('N-MASUDA', kifu), 'parse white player');
  same(kifu['info']['player_white'], 'MASUDA', 'check white player');
});


})();

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2: */
