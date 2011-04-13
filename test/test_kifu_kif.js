(function() {


var kifu_obj;

module('Kifu.Kif', {
  setup: function() {
    kifu_obj = Kifu();
  }
});

test('parse info', 0, function() {
  var kifu  = kifu_obj.kifu();
  var info  = kifu['info'];
  var info2 = Kifu().kifu()['info'];

  // 対局ID
  info2['kif'] = {id: 246};
  var line = '対局ID：246';
  ok(Kifu.Kif.parseByLine(line, kifu), line);
  same(info, info2, line+' info');
});


})();

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2: */
