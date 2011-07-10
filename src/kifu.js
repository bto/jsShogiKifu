/*
 * Kifu.js
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


/*
 * Kifu.Move Object
 */
Kifu.Move = (function() { return new Kifu.Move.initialize(); });
Kifu.Move.extend = Kifu.Move.prototype.extend = Kifu.extend;

Kifu.Move.prototype.extend({
  addComment: function(comment) {
    var move = this.records[this.records.length-1];
    move.comment = (move.comment || '') + comment + "\n";
    return this;
  },

  addMove: function(from, to, piece, options) {
    var move = this.newMove();
    move.from = {x: from[0], y: from[1]};
    move.to   = {piece: piece, x: to[0], y: to[1]};
    move.type = 'move';
    for (var property in options) {
      move[property] = options[property];
    }
    return this;
  },

  addPeriod: function(period) {
    this.records[this.records.length-1].period = period;
    return this;
  },

  addSpecial: function(type, options) {
    var move = this.newMove();
    move.type = type;
    for (var property in options) {
      move[property] = options[property];
    }
    return this;
  },

  clone: function() {
    var obj = new Kifu.Move;
    obj.records = Kifu.clone(this.records);
    return obj;
  },

  get: function(step) {
    return this.records[step];
  },

  getLastMoveNum: function() {
    var move;
    var len = this.records.length;
    if (len <= 1) return 0;

    move = this.records[len - 1];
    if (move.type != 'move') len--; // ignore 'TORYO'
    return len - 1;   // ignore 'init'
  },

  newMove: function() {
    var move = this.records[this.records.length-1];
    if (move.type) {
      this.records.push({});
      move = this.records[this.records.length-1];
    }
    return move;
  },

  setMove: function(num, from, to, piece, options) {
    var records = this.records;
    records[num] || (records[num] = {});
    var move = records[num];
    move.from = {x: from[0], y: from[1]};
    move.to   = {piece: piece, x: to[0], y: to[1]};
    move.type = 'move';
    for (var property in options) {
      move[property] = options[property];
    }
    return this;
  }
});

Kifu.Move.extend({
  initialize: function() {
    this.records = [{type: 'init'}];
  }
});

Kifu.Move.initialize.prototype = Kifu.Move.prototype;


/*
 * Kifu.Suite Object
 */
Kifu.Suite = (function() { return new Kifu.Suite.initialize(); });
Kifu.Suite.extend = Kifu.Suite.prototype.extend = Kifu.extend;

Kifu.Suite.prototype.extend({
  cellDeploy: function(x, y, piece, black) {
    var pieces = this.pieces;
    if (this.board[x][y]) {
      return false;
    }
    var piece_org = piece_map[piece];
    if (!pieces[piece_org]) {
      return false;
    }
    this.cellSet(x, y, piece, black);
    pieces[piece_org]--;
    return this;
  },

  cellGet: function(x, y) {
    return this.board[x][y];
  },

  cellRemove: function(x, y, piece) {
    var cell = this.board[x][y];
    if (!cell) {
      return false;
    }
    if (!this.cellTrash(x, y, piece)) {
      return false;
    }
    this.pieces[piece_map[cell.piece]]++;
    return this;
  },

  cellSet: function(x, y, piece, black) {
    this.board[x][y] = {black: black, piece: piece};
    return this;
  },

  cellTrash: function(x, y, piece) {
    var cell = this.board[x][y];
    if (!cell) {
      return false;
    }
    if (!piece) {
      piece = cell.piece;
    }
    if (piece != cell.piece) {
      return false;
    }

    this.board[x][y] = null;
    return this;
  },

  clone: function() {
    var obj = new Kifu.Suite;
    obj.board  = Kifu.clone(this.board);
    obj.pieces = Kifu.clone(this.pieces);
    obj.stand  = Kifu.clone(this.stand);
    return obj;
  },

  setup: function(handicap) {
    if (handicap == 'Other') return this;
    this.hirate();
    if (handicap == 'Even' || handicap == null) return this;

    switch (handicap) {
    case 'Lance':
	this.cellRemove(1, 1, 'KY');
	break;
    case 'Right_Lance':
	this.cellRemove(9, 1, 'KY');
	break;
    case 'Bishop':
	this.cellRemove(2, 2, 'KA');
	break;
    case 'Rook_and_Lance':
	this.cellRemove(1, 1, 'KY');
    case 'Rook':
	this.cellRemove(8, 2, 'HI');
	break;

    case 'Six_Drops':
	this.cellRemove(2, 1, 'KE');
	this.cellRemove(8, 1, 'KE');
    case 'Four_Drops':
	this.cellRemove(1, 1, 'KY');
	this.cellRemove(9, 1, 'KY');
    case 'Two_Drops':
	this.cellRemove(8, 2, 'HI');
	this.cellRemove(2, 2, 'KA');
	break;

    default:
	alert('Invalid handicap: ' + this.handicap);
	break;
    }
    return this;
  },

  hirate: function() {
    this.cellDeploy(1, 9, 'KY', true);
    this.cellDeploy(2, 9, 'KE', true);
    this.cellDeploy(3, 9, 'GI', true);
    this.cellDeploy(4, 9, 'KI', true);
    this.cellDeploy(5, 9, 'OU', true);
    this.cellDeploy(6, 9, 'KI', true);
    this.cellDeploy(7, 9, 'GI', true);
    this.cellDeploy(8, 9, 'KE', true);
    this.cellDeploy(9, 9, 'KY', true);
    this.cellDeploy(8, 8, 'KA', true);
    this.cellDeploy(2, 8, 'HI', true);
    for (i = 1; i <= 9; i++) {
      this.cellDeploy(i, 7, 'FU', true);
    }

    this.cellDeploy(1, 1, 'KY', false);
    this.cellDeploy(2, 1, 'KE', false);
    this.cellDeploy(3, 1, 'GI', false);
    this.cellDeploy(4, 1, 'KI', false);
    this.cellDeploy(5, 1, 'OU', false);
    this.cellDeploy(6, 1, 'KI', false);
    this.cellDeploy(7, 1, 'GI', false);
    this.cellDeploy(8, 1, 'KE', false);
    this.cellDeploy(9, 1, 'KY', false);
    this.cellDeploy(2, 2, 'KA', false);
    this.cellDeploy(8, 2, 'HI', false);
    for (i = 1; i <= 9; i++) {
      this.cellDeploy(i, 3, 'FU', false);
    }

    return this;
  },

  move: function(move) {
    var black = move.black;
    var from  = move.from;
    var stand = move.stand;
    var to    = move.to;

    if (from.x) {
      this.cellTrash(from.x, from.y);
    } else {
      this.standTrash(from.piece, black);
    }

    this.cellSet(to.x, to.y, to.piece, black);

    if (stand) {
      this.standSet(stand.stand, black);
    }

    return this;
  },

  moveReverse: function(move) {
    var black = move.black;
    var from  = move.from;
    var stand = move.stand;
    var to    = move.to;

    if (stand) {
      this.standTrash(stand.stand, black);
      this.cellSet(to.x, to.y, stand.piece, !black);
    } else {
      this.cellTrash(to.x, to.y);
    }

    if (from.x) {
      this.cellSet(from.x, from.y, from.piece, black);
    } else {
      this.standSet(from.piece, black);
    }

    return this;
  },

  standDeployN: function(piece, black, n) {
    var player = black ? 'black' : 'white';
    var stand  = this.stand[player];
    var pieces = this.pieces;

    if (pieces[piece] >= n) {
      var stand = this.stand[player];
      stand[piece] || (stand[piece] = 0);
      stand[piece] += n;
      pieces[piece] -= n;
    }
    else {
      return false;
    }
    return this;
  },

  standDeploy: function(piece, black) {
    var player = black ? 'black' : 'white';
    var stand  = this.stand[player];
    var pieces = this.pieces;

    if (piece == 'AL') {
      for (var p in pieces) {
        if (p == 'OU') {
          continue;
        }
        stand[p] || (stand[p] = 0);
        stand[p] += pieces[p];
        pieces[p] = 0;
      }
    } else if (pieces[piece]) {
      this.standSet(piece, black);
      pieces[piece]--;
    } else {
      return false;
    }
    return this;
  },

  standRemove: function(piece, black) {
    if (!this.standTrash(piece, black)) {
      return false;
    }
    this.pieces[piece]++;
    return this;
  },

  standSet: function(piece, black) {
    var player = black ? 'black' : 'white';
    var stand = this.stand[player];
    stand[piece] || (stand[piece] = 0);
    stand[piece]++;
    return this;
  },

  standTrash: function(piece, black) {
    var player = black ? 'black' : 'white';
    var stand = this.stand[player];
    if (!stand[piece]) {
      return false;
    }
    stand[piece]--;
    return this;
  }
});

Kifu.Suite.extend({
  initialize: function() {
    this.board  = Kifu.Suite.boardEmpty();
    this.pieces = Kifu.Suite.piecesDefault();
    this.stand  = {
      black: Kifu.Suite.standEmpty(),
      white: Kifu.Suite.standEmpty()};
  },

  boardEmpty: function() {
    var board = {};
    for (var i = 1; i <= 9; i++) {
      board[i] = {}
      for (var j = 1; j <= 9; j++) {
        board[i][j] = null;
      }
    }
    return board;
  },

  piecesDefault: function() {
    return {FU: 18, KY: 4, KE: 4, GI: 4, KI: 4, KA: 2, HI: 2, OU: 2};
  },

  standEmpty: function() {
    return {FU: 0, KY: 0, KE: 0, GI: 0, KI: 0, KA: 0, HI: 0, OU: 0};
  }
});

Kifu.Suite.initialize.prototype = Kifu.Suite.prototype;


window.Kifu = Kifu;
})(window);


/*
 * Kifu.Csa Object
 */
(function(Kifu) {
Kifu.Csa = (function(kifu) { return new Kifu.Csa.initialize(kifu); });
Kifu.Csa.extend = Kifu.Csa.prototype.extend = Kifu.extend;

Kifu.Csa.prototype.extend({
  parse: function() {
    var lines = this.toLines(this.kifu.info.source);
    for (var i in lines) {
      var line = lines[i];
      this.parseByLine(line);
    }

    return this;
  },

  parseByLine: function(line) {
    var kifu = this.kifu;

    if (line == '+') {
      kifu.info.player_start = 'black';
      return true;
    } else if (line == '-') {
      kifu.info.player_start = 'white';
      return true;
    } else if (line.substr(0, 2) == "'*") {
      kifu.moves.addComment(line.substr(2));
      return true;
    }

    switch (line.charAt(0)) {
    case '$':
      var pos   = line.indexOf(':');
      var key   = line.substr(1, pos-1).toLowerCase();
      var value = line.substr(pos+1);

      switch (key) {
      case 'end_time':
      case 'start_time':
        var date = new Date();
        date.setTime(Date.parse(value));
        value = date;
        break;

      case 'time_limit':
        var hours   = parseInt(value.substr(0, 2));
        var minutes = parseInt(value.substr(3, 2));
        var extra   = parseInt(value.substr(6));
        value = {
          allotted: hours * 60 + minutes,
          extra: extra};
        break;
      }

      kifu.info[key] = value;
      return true;

    case '%':
      var value   = line.substr(1);
      var options = {};

      switch (value.charAt(0)) {
      case '+':
      case '-':
        options.black = value.charAt(0) == '+' ? true : false;
        value = value.substr(1);
        break;
      }

      kifu.moves.addSpecial(value, options);
      return true;

    case '+':
    case '-':
      var from = [line.charAt(1)-'0', line.charAt(2)-'0'];
      var to   = [line.charAt(3)-'0', line.charAt(4)-'0'];
      var piece = line.substr(5, 2);
      var black = line.charAt(0) == '+' ? true : false;
      kifu.moves.addMove(from, to, piece, {black: black});
      return true;

    case 'N':
      var player = 'player_' + (line.charAt(1) == '+' ? 'black' : 'white');
      kifu.info[player] = line.substr(2);
      return true;

    case 'P':
      switch (line.charAt(1)) {
      case 'I':
        kifu.suite_init.hirate();
        for (var i = 0; ; i++) {
          var p_info = line.substr(2+i*4, 4);
          if (p_info.length < 4) {
            break;
          }
          var x     = p_info.charAt(0) - '0';
          var y     = p_info.charAt(1) - '0';
          var piece = p_info.substr(2);
          kifu.suite_init.cellRemove(x, y, piece);
        }
        return true;

      case '+':
      case '-':
        var black = line.charAt(1) == '+';
        for (var i = 0; ; i++) {
          var p_info = line.substr(2+i*4, 4);
          if (p_info.length < 4) {
            break;
          }
          var x     = p_info.charAt(0) - '0';
          var y     = p_info.charAt(1) - '0';
          var piece = p_info.substr(2);
          if (x == 0 && y == 0) {
            kifu.suite_init.standDeploy(piece, black);
          } else {
            kifu.suite_init.cellDeploy(x, y, piece, black);
          }
        }
        return true;

      default:
        var y = line.charAt(1) - '0';
        if (y < 1 || 9 < y) {
          return false;
        }
        for (var i = 0; i < 9; i++) {
          var p_info = line.substr(2+i*3, 3);
          switch (p_info.charAt(0)) {
          case '+':
            var black = true;
            break;
          case '-':
            var black = false;
            break;
          default:
            continue;
          }
          var x     = 9 - i;
          var piece = p_info.substr(1, 2);
          kifu.suite_init.cellDeploy(x, y, piece, black);
        }
        return true;
      }
      return false;

    case 'T':
      var period = parseInt(line.substr(1));
      kifu.moves.addPeriod(period);
      return true;

    case 'V':
      kifu.info.version = line.substr(1);
      return true;
    }

    return false;
  },

  toLines: function(source) {
    var result = [];
    var lines = source.replace(/,(\r?\n|\r)/g, '').split(/\r?\n|\r/);
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

Kifu.Csa.extend({
  initialize: function(kifu) {
    this.kifu = kifu;
  }
});

Kifu.Csa.initialize.prototype = Kifu.Csa.prototype
})(Kifu);


/*
 * Kifu.Kif Object
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
      var piece = this.board_piece_map[value.substr(0, 1)];
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
