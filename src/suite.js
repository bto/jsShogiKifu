/*
 * suite.js
 *
 * Copyright 2011, Masato Bito
 * Licensed under the MIT license.
 *
 */
(function(Kifu) {
Kifu.Suite = (function() { return new Kifu.Suite.initialize(); });
Kifu.Suite.extend = Kifu.Suite.prototype.extend = Kifu.extend;


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

Kifu.Suite.prototype.extend({
  cellDeploy: function(x, y, piece, is_black) {
    var pieces = this.pieces;
    if (this.board[x][y]) {
      return false;
    }
    var piece_org = piece_map[piece];
    if (!pieces[piece_org]) {
      return false;
    }
    this.cellSet(x, y, piece, is_black);
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

  cellSet: function(x, y, piece, is_black) {
    this.board[x][y] = {is_black: is_black, piece: piece};
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
    if (handicap == 'other') return this;
    this.hirate();
    if (handicap == 'even' || handicap == null) return this;

    switch (handicap) {
    case 'lance':
      this.cellRemove(1, 1, 'KY');
      break;

    case 'right_lance':
      this.cellRemove(9, 1, 'KY');
      break;

    case 'bishop':
      this.cellRemove(2, 2, 'KA');
      break;

    case 'rook_and_lance':
      this.cellRemove(1, 1, 'KY');
    case 'rook':
      this.cellRemove(8, 2, 'HI');
      break;

    case 'six_drops':
      this.cellRemove(2, 1, 'KE');
      this.cellRemove(8, 1, 'KE');
    case 'four_drops':
      this.cellRemove(1, 1, 'KY');
      this.cellRemove(9, 1, 'KY');
    case 'two_drops':
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
    var is_black = move.is_black;
    var from     = move.from;
    var stand    = move.stand;
    var to       = move.to;

    if (from.x) {
      this.cellTrash(from.x, from.y);
    } else {
      this.standTrash(from.piece, is_black);
    }

    this.cellSet(to.x, to.y, to.piece, is_black);

    if (stand) {
      this.standSet(stand.stand, is_black);
    }

    return this;
  },

  moveReverse: function(move) {
    var is_black = move.is_black;
    var from     = move.from;
    var stand    = move.stand;
    var to       = move.to;

    if (stand) {
      this.standTrash(stand.stand, is_black);
      this.cellSet(to.x, to.y, stand.piece, !is_black);
    } else {
      this.cellTrash(to.x, to.y);
    }

    if (from.x) {
      this.cellSet(from.x, from.y, from.piece, is_black);
    } else {
      this.standSet(from.piece, is_black);
    }

    return this;
  },

  standDeploy: function(piece, is_black, num) {
    var player = is_black ? 'black' : 'white';
    var stand  = this.stand[player];
    var pieces = this.pieces;

    num = num || 1;

    if (piece == 'AL') {
      for (var p in pieces) {
        if (p == 'OU') {
          continue;
        }
        stand[p] || (stand[p] = 0);
        stand[p] += pieces[p];
        pieces[p] = 0;
      }
    } else if (pieces[piece] >= num) {
      this.standSet(piece, is_black, num);
      pieces[piece] -= num;
    } else {
      return false;
    }

    return this;
  },

  standRemove: function(piece, is_black) {
    if (!this.standTrash(piece, is_black)) {
      return false;
    }
    this.pieces[piece]++;
    return this;
  },

  standSet: function(piece, is_black, num) {
    var player = is_black ? 'black' : 'white';
    var stand = this.stand[player];
    num = num || 1;
    stand[piece] || (stand[piece] = 0);
    stand[piece] += num;
    return this;
  },

  standTrash: function(piece, is_black) {
    var player = is_black ? 'black' : 'white';
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
})(Kifu);

// Local variables:
// indent-tabs-mode: nil
// js2-basic-offset: 2
// end:
// vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2:
