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

var direction_map = {
  左: 'left',
  右: 'right',
  直: 'straight_up'
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

var movement_map = {
  上: 'up',
  寄: 'horizon',
  引: 'down',
  下: 'down',  // optional
  行: 'up',    // optional
  入: 'up'     // optional
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
    Kifu.Prepare(this);

    this.moveFirst();
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

  directionToKanji: function(direction) {
    for (var name in direction_map) {
      if (direction_map[name] == direction) {
        return name;
      }
    }
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

  kanjiToDirection: function(kanji) {
    return direction_map[kanji];
  },

  kanjiToMovement: function(kanji) {
    return movement_map[kanji];
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

  movementToKanji: function(movement) {
    for (var name in movement_map) {
      if (movement_map[name] == movement) {
        return name;
      }
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
