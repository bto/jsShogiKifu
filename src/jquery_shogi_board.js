/*
 * jQuery ShogiBoard plugin
 */
(function($) {


var _suffix = 0;

$.fn.shogiBoard = function(kifu, options) {
  /*
   * functions
   */
  var boardSet = function(board) {
    var stand = board.stand;
    var board = board.board;

    for (var x = 1; x <= 9; x++) {
      for (var y = 1; y <= 9; y++) {
        var cell  = jsbElementBoardCell(x, y).empty();
        var piece = board[x][y];
        if (piece) {
          cell.append(pieceImgTag(piece['piece'], piece['black']));
        } else {
          cell.append('&nbsp;');
        }
      }
    }

    for (var player in stand) {
      var player_stand = stand[player];
      standRemoveAll(player);
      for (var piece in player_stand) {
        var l = player_stand[piece];
        for (var i = 0; i < l; i++) {
          standSet(player, piece);
        }
      }
    }
  };

  var jsbElementBoardCell = function(x, y) {
    return jsbElementById(x+'_'+y);
  };

  var jsbElementById = function(id) {
    return $('#jsb_' + id + '_' + config['suffix']);
  };

  var jsbElementStand = function(black, piece) {
    if (typeof black == 'string') {
      var player = black;
    } else {
      var player = black ? 'black' : 'white';
    }

    var id = 'stand_' + player;

    if (piece) {
      id = id + '_' + piece.toLowerCase();
    }
    return jsbElementById(id);
  };

  var moveNext = function() {
    var move = kifu.moveNext();
    if (!move || move['type'] != 'move') {
      return;
    }

    var from  = move['from'];
    var to    = move['to'];
    var black = move['black'];
    var piece = to['piece'];
    var stand = move['stand'];

    if (from['x'] == 0) {
      standRemove(black, piece);
    } else {
      pieceRemove(from['x'], from['y']);
    }

    pieceSet(to['x'], to['y'], piece, black);

    if (stand) {
      standSet(black, stand['stand']);
    }

    moveStringSelect();
    if (move['comment']) {
      jsbElementById('comment').text(move['comment']);
    } else {
      jsbElementById('comment').text('');
    }
  };

  var movePrev = function() {
    var move = kifu.movePrev();
    if (!move || move['type'] != 'move') {
      return;
    }

    var from  = move['from'];
    var to    = move['to'];
    var black = move['black'];
    var piece = to['piece'];
    var stand = move['stand'];

    if (from['x']) {
      pieceSet(from['x'], from['y'], from['piece'], black);
    } else {
      standSet(black, from['piece']);
    }

    if (stand) {
      pieceSet(to['x'], to['y'], stand['piece'], !black);
      standRemove(black, stand['stand']);
    } else {
      pieceRemove(to['x'], to['y']);
    }

    var move_prev = kifu.moves.get(kifu.step);
    moveStringSelect();
    if (move_prev['comment']) {
      jsbElementById('comment').text(move_prev['comment']);
    } else {
      jsbElementById('comment').text('');
    }
  };

  var moveStringSelect = function(step) {
    if (!step) {
      step = kifu.step;
    }
    jsbElementById('moves').val(step);
  };

  var moveStringsSet = function() {
    var moves = kifu.moves.moves;
    var ele   = jsbElementById('moves');
    for (var i in moves) {
      var move = moves[i];
      if (move['str']) {
        ele.append($('<option>').attr({value: i}).text(i+' '+move['str']));
      }
    }
  };

  var pieceImgTag = function(piece, black) {
    if (typeof black == 'string') {
      black = black == 'black';
    }

    var name = piece.toLowerCase();
    if (!black) {
      name += '_r';
    }
    var image_url = config['url_prefix'] + '/images/' + name + '.png';

    return '<img src="' + image_url + '" />';
  };

  var pieceRemove = function(x, y) {
    return jsbElementBoardCell(x, y).empty().append('&nbsp;');
  };

  var pieceSet = function(x, y, piece, black) {
    return jsbElementBoardCell(x, y).empty().append(pieceImgTag(piece, black));
  };

  var playerSet = function() {
    var info = kifu.info;
    jsbElementById('player_black').empty().append('▲'+info['player_black'])
    jsbElementById('player_white').empty().append('▲'+info['player_white'])
  };

  var standRemove = function(black, piece) {
    jsbElementStand(black, piece).find('img').last().remove();
  };

  var standRemoveAll = function(black) {
    jsbElementStand(black).find('img').remove();
  };

  var standSet = function(black, piece) {
    jsbElementStand(black, piece).append(pieceImgTag(piece, black));
  };

  var registerFunctions = function() {
    jsbElementById('next').click(function() {
      return moveNext();
    });

    jsbElementById('prev').click(function() {
      return movePrev();
    });

    jsbElementById('first').click(function() {
      kifu.moveFirst();
      return boardSet(kifu.board_init);
    });

    jsbElementById('last').click(function() {
      kifu.moveLast();
      return boardSet(kifu.board);
    });
  };


  /*
   * main
   */
  var config = {
    url_prefix: '.'
  };
  if (options) {
    $.extend(config, options);
  }

  if (!config['url_html']) {
    config['url_html'] = config['url_prefix'] + '/' + 'jquery_shogi_board.html';
  }

  config['this'] = this;

  _suffix++;
  config['suffix'] = _suffix;

  var ajax_opts = {};
  ajax_opts['dataType'] = 'text';
  ajax_opts['type']     = 'GET';
  ajax_opts['url']      = config['url_html'];
  ajax_opts['success']  = function(source) {
    var info   = kifu.info;
    var moves  = kifu.moves;
    var suffix = config['suffix'];

    config['this'].append(source.replace(/%suffix%/g, suffix));
    boardSet(kifu.board_init);
    playerSet();
    registerFunctions();
    moveStringsSet();
  };
  return $.ajax(ajax_opts);
};


})(jQuery);

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2: */
