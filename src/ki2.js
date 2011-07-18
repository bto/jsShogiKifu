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


var kifu_map = {
  '同':   0,
  '　':   0,
  '１':   1,
  '２':   2,
  '３':   3,
  '４':   4,
  '５':   5,
  '６':   6,
  '７':   7,
  '８':   8,
  '９':   9,
  '一':   1,
  '二':   2,
  '三':   3,
  '四':   4,
  '五':   5,
  '六':   6,
  '七':   7,
  '八':   8,
  '九':   9,
  '歩':   'FU',
  '香':   'KY',
  '桂':   'KE',
  '銀':   'GI',
  '金':   'KI',
  '角':   'KA',
  '飛':   'HI',
  '王':   'OU',
  '玉':   'OU',
  '歩成': 'TO',
  '香成': 'NY',
  '桂成': 'NK',
  '銀成': 'NG',
  '角成': 'UM',
  '飛成': 'RY',
  'と':   'TO',
  '成香': 'NY',
  '成桂': 'NK',
  '成銀': 'NG',
  '馬':   'UM',
  '龍':   'RY',
  '竜':   'RY'
};

var board_piece_map = {
  '歩': 'FU',
  '香': 'KY',
  '桂': 'KE',
  '銀': 'GI',
  '金': 'KI',
  '角': 'KA',
  '飛': 'HI',
  '王': 'OU',
  '玉': 'OU',
  'と': 'TO',
  '杏': 'NY',
  '圭': 'NK',
  '全': 'NG',
  '馬': 'UM',
  '龍': 'RY',
  '竜': 'RY'
};

var kanji_number_map = {
  '一':   1,
  '二':   2,
  '三':   3,
  '四':   4,
  '五':   5,
  '六':   6,
  '七':   7,
  '八':   8,
  '九':   9,
  '十':  10
};

var handicap_name_map = {
  '平手':     'Even',
  '香落ち':   'Lance',
  '右香落ち': 'Right_Lance',
  '角落ち':   'Bishop',
  '飛車落ち': 'Rook',
  '飛香落ち': 'Rook_and_Lance',
  '二枚落ち': 'Two_Drops',
  '四枚落ち': 'Four_Drops',
  '六枚落ち': 'Six_Drops',
  'その他':   'Other'
};

var direction_map = {
  上: 'up',
  寄: 'horizon',
  引: 'down',
  直: 'straight_up',
  下: 'down',  // optional
  行: 'up',    // optional
  入: 'up'     // optional
};

var promote_map = {
  FU: 'TO',
  KY: 'NY',
  KE: 'NK',
  GI: 'NG',
  KA: 'UM',
  HI: 'RY'
};

var relative_map = {
  左: 'left',
  右: 'right'
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
      var params = {from: {}, to: {}, str: p_info.substr(1)};

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
      p_info = p_info.substr(1);

      if (p_info.charAt(0) == '同') {
        params.to.x = 0;
        params.to.y = 0;
        p_info      = p_info.substr(1);
        if (p_info.charAt(0) == '　') {
          p_info = p_info.substr(1);
        }
      } else {
        params.to.x = kifu_map[p_info.charAt(0)];
        params.to.y = kifu_map[p_info.charAt(1)];
        p_info      = p_info.substr(2);
      }

      if (p_info.charAt(0) == '成') {
        params.to.piece = kifu_map[p_info.substr(0, 2)];
        p_info          = p_info.substr(2);
      } else {
        params.to.piece = kifu_map[p_info.charAt(0)];
        p_info          = p_info.substr(1);
      }
      params.from.piece = params.to.piece;

      var relative = relative_map[p_info.charAt(0)];
      if (relative) {
        params.relative = relative;
        p_info          = p_info.substr(1);
      }

      var direction = direction_map[p_info.charAt(0)];
      if (direction) {
        params.direction = direction;
        p_info           = p_info.substr(1);
      }

      switch (p_info) {
      case '成':
        var piece         = params.to.piece;
        params.from.piece = piece;
        params.to.piece   = promote_map[piece];
        break;

      case '打':
        params.from.x = 0;
        params.from.y = 0;
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
