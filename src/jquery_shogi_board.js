/*
 * jQuery ShogiBoard plugin
 */
(function($) {


var _suffix = 0;

var boardCell = function(x, y, suffix) {
  return $('#jsb_'+x+'_'+y+'_'+suffix);
};

var boardSet = function(board, config) {
  var suffix = config['suffix'];
  for (var x = 1; x <= 9; x++) {
    for (var y = 1; y <= 9; y++) {
      var cell  = boardCell(x, y, suffix).empty();
      var piece = board[x][y];
      if (piece) {
        cell.append(pieceImgTag(piece['piece'], piece['black'], config));
      } else {
        cell.append('&nbsp;');
      }
    }
  }
};

var moveNext = function(kifu, config) {
  var move = kifu.next();
  if (!move || move['type'] != 'move') {
    return;
  }

  var from  = move['from'];
  var to    = move['to'];
  var black = move['black'];
  var piece = to['piece'];
  var stand = move['stand'];

  if (from['x'] == 0) {
    standRemove(piece, black, config);
  } else {
    pieceRemove(from['x'], from['y'], config);
  }

  pieceSet(to['x'], to['y'], piece, black, config);

  if (stand) {
    standSet(stand['stand'], black, config);
  }

  var suffix = config['suffix'];
  $('#jsb_moves_'+suffix).val(kifu.step);
  if (move['comment']) {
    $('#jsb_comment_'+suffix).text(move['comment']);
  } else {
    $('#jsb_comment_'+suffix).text('');
  }
};

var movePrev = function(kifu, config) {
  var move = kifu.prev();
  if (!move || move['type'] != 'move') {
    return;
  }

  var from  = move['from'];
  var to    = move['to'];
  var black = move['black'];
  var piece = to['piece'];
  var stand = move['stand'];

  if (from['x']) {
    pieceSet(from['x'], from['y'], from['piece'], black, config);
  } else {
    standSet(from['piece'], black, config);
  }

  if (stand) {
    pieceSet(to['x'], to['y'], stand['piece'], !black, config);
    standRemove(stand['stand'], black, config);
  } else {
    pieceRemove(to['x'], to['y'], config);
  }

  var move_prev = kifu.moves.get(kifu.step);
  var suffix = config['suffix'];
  $('#jsb_moves_'+suffix).val(kifu.step);
  if (move_prev['comment']) {
    $('#jsb_comment_'+suffix).text(move_prev['comment']);
  } else {
    $('#jsb_comment_'+suffix).text('');
  }
};

var moveStringsSet = function(moves, suffix) {
  var ele = $('#jsb_moves_'+suffix);
  for (var i in moves) {
    var move = moves[i];
    if (move['str']) {
      ele.append($('<option>').attr({value: i}).text(i+' '+move['str']));
    }
  }
};

var pieceImgTag = function(piece, black, config) {
  var name = piece.toLowerCase();
  if (!black) {
    name += '_r';
  }
  var image_url = config['url_prefix'] + '/images/' + name + '.png';

  return '<img src="' + image_url + '" />';
};

var pieceRemove = function(x, y, config) {
  return boardCell(x, y, config['suffix']).empty().append('&nbsp;');
};

var pieceSet = function(x, y, piece, black, config) {
  return boardCell(x, y, config['suffix']).empty()
    .append(pieceImgTag(piece, black, config));
};

var playerSet = function(info, suffix) {
  $('#jsb_player_black_'+suffix).empty().append('▲'+info['player_black']);
  $('#jsb_player_white_'+suffix).empty().append('▽'+info['player_white']);
};

var standCell = function(black, piece, suffix) {
  var player = black ? 'black' : 'white';
  piece = piece.toLowerCase();
  return $('#jsb_stand_'+player+'_'+piece+'_'+suffix);
};

var standRemove = function(piece, black, config) {
  standCell(black, piece, config['suffix']).find('img').last().remove();
};

var standSet = function(piece, black, config) {
  standCell(black, piece, config['suffix'])
    .append(pieceImgTag(piece, black, config));
};

var registerFunctions = function(kifu, config) {
  var suffix = config['suffix'];

  $('#jsb_next_'+suffix).click(function() {
    return moveNext(kifu, config);
  });

  $('#jsb_prev_'+suffix).click(function() {
    return movePrev(kifu, config);
  });

  $('#jsb_first_'+suffix).click(function() {
    kifu.first();
    return boardSet(kifu.board_init.board, config);
  });

  $('#jsb_last_'+suffix).click(function() {
    kifu.last();
    return boardSet(kifu.board.board, config);
  });
};

$.fn.shogiBoard = function(kifu, options) {
  var config = {
    url_prefix: '.'
  };
  if (options) {
    $.extend(config, options);
  }

  if (!config['url_html']) {
    config['url_html'] = config['url_prefix'] + '/' + 'jquery_shogi_board.html';
  }

  config['element'] = this;

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

    config['element'].append(source.replace(/%suffix%/g, suffix));
    boardSet(kifu.board_init.board, config);
    playerSet(info, suffix);
    registerFunctions(kifu, config);
    moveStringsSet(kifu.moves.moves, suffix);
  };
  return $.ajax(ajax_opts);
};


})(jQuery);

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2: */
