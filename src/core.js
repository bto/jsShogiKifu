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
  moveFirst: function() {
    this.black = this.info.player_start == 'black';
    this.step  = 0;
    this.suite = this.suite_init.clone();
    return this;
  },

  moveLast: function() {
    do {
      var step = this.step;
      this.moveNext();
    } while(step != this.step);
  },

  hasNext: function() {
    var move = this.moves.get(this.step+1);
    if (move && move.type == 'move')
      return true;
    return false;
  },

  moveNext: function() {
    var move = this.moves.get(this.step+1);
    if (move && move.type == 'move') {
      this.suite.move(move);
      this.black = !move.black;
      this.step++;
    }
    return move;
  },

  hasPrev: function() {
    if (this.step > 0) {
      var move = this.moves.get(this.step-1);
      if (move && move.type == 'move')
        return true;
    }
    return false;
  },

  movePrev: function() {
    var move = this.moves.get(this.step);
    if (move && move.type == 'move') {
      this.suite.moveReverse(move);
      this.black = move.black;
      this.step--
    }
    return move;
  },

  currMove: function() {
    var move = this.moves.get(this.step);
    if (move && move.type == 'move') return move;
    return null;
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

  parse: function(format) {
    if (format) {
      this.info.format = format;
    }

    var klass = Kifu.capitalize(this.info.format);
    this.parser = Kifu[klass](this);
    this.parser.parse();
    this.prepare();

    this.black = this.info.player_start == 'black';
    this.step  = 0;
    this.suite = this.suite_init.clone();

    return this;
  },

  prepare: function() {
    var info = this.info;

    if (!info.player_start) {
      info.player_start = 'black';
    }

    var black        = info.player_start == 'black';
    var suite        = this.suite_init.clone();
    var move_records = this.moves.records;
    for (var i in move_records) {
      var m = move_records[i];
      if (!m || m.type != 'move') continue;
      var move_prev = move;
      var move      = m;
      var from      = move.from;
      var to        = move.to;

      if (typeof move.black == 'undefined') {
        move.black = black;
      }

      if (!from.piece) {
        if (from.x) {
          from.piece = suite.board[from.x][from.y].piece;
        } else {
          from.piece = to.piece;
        }
      }

      if (to.x == 0) {
        to.x = move_prev.to.x;
        to.y = move_prev.to.y;
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
        str += number_x_map[to.x];
        str += number_y_map[to.y];
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
      black = !move.black;
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
