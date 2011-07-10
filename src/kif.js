/*
 * kif.js
 *
 * Copyright 2011, Masato Bito
 * Licensed under the MIT license.
 *
 */
(function(Kifu) {
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

Kifu.Kif = (function(kifu) { return new Kifu.Kif.initialize(kifu); });
Kifu.Kif.extend = Kifu.Kif.prototype.extend = Kifu.extend;

Kifu.Kif.prototype.extend({
  parse: function() {
    var lines = this.toLines(this.kifu.info.source);
    for (var i in lines) {
      var line = lines[i];
      this.parseByLine(line);
    }

    this.prepare();

    return this;
  },

  parseByLine: function(line) {
    if (this.parseByLineAsComment(line)) {
      return true;
    }

    if (this.parseByLineAsInfo(line)) {
      return true;
    }

    if (this.parseByLineAsInfo2(line)) {
      return true;
    }

    if (this.parseByLineAsBoard(line)) {
      return true;
    }

    if (this.parseByLineAsMove(line)) {
      return true;
    }

    return false;
  },

  parseByLineAsBoard: function(line) {
    if (!line.match(/^\|.+\|/)) {
      return false;
    }

    this._board_setup = true;

    var line = this.strip(line);
    var y = this.parseKansuuchi(line.charAt(line.length-1));

    var suite_init = this.kifu.suite_init;
    for (var i = 0; i < 9; i++) {
      var piece = board_piece_map[line.substr(i*2+2, 1)];
      if (!piece) {
        continue;
      }

      var is_black = !(line.substr(i*2+1, 1) == 'v');
      var x        = 9 - i;
      suite_init.cellDeploy(x, y, piece, is_black);
    }

    return true;
  },

  parseByLineAsComment: function(line) {
    switch (line.charAt(0)) {
    case '#':
      return true;
    case '*':
      // 変化は未実装
      if (this._henka) {
        return true;
      }
      if (line.length > 1) this.kifu.moves.addComment(line.substr(1));
      return true;
    }
    return false;
  },

  parseByLineAsInfo: function(line) {
    if (!line.match(/^(.+?)：(.+)/)) {
      return false;
    }

    var info  = this.kifu.info;
    var key   = RegExp.$1;
    var value = this.strip(RegExp.$2);

    switch (key) {
    case '対局ID':
      info.kif || (info.kif = {});
      info.kif.id = parseInt(value);
      return true;

    case '開始日時':
      info.start_time = this.toDate(value);
      return true;

    case '終了日時':
      info.end_time = this.toDate(value);
      return true;

    case '表題':
      info.title = value;
      return true;

    case '棋戦':
      info.event = value;
      return true;

    case '持ち時間':
      if (value.match(/([0-9]+)時間/)) {
        info.time_limit || (info.time_limit = {});
        info.time_limit.allotted = parseInt(RegExp.$1) * 60;
      }
      return true;

    case '消費時間':
      if (value.match(/[0-9]+▲([0-9]+)△([0-9]+)/)) {
        info.time_consumed = {
          black: parseInt(RegExp.$1),
          white: parseInt(RegExp.$2)
        };
      }
      return true;

    case '場所':
      info.site = value;
      return true;

    case '戦型':
      info.opening = value;
      return true;

    case '手合割':
      info.handicap = handicap_name_map[value];
      return true;

    case '先手':
    case '下手':
      info.player_black = value;
      return true;

    case '後手':
    case '上手':
      info.player_white = value;
      return true;

    case '先手の持駒':
    case '下手の持駒':
      return this.parseStand(value, true);

    case '後手の持駒':
    case '上手の持駒':
      return this.parseStand(value, false);

    case '変化':
      this._henka = true;
      return true;

    default:
      info.kif || (info.kif = {});
      info.kif[key] = value;
      return true;
    }

    return false;
  },

  parseByLineAsInfo2: function(line) {
    var info = this.kifu.info;

    switch (this.strip(line)) {
    case '先手番':
    case '下手番':
      info.player_start = 'black';
      return true;

    case '上手番':
    case '後手番':
      info.player_start = 'white';
      return true;
    }

    return false;
  },

  parseByLineAsMove: function(line) {
    if (!line.match(/^ *([0-9]+) ([^ ]+)/)) {
      return false;
    }

    // 変化は未実装
    if (this._henka) {
      return true;
    }

    var num   = parseInt(RegExp.$1);
    var move  = RegExp.$2;
    var moves = this.kifu.moves;

    switch (this.strip(move)) {
    case '投了':
      moves.addSpecial('TORYO');
      return true;

    case '千日手':
      moves.addSpecial('SENNICHITE');
      return true;

    case '持将棋':
      moves.addSpecial('JISHOGI');
      return true;

    case '詰み':
      moves.addSpecial('TSUMI');
      return true;
    }

    var to = [kifu_map[move.charAt(0)], kifu_map[move.charAt(1)]];
    if (move.substr(2).match(/(.*)\(([1-9])([1-9])\)/)) {
      var piece = kifu_map[RegExp.$1];
      var from  = [parseInt(RegExp.$2), parseInt(RegExp.$3)];
      move.match(/(.*)\(/);
      var str   = RegExp.$1;
    } else {
      var piece = kifu_map[move.charAt(2)];
      var from  = [0, 0];
      var str   = move;
    }
    moves.setMove(num, from, to, piece, {str: str});

    return true;
  },

  parseStand: function(str, black) {
    if (str == 'なし') {
      return true;
    }

    var suite_init = this.kifu.suite_init;
    var list = str.split(/[\s　]+/);
    for (var i in list) {
      var value = list[i];
      var piece = board_piece_map[value.substr(0, 1)];
      var num   = this.parseKansuuchi(value.substr(1));
      if (!piece || !num) {
        continue;
      }
      suite_init.standDeployN(piece, black, num);
    }

    return true;
  },

  parseKansuuchi: function(str) {
    var num = 0;
    var l = str.length;
    for (var i = 0; i < l; i++) {
      num += kanji_number_map[str.substr(i, 1)];
    }

    if (!num) {
      num = 1;
    }

    return num;
  },

  prepare: function() {
    var kifu = this.kifu;
    var info = kifu.info;

    var handicap = info.handicap;
    if (handicap) {
      if (this._board_setup) {
        delete info.handicap;
      } else {
        kifu.suite_init.setup(handicap);
        if (handicap != 'Even') {
          info.player_start = 'white';
        }
      }
    }
  },

  strip: function(str) {
    return str.replace(/^[\s　]+/, '').replace(/[\s　]+$/, '');
  },

  toDate: function(str) {
    var date = new Date();
    date.setTime(Date.parse(str));
    return date;
  },

  toLines: function(source) {
    var result = [];
    var lines = source.split(/\r?\n|\r/);
    var l = lines.length;
    for (var i = 0; i < l; i++) {
      var line = lines[i];
      if (line) {
        result.push(lines[i]);
      }
    }
    return result;
  }
});

Kifu.Kif.extend({
  initialize: function(kifu) {
    this.kifu = kifu;
  }
});

Kifu.Kif.initialize.prototype = Kifu.Kif.prototype;
})(Kifu);

// Local variables:
// indent-tabs-mode: nil
// js2-basic-offset: 2
// end:
// vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2:
