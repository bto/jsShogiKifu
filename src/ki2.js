/*
 * ki2.js
 *
 * Copyright 2011, Masato Bito
 * Licensed under the MIT license.
 *
 */
(function(Kifu) {
Kifu.Ki2 = (function(kifu) { return new Kifu.Ki2.initialize(kifu); });
Kifu.Ki2.extend = Kifu.Ki2.prototype.extend = Kifu.extend;


var promote_map = {
  FU: 'TO',
  KY: 'NY',
  KE: 'NK',
  GI: 'NG',
  KA: 'UM',
  HI: 'RY'
};

Kifu.Ki2.prototype.extend(Kifu.Kif.prototype);
Kifu.Ki2.prototype.extend({
  parseByLineAsMove: function(line) {
    if (!line.match(/^[▽▼△▲]/)) {
      return false;
    }

    var moves   = this.kifu.moves;
    var p_infos = line;
    while (p_infos.match(/([▽▼△▲][^▽▼△▲]*)(.*)/)) {
      p_infos    = RegExp.$2;
      var p_info = this.strip(RegExp.$1);
      var params = {from: {}, to: {}};
      var from   = params.from;
      var to     = params.to;

      switch (p_info.charAt(0)) {
      case '▲':
      case '▼':
        params.is_black = true;
        break;
      case '△':
      case '▽':
        params.is_black = false;
        break;
      }
      p_info     = p_info.substr(1);
      params.str = p_info;

      if (p_info.charAt(0) == '同') {
        to.x   = 0;
        to.y   = 0;
        p_info = p_info.substr(1);
        if (p_info.charAt(0) == '　') {
          p_info = p_info.substr(1);
        }
      } else {
        to.x   = Kifu.zenkakuToInteger(p_info.charAt(0));
        to.y   = Kifu.kanjiToInteger(p_info.charAt(1));
        p_info = p_info.substr(2);
      }

      if (p_info.charAt(0) == '成') {
        from.piece = to.piece = Kifu.movePieceToPiece(p_info.substr(0, 2));
        p_info = p_info.substr(2);
      } else {
        from.piece = to.piece = Kifu.movePieceToPiece(p_info.charAt(0));
        p_info = p_info.substr(1);
      }

      var relative = Kifu.kanjiToRelative(p_info.charAt(0));
      if (relative) {
        params.relative = relative;
        p_info          = p_info.substr(1);
      }

      var direction = Kifu.kanjiToDirection(p_info.charAt(0));
      if (direction) {
        params.direction = direction;
        p_info           = p_info.substr(1);
      }

      switch (p_info) {
      case '成':
        from.piece = to.piece;
        to.piece   = promote_map[to.piece];
        p_info     = p_info.substr(1);
        break;

      case '打':
        from.x = from.y = 0;
        p_info = p_info.substr(1);
        break;
      }

      moves.addMove(params);
    }

    return true;
  }
});

Kifu.Ki2.extend({
  initialize: function(kifu) {
    this.kifu = kifu;
  }
});


Kifu.Ki2.initialize.prototype = Kifu.Ki2.prototype;
})(Kifu);

// Local variables:
// indent-tabs-mode: nil
// js2-basic-offset: 2
// end:
// vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2:
