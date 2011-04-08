/*
 * Kifu.js
 */
(function(window) {


var _Kifu = window.Kifu;

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
  parse: function(format) {
    if (format) {
      this._format = format;
    }
    var klass = Kifu.capitalize(this._format);
    this._kifu = Kifu[klass].parse(this._source);
    console.log(this._kifu);
    return this;
  }
});

Kifu.extend({
  initialize: function(source, format) {
    this._source = Kifu.load(source);
    if (format) {
      this.parse(format);
    }
  },

  ajax: function(url, format, func_obj) {
    jQuery.ajax({
      dataType: 'text',
      type:     'GET',
      url:      url,
      success: function(source) {
        func_obj(Kifu(source, format));
      }
    });
  },

  capitalize: function(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
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
  get: function(x, y) {
    return this._board[x][y];
  },

  hirate: function() {
    this.set(1, 9, 'KY', true);
    this.set(2, 9, 'KE', true);
    this.set(3, 9, 'GI', true);
    this.set(4, 9, 'KI', true);
    this.set(5, 9, 'OU', true);
    this.set(6, 9, 'KI', true);
    this.set(7, 9, 'GI', true);
    this.set(8, 9, 'KE', true);
    this.set(9, 9, 'KY', true);
    this.set(8, 8, 'KA', true);
    this.set(2, 8, 'HI', true);
    for (i = 1; i <= 9; i++) {
      this.set(i, 7, 'FU', true);
    }

    this.set(1, 1, 'KY', false);
    this.set(2, 1, 'KE', false);
    this.set(3, 1, 'GI', false);
    this.set(4, 1, 'KI', false);
    this.set(5, 1, 'OU', false);
    this.set(6, 1, 'KI', false);
    this.set(7, 1, 'GI', false);
    this.set(8, 1, 'KE', false);
    this.set(9, 1, 'KY', false);
    this.set(2, 2, 'KA', false);
    this.set(8, 2, 'HI', false);
    for (i = 1; i <= 9; i++) {
      this.set(i, 3, 'FU', false);
    }

    return this;
  },

  remove: function(x, y, piece) {
    var p = this._board[x][y]['piece'];
    if (!this.trash(x, y, piece)) {
      return false;
    }
    this._pieces[p] += 1;
    return this;
  },

  set: function(x, y, piece, black) {
    this._board[x][y] = {'black': black, 'piece': piece};
    this._pieces[piece] -= 1;
    return this;
  },

  setStand: function(piece, black) {
    var player = black ? 'black' : 'white';
    if (piece == 'AL') {
      for (var p in this._pieces) {
        if (p == 'OU') {
          continue;
        }
        this._stand[player][p] = this._stand[player][p] || 0;
        this._stand[player][p] += this._pieces[p];
        this._pieces[p] = 0;
      }
    } else {
      this._stand[player][piece] = this._stand[player][piece] || 0;
      this._stand[player][piece] += 1;
      this._pieces[piece] -= 1;
    }
    return this;
  },

  toObject: function() {
    return {
      'board':  this._board,
      'pieces': this._pieces,
      'stand':  this._stand
    };
  },

  trash: function(x, y, piece) {
    if (!piece) {
      piece = this._board[x][y]['piece'];
    }
    if (piece != this._board[x][y]['piece']) {
      return false;
    }

    this._board[x][y] = null;
    return this;
  }
});

Kifu.Board.extend({
  initialize: function() {
    this._board  = Kifu.Board.empty();
    this._pieces = Kifu.Board.pieces();
    this._stand  = {'black': {}, 'white': {}};
  },

  empty: function() {
    var board = {};
    for (var i = 1; i <= 9; i++) {
      board[i] = {}
      for (var j = 1; j <= 9; j++) {
        board[i][j] = null;
      }
    }
    return board;
  },

  pieces: function() {
    return {
      'FU': 18,
      'KY':  4,
      'KE':  4,
      'GI':  4,
      'KI':  4,
      'KA':  2,
      'HI':  2,
      'OU':  2
    };
  }
});

Kifu.Board.initialize.prototype = Kifu.Board.prototype


/*
 * Kifu.Csa Object
 */
Kifu.Csa = {
  parse: function(source) {
    var kifu = {
      'board':  Kifu.Board(),
      'format': 'csa',
      'moves':  Kifu.Move()
    };

    var lines = Kifu.Csa.toLines(source);
    for (var i in lines) {
      var line = lines[i];
      Kifu.Csa.parseByLine(line, kifu);
    }

    var board = kifu['board'].toObject();
    kifu['board']  = board['board'];
    kifu['pieces'] = board['pieces'];
    kifu['stand']  = board['stand'];
    kifu['moves']  = kifu['moves'].toArray();

    return kifu;
  },

  parseByLine: function(line, kifu) {
    if (line == '+') {
      kifu['start_player'] = 'black';
      return true;
    } else if (line == '-') {
      kifu['start_player'] = 'white';
      return true;
    } else if (line.substr(0, 3) == "'* ") {
      kifu['moves'].addComment(line.substr(3));
    }

    switch (line.charAt(0)) {
    case '+':
    case '-':
      var from = [line.charAt(1)-'0', line.charAt(2)-'0'];
      var to   = [line.charAt(3)-'0', line.charAt(4)-'0'];
      var piece = line.substr(5, 2);
      kifu['moves'].addMove(from, to, piece);
      break;

    case 'N':
      var player = (line.charAt(1) == '+' ? 'black' : 'white') + '_player';
      kifu[player] = line.substr(2);
      return true;

    case 'P':
      switch (line.charAt(1)) {
      case 'I':
        kifu['board'].hirate();
        for (var i = 0; ; i++) {
          var p_info = line.substr(2+i*4, 4);
          if (p_info.length < 4) {
            break;
          }
          var x     = p_info.charAt(0) - '0';
          var y     = p_info.charAt(1) - '0';
          var piece = p_info.substr(2);
          kifu['board'].trash(x, y, piece);
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
            kifu['board'].setStand(piece, black);
          } else {
            kifu['board'].set(x, y, piece, black);
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
          kifu['board'].set(x, y, piece, black);
        }
        return true;
      }
      return false;

    case 'T':
      var period = parseInt(line.substr(1));
      kifu['moves'].addPeriod(period);
      break;

    case 'V':
      kifu['version'] = line.substr(1);
      return true;
    }

    return false;
  },

  toLines: function(source) {
    var lines = source.split("\r\n");
    if (lines.length > 1) {
      return lines;
    }

    lines = source.split("\n");
    if (lines.length > 1) {
      return lines;
    }

    return source.split("\r");
  }
};


/*
 * Kifu.Move Object
 */
Kifu.Move = (function() { return new Kifu.Move.initialize(); });
Kifu.Move.extend = Kifu.Move.prototype.extend = Kifu.extend;

Kifu.Move.prototype.extend({
  addComment: function(comment) {
    this._moves[this._moves.length-1]['comment'] = comment;
    return this;
  },

  addMove: function(from, to, piece) {
    var move = this._moves[this._moves.length-1];
    if (move['piece']) {
      this._moves.push({});
      move = this._moves[this._moves.length-1];
    }

    move['from']  = from;
    move['to']    = to;
    move['piece'] = piece;
    return this;
  },

  addPeriod: function(period) {
    this._moves[this._moves.length-1]['period'] = period;
    return this;
  },

  toArray: function() {
    return this._moves;
  }
});

Kifu.Move.extend({
  initialize: function() {
    this._moves = [{}];
  }
});

Kifu.Move.initialize.prototype = Kifu.Move.prototype


window.Kifu = Kifu;
})(window);

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2: */
