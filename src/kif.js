/*
 * kif.js
 *
 * Copyright 2011, Masato Bito
 * Licensed under the MIT license.
 *
 */
(function(Kifu) {
Kifu.Kif = (function(kifu) { return new Kifu.Kif.initialize(kifu); });
Kifu.Kif.extend = Kifu.Kif.prototype.extend = Kifu.extend;


var handicap_name_map = {
  '平手':     'even',
  '香落ち':   'lance',
  '右香落ち': 'right_lance',
  '角落ち':   'bishop',
  '飛車落ち': 'rook',
  '飛香落ち': 'rook_and_lance',
  '二枚落ち': 'two_drops',
  '四枚落ち': 'four_drops',
  '六枚落ち': 'six_drops',
  'その他':   'other'
};

var info_map = {
  終了日時: 'end_time',
  棋戦:     'event',
  戦型:     'opening',
  先手:     'player_black',
  下手:     'player_black',
  後手:     'player_white',
  上手:     'player_white',
  場所:     'site',
  開始日時: 'start_time',
  表題:     'title'
};

var promote_map = {
  FU: 'TO',
  KY: 'NY',
  KE: 'NK',
  GI: 'NG',
  KA: 'UM',
  HI: 'RY'
};

Kifu.Kif.prototype.extend({
  handicapToKanji: function(handicap) {
    for (var name in handicap_name_map) {
      if (handicap_name_map[name] == handicap) {
        return name;
      }
    }
  },

  infoToKanji: function(info_key) {
    for (var name in info_map) {
      if (info_map[name] == info_key) {
        return name;
      }
    }
  },

  kanjiToHandicap: function(kanji) {
    return handicap_name_map[kanji];
  },

  kanjiToInfo: function(kanji) {
    return info_map[kanji];
  },

  output: function() {
    var kifu = this.kifu;
    if (kifu.info.format == 'kif') {
      return kifu.info.source;
    }

    var result = "# --- generated by jsShogiKifu ---\n";
    result += this.outputInfo(kifu.info);
    result += this.outputSuite(kifu.suite_init, kifu.info);
    result += this.outputMoves(kifu.moves);
    return result;
  },

  outputBoard: function(board) {
    var result = "  ９ ８ ７ ６ ５ ４ ３ ２ １\n";
    result += "+---------------------------+\n";

    for (var y = 1; y <= 9; y++) {
      result += '|';

      for (var x = 9; 1 <= x; x--) {
        var cell = board[x][y];
        if (cell) {
          result += cell.is_black ? ' ' : 'v';
          result += Kifu.pieceToBoardPiece(cell.piece);
        } else {
          result += ' ・';
        }
      }

      result += '|' + Kifu.integerToKanji(y) + "\n";
    }

    result += "+---------------------------+\n";
    return result;
  },

  outputDate: function(date) {
    var yy = date.getFullYear();
    var mm = date.getMonth() + 1;
    if (mm < 10) {
      mm = '0' + mm;
    }
    var dd = date.getDate();
    if (dd < 10) {
      dd = '0' + dd;
    }
    var h  = date.getHours();
    if (h < 10) {
      h = '0' + h;
    }
    var m  = date.getMinutes();
    if (m < 10) {
      m = '0' + m;
    }
    var s  = date.getSeconds();
    if (s < 10) {
      s = '0' + s;
    }
    return yy + '/' + mm + '/' + dd + ' ' + h + ':' + m + ':' + s;
  },

  outputInfo: function(info) {
    var result = '';

    for (var key in info) {
      var value = info[key];
      switch (key) {
      case 'end_time':
      case 'start_time':
        result += this.infoToKanji(key) + '：' + this.outputDate(value) + "\n";
        break;

      case 'handicap':
        result += '手合割：' + this.handicapToKanji(value) + "\n";
        break;

      case 'kif':
        for (var k in value) {
          result += k + '：' + value[k] + "\n";
        }
        break;

      case 'player_start':
        if (value == 'black') {
          result += "先手番\n";
        } else {
          result += "後手番\n";
        }
        break;

      case 'time_consumed':
        result += '消費時間：' +
          '▲' + value.black +
          '△' + value.white + "\n";
        break;

      case 'time_limit':
        result += '持ち時間：各';
        var h = value.allotted / 60;
        if (h) {
          result += h + '時間';
        }
        var m = value.allotted % 60;
        if (m) {
          result += m + '分';
        }
        result += "\n";
        break;

      default:
        var info_key = this.infoToKanji(key);
        if (info_key) {
          result += info_key + '：' + value + "\n";
        }
        break;
      }
    }

    return result;
  },

  outputMoves: function(moves) {
    var result = "手数----指手---------消費時間--\n";

    var records = moves.records;
    var l       = records.length;
    for (var i = 0; i < l; i++) {
      var record = records[i];

      var num = i + '';
      var m   = 4 - num.length;
      for (j = 0; j < m; j++) {
        num = ' ' + num;
      }

      switch (record.type) {
      case 'move':
        var from    = record.from;
        var to      = record.to;
        var space_l = 5;

        result += num + ' ';

        if (record.is_same_place) {
          result += '同　';
        } else {
          result += Kifu.integerToZenkaku(to.x) + Kifu.integerToKanji(to.y);
        }
        result += Kifu.pieceToMovePiece(from.piece);
        if (from.piece != to.piece) {
          result  += '成';
          space_l -= 2;
        }

        if (from.x) {
          result += '(' + from.x + from.y + ')';
          space_l -= 2;
        } else {
          result += '打';
        }

        for (var j = 0; j < space_l; j++) {
          result += ' ';
        }
        result += "( 0:00/00:00:00)\n";
        break;

      case 'TORYO':
        result += num + " 投了         ( 0:00/00:00:00)\n";
        break;

      case 'TSUMI':
        result += num + " 詰み         ( 0:00/00:00:00)\n";
        break;

      default:
        break;
      }

      if (record.comment) {
        var lines = this.toLines(record.comment);
        var m     = lines.length;
        for (var j = 0; j < m; j++) {
          result += '*' + lines[j] + "\n";
        }
      }
    }

    return result;
  },

  outputStand: function(stand) {
    var result = '';

    for (var piece in stand) {
      var amount = stand[piece];
      if (amount < 1) {
        continue;
      }
      result +=
        Kifu.pieceToBoardPiece(piece) + Kifu.kanjiToInteger(amount) + '　';
    }

    if (!result) {
      result += 'なし';
    }

    result += "\n";
    return result;
  },

  outputSuite: function(suite, info) {
    if (info.handicap && info.handicap != 'other') {
      return '';
    }

    var result = '';
    result += '後手の持ち駒：' + this.outputStand(suite.stand.white);
    result += this.outputBoard(suite.board);
    result += '先手の持ち駒：' + this.outputStand(suite.stand.black);
    return result;
  },

  parse: function() {
    var lines = this.toLines(this.kifu.info.source);
    var l = lines.length;
    for (var i = 0; i < l; i++) {
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
    var y    = Kifu.kanjiToInteger(line.charAt(line.length-1));

    var suite_init = this.kifu.suite_init;
    for (var i = 0; i < 9; i++) {
      var piece = Kifu.boardPieceToPiece(line.substr(i*2+2, 1));
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
    case '開始日時':
    case '終了日時':
      var info_key   = this.kanjiToInfo(key);
      info[info_key] = this.toDate(value);
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

    case '手合割':
      info.handicap = this.kanjiToHandicap(value);
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
      var info_key = this.kanjiToInfo(key);
      if (info_key) {
        info[info_key] = value;
      } else {
        info.kif || (info.kif = {});
        info.kif[key] = value;
      }
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

    var num    = parseInt(RegExp.$1);
    var move   = RegExp.$2;
    var moves  = this.kifu.moves;

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

    var params = {from: {}, to: {}}
    var from   = params.from;
    var to     = params.to;

    if (move.charAt(0) == '同') {
      to.x = to.y = 0;
      params.is_same_place = true;
    } else {
      to.x = Kifu.zenkakuToInteger(move.charAt(0));
      to.y = Kifu.kanjiToInteger(move.charAt(1));
      params.is_same_place = false;
    }
    move = move.substr(2);

    if (move.charAt(0) == '成') {
      from.piece = to.piece = Kifu.movePieceToPiece(move.substr(0, 2));
      move = move.substr(2);
    } else {
      from.piece = to.piece = Kifu.movePieceToPiece(move.charAt(0));
      move = move.substr(1);
    }

    if (move.charAt(0) == '成') {
      from.piece = to.piece;
      to.piece   = promote_map[to.piece];
      move       = move.substr(1);
    }

    switch (move.charAt(0)) {
    case '(':
      from.x = parseInt(move.charAt(1));
      from.y = parseInt(move.charAt(2));
      move   = move.substr(4);
      break;

    case '打':
      from.x = from.y = 0;
      move   = move.substr(1);
      break;
    }

    moves.setMove(num, params);
    return true;
  },

  parseStand: function(str, is_black) {
    if (str == 'なし') {
      return true;
    }

    var suite_init = this.kifu.suite_init;
    var list = str.split(/[\s　]+/);
    for (var i in list) {
      var value = list[i];
      var piece = Kifu.boardPieceToPiece(value.substr(0, 1));
      if (!piece) {
        continue;
      }
      var num = Kifu.kanjiToInteger(value.substr(1)) || 1;
      suite_init.standDeploy(piece, is_black, num);
    }

    return true;
  },

  prepare: function() {
    var kifu = this.kifu;
    var info = kifu.info;

    if (this._board_setup) {
      delete info.handicap;
    } else {
      if (!info.handicap) {
        info.handicap = 'even';
      }

      var handicap = info.handicap;
      kifu.suite_init.setup(handicap);
      if (handicap != 'even') {
        info.player_start = 'white';
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
