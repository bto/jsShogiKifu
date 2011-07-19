/*
 * core.js
 *
 * Copyright 2011, Masato Bito
 * Licensed under the MIT license.
 *
 */
(function(window) {


var _Kifu = window.Kifu;

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

var move_piece_map = {
  '歩':   'FU',
  '香':   'KY',
  '桂':   'KE',
  '銀':   'GI',
  '金':   'KI',
  '角':   'KA',
  '飛':   'HI',
  '王':   'OU',
  '玉':   'OU',
  'と':   'TO',
  '成香': 'NY',
  '成桂': 'NK',
  '成銀': 'NG',
  '馬':   'UM',
  '龍':   'RY',
  '竜':   'RY'
};

var original_piece_map = {
  FU: 'FU',
  KY: 'KY',
  KE: 'KE',
  GI: 'GI',
  KI: 'KI',
  KA: 'KA',
  HI: 'HI',
  OU: 'OU',
  TO: 'FU',
  NY: 'KY',
  NK: 'KE',
  NG: 'GI',
  UM: 'KA',
  RY: 'HI'
};

var zenkaku_number_map = {
  '０': 0,
  '１': 1,
  '２': 2,
  '３': 3,
  '４': 4,
  '５': 5,
  '６': 6,
  '７': 7,
  '８': 8,
  '９': 9
};

/*
 * Kifu object
 */
var Kifu = (function(source, format) {
  return new Kifu.initialize(source, format);
});

Kifu.extend = Kifu.prototype.extend = function(source) {
  for (var property in source) {
    this[property] = source[property];
  }
  return this;
};

Kifu.prototype.extend({
  checkFromAreas: function(board, areas, is_black, piece) {
    var result = [];
    var l      = areas.length;
    for (var i = 0; i < l; i++) {
      var area = areas[i];
      var x    = area[0];
      var y    = area[1];
      if (x < 1 || 9 < x || y < 1 || 9 < y) {
        continue;
      }
      var cell = board[x][y];
      if (cell && cell.is_black == is_black && cell.piece == piece) {
        result.push(area);
      }
    }
    return result;
  },

  findFromAreasFU: function(suite, move) {
    var to = move.to;
    var y  = to.y + (move.is_black ? 1 : -1);
    return [[to.x, y]];
  },

  findFromAreasKY: function(suite, move) {
    var board = suite.board;
    var to    = move.to;
    var x     = to.x;
    if (move.is_black) {
      for (var y = to.y + 1; y <= 9; y++) {
        if (board[x][y]) return [[x, y]];
      }
    } else {
      for (var y = to.y - 1; 1 <= y; y--) {
        if (board[x][y]) return [[x, y]];
      }
    }
    return [];
  },

  findFromAreasKE: function(suite, move) {
    var to = move.to;
    var x  = to.x;
    var y  = to.y + (move.is_black ? 2 : -2);
    return [[x+1, y], [x-1, y]];
  },

  findFromAreasGI: function(suite, move) {
    var to    = move.to;
    var x     = to.x;
    var y     = to.y;
    var areas = [[x+1, y+1], [x+1, y-1], [x-1, y+1], [x-1, y-1]];
    if (move.is_black) {
      areas.push([x, y+1]);
    } else {
      areas.push([x, y-1]);
    }
    return areas;
  },

  findFromAreasKI: function(suite, move) {
    var to    = move.to;
    var x     = to.x;
    var y     = to.y;
    var areas = [[x+1, y], [x-1, y], [x, y+1], [x, y-1]];
    if (move.is_black) {
      areas.push([x+1, y+1]);
      areas.push([x-1, y+1]);
    } else {
      areas.push([x+1, y-1]);
      areas.push([x-1, y-1]);
    }
    return areas;
  },

  findFromAreasKA: function(suite, move) {
    var board = suite.board;
    var to    = move.to;
    var to_x  = to.x;
    var to_y  = to.y;
    var areas = [];

    for (var i = 1; i <= 8; i++) {
      var x = to_x + i; var y = to_y + i;
      if (x < 1 || 9 < x || y < 1 || 9 < y) break;
      if (board[x][y]) { areas.push([x, y]); break; }
    }
    for (var i = 1; i <= 8; i++) {
      var x = to_x + i; var y = to_y - i;
      if (x < 1 || 9 < x || y < 1 || 9 < y) break;
      if (board[x][y]) { areas.push([x, y]); break; }
    }
    for (var i = 1; i <= 8; i++) {
      var x = to_x - i; var y = to_y + i;
      if (x < 1 || 9 < x || y < 1 || 9 < y) break;
      if (board[x][y]) { areas.push([x, y]); break; }
    }
    for (var i = 1; i <= 8; i++) {
      var x = to_x - i; var y = to_y - i;
      if (x < 1 || 9 < x || y < 1 || 9 < y) break;
      if (board[x][y]) { areas.push([x, y]); break; }
    }

    return areas;
  },

  findFromAreasHI: function(suite, move) {
    var board = suite.board;
    var to    = move.to;
    var areas = [];

    var y = to.y;
    for (var x = to.x + 1; x <= 9; x++) {
      if (board[x][y]) { areas.push([x, y]); break; }
    }
    for (var x = to.x - 1; 1 <= x; x--) {
      if (board[x][y]) { areas.push([x, y]); break; }
    }

    var x = to.x;
    for (var y = to.y + 1; y <= 9; y++) {
      if (board[x][y]) { areas.push([x, y]); break; }
    }
    for (var y = to.y - 1; 1 <= y; y--) {
      if (board[x][y]) { areas.push([x, y]); break; }
    }

    return areas;
  },

  findFromAreasOU: function(suite, move) {
    var to = move.to;
    var x  = to.x;
    var y  = to.y;
    return [[x+1, y+1], [x+1, y], [x+1, y-1], [x, y+1], [x, y-1],
      [x-1, y+1], [x-1, y], [x-1, y-1]];
  },

  findFromAreasTO: function(suite, move) {
    return this.findFromAreasKI(suite, move);
  },

  findFromAreasNY: function(suite, move) {
    return this.findFromAreasKI(suite, move);
  },

  findFromAreasNK: function(suite, move) {
    return this.findFromAreasKI(suite, move);
  },

  findFromAreasNG: function(suite, move) {
    return this.findFromAreasKI(suite, move);
  },

  findFromAreasUM: function(suite, move) {
    var areas = this.findFromAreasKA(suite, move);
    var to    = move.to;
    var x     = to.x;
    var y     = to.y;
    areas.push([x+1, y]);
    areas.push([x-1, y]);
    areas.push([x, y+1]);
    areas.push([x, y-1]);
    return areas;
  },

  findFromAreasRY: function(suite, move) {
    var areas = this.findFromAreasHI(suite, move);
    var to    = move.to;
    var x     = to.x;
    var y     = to.y;
    areas.push([x+1, y+1]);
    areas.push([x+1, y-1]);
    areas.push([x-1, y+1]);
    areas.push([x-1, y-1]);
    return areas;
  },

  findFromCell: function(suite, move) {
    var from  = move.from;
    var piece = from.piece;

    var method = 'findFromAreas' + piece;
    var areas  = this[method](suite, move);
    areas      = this.checkFromAreas(suite.board, areas, move.is_black, piece);
    if (areas.length == 1) {
      var area = areas[0];
      from.x   = area[0];
      from.y   = area[1];
      return true;
    } else if (areas.length == 0) {
      from.x = 0;
      from.y = 0;
      return true;
    }

    return this.findFromCellByDirection(move, areas);
  },

  findFromCellByDirection: function(move, areas) {
    var is_black = move.is_black;
    var from     = move.from;
    var to       = move.to;
    var to_x     = to.x;
    var to_y     = to.y;

    var relative = move.relative;
    if (relative) {
      var new_areas = [];
      var l         = areas.length;
      for (var i = 0; i < l; i++) {
        var area = areas[i];
        if ((relative == 'right' && is_black) || (relative == 'left' && !is_black)) {
          if (area[0] < to_x) new_areas.push(area);
        } else {
          if (to_x < area[0]) new_areas.push(area);
        }
      }

      if (new_areas.length == 1) {
        var area = new_areas[0];
        from.x   = area[0];
        from.y   = area[1];
        return true;
      } else if (new_areas.length == 0) {
        return false;
      }

      areas = new_areas;
    }

    var direction = move.direction;
    if (direction) {
      var new_areas = [];
      var l         = areas.length;
      for (var i = 0; i < l; i++) {
        var area = areas[i];
        switch (direction) {
        case 'down':
          if (is_black) {
            if (area[1] < to_y) new_areas.push(area);
          } else {
            if (to_y < area[1]) new_areas.push(area);
          }
          break;

        case 'horizon':
          if (area[1] == to_y) new_areas.push(area);
          break;

        case 'straight_up':
          if (area[0] == to_x) {
            if (is_black) {
              if (to_y < area[1]) new_areas.push(area);
            } else {
              if (area[1] < to_y) new_areas.push(area);
            }
          }
          break;

        case 'up':
          if (is_black) {
            if (to_y < area[1]) new_areas.push(area);
          } else {
            if (area[1] < to_y) new_areas.push(area);
          }
          break;
        }
      }

      if (new_areas.length == 1) {
        var area = new_areas[0];
        from.x   = area[0];
        from.y   = area[1];
        return true;
      }
    }

    return false;
  },

  hasNext: function() {
    var move = this.moves.get(this.step+1);
    if (move && move.type == 'move') {
      return true;
    }
    return false;
  },

  hasPrev: function() {
    if (this.step > 0) {
      var move = this.moves.get(this.step-1);
      if (move && move.type == 'move') {
        return true;
      }
    }
    return false;
  },

  moveCurrent: function() {
    var move = this.moves.get(this.step);
    if (move && move.type == 'move') return move;
    return null;
  },

  moveFirst: function() {
    this.is_black = this.info.player_start == 'black';
    this.step     = 0;
    this.suite    = this.suite_init.clone();
    return this;
  },

  moveLast: function() {
    do {
      var step = this.step;
      this.moveNext();
    } while(step != this.step);
  },

  moveNext: function() {
    var move = this.moves.get(this.step+1);
    if (move && move.type == 'move') {
      this.suite.move(move);
      this.is_black = !move.is_black;
      this.step++;
    }
    return move;
  },

  movePrev: function() {
    var move = this.moves.get(this.step);
    if (move && move.type == 'move') {
      this.suite.moveReverse(move);
      this.is_black = move.is_black;
      this.step--
    }
    return move;
  },

  moveStrings: function() {
    var result       = [];
    var move_records = this.moves.records;
    for (var i in move_records) {
      var move = move_records[i];
      if (move.str) {
        result.push(move.str);
      }
    }
    return result;
  },

  moveTo: function(step) {
    this.moveFirst();
    while (step != this.step) {
      this.moveNext();
    }
  },

  output: function(format)
  {
    var klass  = Kifu.capitalize(format);
    var parser = Kifu[klass](this);
    return parser.output();
  },

  parse: function(format) {
    if (format) {
      this.info.format = format;
    }

    var klass = Kifu.capitalize(this.info.format);
    this.parser = Kifu[klass](this);
    this.parser.parse();
    this.prepare();

    this.moveFirst();
    return this;
  },

  prepare: function() {
    var info = this.info;

    if (!info.player_start) {
      info.player_start = 'black';
    }

    var suite        = this.suite_init.clone();
    var move_records = this.moves.records;
    for (var i in move_records) {
      var m = move_records[i];
      if (!m || m.type != 'move') continue;
      m.from || (m.from = {});
      var move_prev = move_records[i-1];
      var move      = m;
      var from      = move.from;
      var to        = move.to;

      if (typeof move.is_black == 'undefined') {
        if (move_prev.type == 'init') {
          move.is_black = info.player_start == 'black';
        } else {
          move.is_black = !move_prev.is_black;
        }
      }

      if (to.x == 0) {
        to.x = move_prev.to.x;
        to.y = move_prev.to.y;
      }

      if (typeof from.piece == 'undefined') {
        if (from.x) {
          from.piece = suite.board[from.x][from.y].piece;
        } else {
          from.piece = to.piece;
        }
      }

      if (typeof from.x == 'undefined') {
        this.findFromCell(suite, move);
      }

      if (typeof move.is_same_place == 'undefined') {
        if (move_prev.type == 'init') {
          move.is_same_place = false;
        } else {
          move.is_same_place = move_prev.to.x == to.x && move_prev.to.y == to.y;
        }
      }

      var cell = suite.board[to.x][to.y];
      if (cell) {
        move.stand = {
          piece: cell.piece,
          stand: original_piece_map[cell.piece]
        };
      }

      if (!move.str) {
        var str = '';
        if (move.is_same_place) {
          str += '同';
        } else {
          str += Kifu.integerToZenkaku(to.x);
          str += Kifu.integerToKanji(to.y);
        }
        str += Kifu.pieceToMovePiece(from.piece);
        if (from.piece != to.piece) {
          str += '成';
        }
        if (!from.x) {
          str += '打';
        }
        move.str = str;
      }

      suite.move(move);
    }

    return this;
  },

  source: function(source) {
    if (source) {
      this.info.source = Kifu.load(source);
    }
    return this.info.source;
  }
});

Kifu.extend({
  initialize: function(source, format) {
    this.suite_init = Kifu.Suite();
    this.info       = {};
    this.moves      = Kifu.Move();

    if (source) {
      this.source(source);
    }

    if (format) {
      this.parse(format);
    }
  },

  ajax: function(options, format, func_obj) {
    options.dataType = 'text';
    options.type     = 'GET';
    options.success  = function(source) {
      return func_obj(Kifu(source, format));
    };
    return jQuery.ajax(options);
  },

  ajaxLoad: function(url, format, func_obj) {
    return Kifu.ajax({url: url}, format, func_obj);
  },

  boardPieceToPiece: function(kanji) {
    return board_piece_map[kanji];
  },

  capitalize: function(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
  },

  clone: function(source) {
    if (source instanceof Array) {
      var result = [];
    } else {
      var result = {};
    }

    for (var property in source) {
      var value = source[property];
      if (value === null) {
        result[property] = value;
      } else if (typeof value == 'object') {
        result[property] = Kifu.clone(value);
      } else {
        result[property] = value;
      }
    }

    return result;
  },

  integerToKanji: function(num) {
    var str = '';

    if (10 <= num) {
      str += '十';
    }

    num = num % 10;
    for (var name in kanji_number_map) {
      if (kanji_number_map[name] == num) {
        str += name;
        break;
      }
    }

    return str;
  },

  integerToZenkaku: function(num) {
    for (var name in zenkaku_number_map) {
      if (zenkaku_number_map[name] == num) {
        return name;
      }
    }
  },

  kanjiToInteger: function(kanji) {
    var num = 0;
    var l   = kanji.length;
    for (var i = 0; i < l; i++) {
      num += kanji_number_map[kanji.substr(i, 1)];
    }
    return num;
  },

  load: function(source) {
    var element = document.getElementById(source);
    if (element) {
      return element.innerHTML;
    } else {
      return source;
    }
  },

  movePieceToPiece: function(kanji) {
    return move_piece_map[kanji];
  },

  noConflict: function() {
    window.Kifu = _Kifu;
    return Kifu;
  },

  pieceToBoardPiece: function(piece) {
    for (var name in board_piece_map) {
      if (board_piece_map[name] == piece) {
        return name;
      }
    }
  },

  pieceToMovePiece: function(piece) {
    for (var name in move_piece_map) {
      if (move_piece_map[name] == piece) {
        return name;
      }
    }
  },

  zenkakuToInteger: function(zenkaku) {
    return zenkaku_number_map[zenkaku];
  }
});


Kifu.initialize.prototype = Kifu.prototype;
window.Kifu = Kifu;
})(window);


// Local variables:
// indent-tabs-mode: nil
// js2-basic-offset: 2
// end:
// vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2:
