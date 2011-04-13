/*
 * Kifu.js
 */
(function(window) {


var _Kifu = window.Kifu;

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
}

Kifu.prototype.extend({
  next: function() {
    var move = this.moves.get(this.step+1);
    if (move) {
      if (typeof move['black'] == 'undefined') {
        move['black'] = this.black;
      }
      this.board.move(move);
      this.black = !move['black'];
      this.step++;
    }
    return move;
  },

  parse: function(format) {
    if (format) {
      this.info['format'] = format;
    }

    var klass = Kifu.capitalize(this.info['format']);
    Kifu[klass].parse(this);

    this.black = this.info['player_start'] == 'black';
    this.board = this.board_init.clone();
    this.step  = 0;

    return this;
  },

  prev: function() {
    var move = this.moves.get(this.step);
    if (move) {
      this.board.moveReverse(move);
      this.black = move['black'];
      this.step--
    }
    return move;
  },

  source: function(source) {
    if (source) {
      this.info['source'] = Kifu.load(source);
    }
    return this.info['source'];
  }
});

Kifu.extend({
  initialize: function(source, format) {
    this.board_init = Kifu.Board();
    this.info       = {player_start: 'black'};
    this.moves      = Kifu.Move();

    if (source) {
      this.source(source);
    }

    if (format) {
      this.parse(format);
    }
  },

  ajax: function(options, format, func_obj) {
    options['dataType'] = 'text';
    options['type']     = 'GET';
    options['success']  = function(source) {
      return func_obj(Kifu(source, format));
    };
    return jQuery.ajax(options);
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

Kifu.initialize.prototype = Kifu.prototype

/*
 * Kifu.Board Object
 */
Kifu.Board = (function() { return new Kifu.Board.initialize(); });
Kifu.Board.extend = Kifu.Board.prototype.extend = Kifu.extend;

Kifu.Board.prototype.extend({
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
    pieces[piece_org] -= 1;
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
    this.pieces[piece_map[cell['piece']]] += 1;
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
      piece = cell['piece'];
    }
    if (piece != cell['piece']) {
      return false;
    }

    this.board[x][y] = null;
    return this;
  },

  clone: function() {
    var obj = new Kifu.Board;
    obj.board  = Kifu.clone(this.board);
    obj.pieces = Kifu.clone(this.pieces);
    obj.stand  = Kifu.clone(this.stand);
    return obj;
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
    var x1    = move['from']['x'];
    var y1    = move['from']['y'];
    var x2    = move['to']['x'];
    var y2    = move['to']['y'];
    var to    = this.board[x2][y2];
    var black = move['black'];

    if (to) {
      var stand_piece = piece_map[to['piece']];
      this.standSet(stand_piece, black);
      move['stand'] = {piece: to['piece'], stand: stand_piece};
    }

    this.cellSet(x2, y2, move['to']['piece'], black);
    if (x1) {
      move['from']['piece'] = this.board[x1][y1]['piece'];
      this.cellTrash(x1, y1);
    } else {
      move['from']['piece'] = move['to']['piece'];
      this.standTrash(move['to']['piece'], black);
    }

    return this;
  },

  moveReverse: function(move) {
    var x1    = move['from']['x'];
    var y1    = move['from']['y'];
    var x2    = move['to']['x'];
    var y2    = move['to']['y'];
    var black = move['black'];

    if (x1) {
      this.cellSet(x1, y1, move['from']['piece'], black);
    } else {
      this.standSet(move['from']['piece'], black);
    }

    if (move['stand']) {
      this.cellSet(x2, y2, move['stand']['piece'], !black);
      this.standTrash(move['stand']['stand'], black);
    } else {
      this.cellTrash(x2, y2);
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
        stand[p]  = stand[p] || 0;
        stand[p] += pieces[p];
        pieces[p] = 0;
      }
    } else if (pieces[piece]) {
      this.standSet(piece, black);
      pieces[piece] -= 1;
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
    stand[piece] = stand[piece] || 0;
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

Kifu.Board.extend({
  initialize: function() {
    this.board  = Kifu.Board.boardEmpty();
    this.pieces = Kifu.Board.piecesDefault();
    this.stand  = {
      black: Kifu.Board.standEmpty(),
      white: Kifu.Board.standEmpty()};
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

Kifu.Board.initialize.prototype = Kifu.Board.prototype


/*
 * Kifu.Move Object
 */
Kifu.Move = (function() { return new Kifu.Move.initialize(); });
Kifu.Move.extend = Kifu.Move.prototype.extend = Kifu.extend;

Kifu.Move.prototype.extend({
  addComment: function(comment) {
    var move = this.moves[this.moves.length-1];
    move['comment'] = (move['comment'] || '') + comment + "\n";
    return this;
  },

  addMove: function(from, to, piece, options) {
    var move = this.newMove();
    move['type']  = 'move';
    move['from']  = {x: from[0], y: from[1]};
    if (to[0] == 0) {
      for (var i = this.moves.length-2; 0 <= i; i--) {
        var to_prev = this.moves[i]['to'];
        if (to_prev) break;
      }
      move['to'] = {piece: piece, x: to_prev['x'], y: to_prev['y']};
    } else {
      move['to'] = {piece: piece, x: to[0], y: to[1]};
    }
    for (var property in options) {
      move[property] = options[property];
    }
    return this;
  },

  addPeriod: function(period) {
    this.moves[this.moves.length-1]['period'] = period;
    return this;
  },

  addSpecial: function(type, options) {
    var move = this.newMove();
    move['type'] = type;
    for (var property in options) {
      move[property] = options[property];
    }
    return this;
  },

  get: function(step) {
    return this.moves[step];
  },

  newMove: function() {
    var move = this.moves[this.moves.length-1];
    if (move['type']) {
      this.moves.push({});
      move = this.moves[this.moves.length-1];
    }
    return move;
  }
});

Kifu.Move.extend({
  initialize: function() {
    this.moves = [{type: 'init'}];
  }
});

Kifu.Move.initialize.prototype = Kifu.Move.prototype


window.Kifu = Kifu;
})(window);


/*
 * Kifu.Csa Object
 */
(function(Kifu) {
Kifu.Csa = {
  parse: function(kifu) {
    var lines = Kifu.Csa.toLines(kifu.info['source']);
    for (var i in lines) {
      var line = lines[i];
      Kifu.Csa.parseByLine(line, kifu);
    }

    return kifu;
  },

  parseByLine: function(line, kifu) {
    if (line == '+') {
      kifu.info['player_start'] = 'black';
      return true;
    } else if (line == '-') {
      kifu.info['player_start'] = 'white';
      return true;
    } else if (line.substr(0, 3) == "'* ") {
      kifu['moves'].addComment(line.substr(3));
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
        options['black'] = value.charAt(0) == '+' ? true : false;
        value = value.substr(1);
        break;
      }

      kifu['moves'].addSpecial(value, options);
      return true;

    case '+':
    case '-':
      var from = [line.charAt(1)-'0', line.charAt(2)-'0'];
      var to   = [line.charAt(3)-'0', line.charAt(4)-'0'];
      var piece = line.substr(5, 2);
      var black = line.charAt(0) == '+' ? true : false;
      kifu['moves'].addMove(from, to, piece, {black: black});
      return true;

    case 'N':
      var player = 'player_' + (line.charAt(1) == '+' ? 'black' : 'white');
      kifu.info[player] = line.substr(2);
      return true;

    case 'P':
      switch (line.charAt(1)) {
      case 'I':
        kifu.board_init.hirate();
        for (var i = 0; ; i++) {
          var p_info = line.substr(2+i*4, 4);
          if (p_info.length < 4) {
            break;
          }
          var x     = p_info.charAt(0) - '0';
          var y     = p_info.charAt(1) - '0';
          var piece = p_info.substr(2);
          kifu.board_init.cellRemove(x, y, piece);
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
            kifu.board_init.standDeploy(piece, black);
          } else {
            kifu.board_init.cellDeploy(x, y, piece, black);
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
          kifu.board_init.cellDeploy(x, y, piece, black);
        }
        return true;
      }
      return false;

    case 'T':
      var period = parseInt(line.substr(1));
      kifu['moves'].addPeriod(period);
      return true;

    case 'V':
      kifu.info['version'] = line.substr(1);
      return true;
    }

    return false;
  },

  toLines: function(source) {
    var result = [];
    var lines = source.replace(/,(\r\n|\r|\n)/g, '').split(/\r\n|\r|\n/);
    var l = lines.length;
    for (var i = 0; i < l; i++) {
      var line = lines[i];
      if (line) {
        result.push(lines[i]);
      }
    }
    return result;
  }
};
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
  'と金': 'TO',
  '成香': 'NY',
  '成桂': 'NK',
  '成銀': 'NG',
  '馬':   'UM',
  '龍':   'RY'
};

Kifu.Kif = {
  parse: function(kifu) {
    var lines = Kifu.Kif.toLines(kifu.info['source']);
    for (var i in lines) {
      var line = lines[i];
      Kifu.Kif.parseByLine(line, kifu);
    }

    return kifu;
  },

  parseByLine: function(line, kifu) {
    switch (line.charAt(0)) {
    case '*':
      kifu['moves'].addComment(line.substr(1));
      return true;
    }

    if (line.match(/^\s+([0-9]+)\s+(.+)\s+\((.*)\)$/)) {
      var num  = parseInt(RegExp.$1);
      var move = Kifu.Kif.strip(RegExp.$2);
      var time = Kifu.Kif.strip(RegExp.$3);

      if (move == '投了') {
        kifu['moves'].addSpecial('TORYO');
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
      kifu['moves'].addMove(from, to, piece, {str: str});

      return true;
    }

    if (line.match(/(.+)：(.+)/)) {
      var key   = RegExp.$1;
      var value = Kifu.Kif.strip(RegExp.$2);

      switch (key) {
      case '対局ID':
        kifu.info['kif'] = kifu.info['kif'] || {};
        kifu.info['kif']['id'] = parseInt(value);
        return true;

      case '開始日時':
        kifu.info['start_time'] = Kifu.Kif.toDate(value);
        return true;

      case '終了日時':
        kifu.info['end_time'] = Kifu.Kif.toDate(value);
        return true;

      case '表題':
        kifu.info['title'] = value;
        return true;

      case '棋戦':
        kifu.info['event'] = value;
        return true;

      case '持ち時間':
        if (value.match(/([0-9]+)時間/)) {
          kifu.info['time_limit'] = kifu.info['time_limit'] || {};
          kifu.info['time_limit']['allotted'] = parseInt(RegExp.$1) * 60;
        }
        return true;

      case '消費時間':
        if (value.match(/[0-9]+▲([0-9]+)△([0-9]+)/)) {
          kifu.info['time_consumed'] = {
            black: parseInt(RegExp.$1),
            white: parseInt(RegExp.$2)
          };
        }
        return true;

      case '場所':
        kifu.info['site'] = value;
        return true;

      case '戦型':
        kifu.info['opening'] = value;
        return true;

      case '手合割':
        switch (value) {
        case '平手':
        default:
          kifu.board_init.hirate();
          break;
        }
        return true;

      case '先手':
        kifu.info['player_black'] = value;
        return true;

      case '後手':
        kifu.info['player_white'] = value;
        return true;

      default:
        kifu.info['kif'] = kifu.info['kif'] || {};
        kifu.info['kif'][key] = value;
        return true;
      }
    }

    return false;
  },

  strip: function(str) {
    return str.replace(/^\s+/, '').replace(/\s+$/, '');
  },

  toDate: function(str) {
    var date = new Date();
    date.setTime(Date.parse(str));
    return date;
  },

  toLines: function(source) {
    var result = [];
    var lines = source.split(/\r\n|\r|\n/);
    var l = lines.length;
    for (var i = 0; i < l; i++) {
      var line = lines[i];
      if (line) {
        result.push(lines[i]);
      }
    }
    return result;
  }
};
})(Kifu);

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2: */
