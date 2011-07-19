/*
 * core.js
 *
 * Copyright 2011, Masato Bito
 * Licensed under the MIT license.
 *
 */
(function(window) {


var _Kifu = window.Kifu;

var number_x_map = {
  1: '１',
  2: '２',
  3: '３',
  4: '４',
  5: '５',
  6: '６',
  7: '７',
  8: '８',
  9: '９'
};

var number_y_map = {
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '七',
  8: '八',
  9: '九'
};

var piece_map = {
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

var piece_string_map = {
  FU: '歩',
  KY: '香',
  KE: '桂',
  GI: '銀',
  KI: '金',
  KA: '角',
  HI: '飛',
  OU: '王',
  TO: 'と',
  NY: '成香',
  NK: '成桂',
  NG: '成銀',
  UM: '馬',
  RY: '竜'
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
          stand: piece_map[cell.piece]
        };
      }

      if (!move.str) {
        var str = '';
        if (move.is_same_place) {
          str += '同';
        } else {
          str += number_x_map[to.x];
          str += number_y_map[to.y];
        }
        if (from.piece == to.piece) {
          str += piece_string_map[to.piece];
        } else {
          str += piece_string_map[from.piece] + '成';
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

  load: function(source) {
    var element = document.getElementById(source);
    if (element) {
      return element.innerHTML;
    } else {
      return source;
    }
  },

  noConflict: function() {
    window.Kifu = _Kifu;
    return Kifu;
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
