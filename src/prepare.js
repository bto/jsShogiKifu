/*
 * prepare.js
 *
 * Copyright 2011, Masato Bito
 * Licensed under the MIT license.
 *
 */
(function(Kifu) {


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

Kifu.Prepare = function(kifu) {
  return Kifu.Prepare.prepare(kifu);
};

Kifu.Prepare.extend = Kifu.extend;
Kifu.Prepare.extend({
  checkFromAreas: function(suite, move) {
    var board    = suite.board;
    var is_black = move.is_black;
    var piece    = move.from.piece;
    var result   = [];

    var areas  = Kifu.Prepare['findFromAreas'+piece](suite, move);
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

  checkStandArea: function(suite, move) {
    var is_black = move.is_black;
    var piece    = move.from.piece;
    var player   = is_black ? 'black' : 'white';

    if (suite.stand[player][piece] < 1) {
      return null;
    }

    if (piece != 'FU') {
      return [0, 0];
    }

    var board_x = suite.board[move.to.x];
    for (var y = 1; y <= 9; y++) {
      var cell = board_x[y];
      if (cell && cell.is_black == is_black && cell.piece == 'FU') {
        return null;
      }
    }

    return [0, 0];
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
    return Kifu.Prepare.findFromAreasKI(suite, move);
  },

  findFromAreasNY: function(suite, move) {
    return Kifu.Prepare.findFromAreasKI(suite, move);
  },

  findFromAreasNK: function(suite, move) {
    return Kifu.Prepare.findFromAreasKI(suite, move);
  },

  findFromAreasNG: function(suite, move) {
    return Kifu.Prepare.findFromAreasKI(suite, move);
  },

  findFromAreasUM: function(suite, move) {
    var areas = Kifu.Prepare.findFromAreasKA(suite, move);
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
    var areas = Kifu.Prepare.findFromAreasHI(suite, move);
    var to    = move.to;
    var x     = to.x;
    var y     = to.y;
    areas.push([x+1, y+1]);
    areas.push([x+1, y-1]);
    areas.push([x-1, y+1]);
    areas.push([x-1, y-1]);
    return areas;
  },

  moveStr: function(move) {
    var from = move.from;
    var to   = move.to;
    var str  = '';
    if (move.is_same_place) {
      str += '同';
    } else {
      str += Kifu.integerToZenkaku(to.x) + Kifu.integerToKanji(to.y);
    }
    str += Kifu.pieceToMovePiece(from.piece);
    if (move.direction) {
      str += Kifu.directionToKanji(move.direction);
    }
    if (move.movement) {
      str += Kifu.movementToKanji(move.movement);
    }
    if (from.piece != to.piece) {
      str += '成';
    }
    if (move.put) {
      str += '打';
    }
    return str;
  },

  prepare: function(kifu) {
    var info = kifu.info;

    Kifu.Prepare.prepareInfo(info);

    var suite        = kifu.suite_init.clone();
    var move_records = kifu.moves.records;
    for (var i in move_records) {
      var m = move_records[i];
      if (!m || m.type != 'move') continue;
      m.from || (m.from = {});
      var move_prev = move_records[i-1];
      var move      = m;
      var from      = move.from;
      var to        = move.to;

      // is_black
      if (typeof move.is_black == 'undefined') {
        if (move_prev.type == 'init') {
          move.is_black = info.player_start == 'black';
        } else {
          move.is_black = !move_prev.is_black;
        }
      }

      // to cell
      if (to.x == 0) {
        to.x = move_prev.to.x;
        to.y = move_prev.to.y;
      }

      // from cell
      Kifu.Prepare.prepareFromCell(suite, move);

      // is_same_place
      if (typeof move.is_same_place == 'undefined') {
        if (move_prev.type == 'init') {
          move.is_same_place = false;
        } else {
          move.is_same_place = move_prev.to.x == to.x && move_prev.to.y == to.y;
        }
      }

      // stand
      var cell = suite.board[to.x][to.y];
      if (cell) {
        move.stand = {
          piece: cell.piece,
          stand: original_piece_map[cell.piece]
        };
      }

      move.str = Kifu.Prepare.moveStr(move);

      suite.move(move);
    }

    return kifu;
  },

  prepareFromCell: function(suite, move) {
    var from     = move.from;
    var is_black = move.is_black;
    var to       = move.to;

    move.direction = move.direction || false;
    move.movement  = move.movement  || false;
    move.put       = move.put       || false;

    Kifu.Prepare.prepareFromPiece(suite, move);

    var areas      = Kifu.Prepare.checkFromAreas(suite, move);
    var area_stand = Kifu.Prepare.checkStandArea(suite, move);

    var areas2 = Kifu.clone(areas);
    if (area_stand) {
      areas2.push(area_stand);
    }
    if (areas2.length == 1) {
      var area = areas2[0];
      from.x   = area[0];
      from.y   = area[1];
      return true;
    }

    if (from.x == 0 || move.put) {
      from.x = 0;
      from.y = 0;
      move.put = true;
      return true;
    }

    if (areas.length == 1) {
      var area = areas[0];
      from.x   = area[0];
      from.y   = area[1];
      return true;
    }

    if (move.direction || move.movement) {
      return Kifu.Prepare.prepareFromCellByMovement(move, areas);
    } else {
      return Kifu.Prepare.prepareMovement(move, areas);
    }
  },

  prepareFromCellByMovement: function(move, areas) {
    var is_black = move.is_black;
    var from     = move.from;
    var to       = move.to;
    var to_x     = to.x;
    var to_y     = to.y;
    var areas_l  = areas.length;

    var areas_x_less    = [];
    var areas_x_greater = [];
    var areas_x_equal   = [];
    for (var i = 0; i < areas_l; i++) {
      var area = areas[i];
      if (area[0] < to_x)      areas_x_less.push(area);
      else if (to_x < area[0]) areas_x_greater.push(area);
      else                     areas_x_equal.push(area);
    }

    switch (move.direction) {
    case 'left':
      areas   = is_black ? areas_x_greater : areas_x_less;
      areas_l = areas.length;
      break;
    case 'right':
      areas   = is_black ? areas_x_less : areas_x_greater;
      areas_l = areas.length;
      break;
    case 'straight_up':
      areas   = areas_x_equal;
      areas_l = areas.length;
      break;
    }

    var from_piece = from.piece;
    if (areas_l == 0 && (from_piece == 'UM' || from_piece == 'RY')) {
      areas   = areas_x_equal;
      areas_l = areas.length;
    }

    if (areas_l == 1) {
      var area = areas[0];
      from.x   = area[0];
      from.y   = area[1];
      return true;
    } 

    var areas_y_less    = [];
    var areas_y_greater = [];
    var areas_y_equal   = [];
    for (var i = 0; i < areas_l; i++) {
      var area = areas[i];
      if (area[1] < to_y)      areas_y_less.push(area);
      else if (to_y < area[1]) areas_y_greater.push(area);
      else                     areas_y_equal.push(area);
    }

    if (move.direction == 'straight_up') {
      areas = is_black ? areas_y_greater : areas_y_less;
    } else {
      switch (move.movement) {
      case 'down':
        areas = is_black ? areas_y_less : areas_y_greater;
        break;
      case 'up':
        areas = is_black ? areas_y_greater : areas_y_less;
        break;
      case 'horizon':
        areas = areas_y_equal;
        break;
      }
    }

    if (areas.length == 1) {
      var area = areas[0];
      from.x   = area[0];
      from.y   = area[1];
      return true;
    }

    return false;
  },

  prepareFromPiece: function(suite, move) {
    var from = move.from;

    if (from.piece) {
      return true;
    }

    if (from.x) {
      from.piece = suite.board[from.x][from.y].piece;
    } else {
      from.piece = move.to.piece;
    }

    return true;
  },

  prepareInfo: function(info) {
    if (!info.player_start) {
      info.player_start = 'black';
    }
    return info;
  },

  prepareMovement: function(move, areas) {
    var is_black = move.is_black;
    var from     = move.from;
    var from_x   = from.x;
    var from_y   = from.y;
    var to       = move.to;
    var to_x     = to.x;
    var to_y     = to.y;
    var areas_l  = areas.length;

    var areas_x_less    = [];
    var areas_x_greater = [];
    var areas_x_equal   = [];
    var areas_y_less    = [];
    var areas_y_greater = [];
    var areas_y_equal   = [];
    for (var i = 0; i < areas_l; i++) {
      var area = areas[i];
      if (area[0] < to_x)      areas_x_less.push(area);
      else if (to_x < area[0]) areas_x_greater.push(area);
      else                     areas_x_equal.push(area);
      if (area[1] < to_y)      areas_y_less.push(area);
      else if (to_y < area[1]) areas_y_greater.push(area);
      else                     areas_y_equal.push(area);
    }

    if (from_y < to_y && areas_y_less.length == 1) {
      move.direction = false;
      move.movement  = is_black ? 'down' : 'up';
      return true;
    } else if (to_y < from_y && areas_y_greater.length == 1) {
      move.direction = false;
      move.movement  = is_black ? 'up' : 'down';
      return true;
    } else if (from_y == to_y && areas_y_equal.length == 1) {
      move.direction = false;
      move.movement  = 'horizon';
      return true;
    }

    if (from_x < to_x) {
      move.direction = is_black ? 'right' : 'left';
      areas = areas_x_less;
    } else if (to_x < from_x) {
      move.direction = is_black ? 'left' : 'right';
      areas = areas_x_greater;
    } else {
      move.movement = false
      var piece = from.piece;
      if (piece == 'UM' || piece == 'RY') {
        if (1 <= areas_x_less.length) {
          move.direction = is_black ? 'left' : 'right';
        } else {
          move.direction = is_black ? 'right' : 'left';
        }
      } else {
        move.direction = 'straight_up';
      }
      return true;
    }
    areas_l = areas.length;

    if (areas_l == 1) {
      move.movement = false;
      return true;
    }

    if (from_y < to_y) {
      move.movement = is_black ? 'down' : 'up';
    } else if (to_y < from_y) {
      move.movement = is_black ? 'up' : 'down';
    } else {
      move.movement = 'horizon';
    }
    return true;
  }
});


})(Kifu);

// Local variables:
// indent-tabs-mode: nil
// js2-basic-offset: 2
// end:
// vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2:
