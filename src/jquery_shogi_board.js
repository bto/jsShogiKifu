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
      if (!piece) {
        continue;
      }
      cell.append(pieceImgTag(piece['piece'], piece['black'], config));
    }
  }
};

var moveNext = function(kifu, config) {
  var move   = kifu.next();
  var from   = move['from'];
  var to     = move['to'];
  var black  = move['black'];
  var piece  = to['piece'];
  var stand  = move['stand'];

  if (from['x'] == 0) {
    standRemove(piece, black, config);
  } else {
    pieceRemove(from['x'], from['y'], config);
  }

  pieceSet(to['x'], to['y'], piece, black, config);

  if (stand) {
    standSet(stand['stand'], black, config);
  }
};

var movePrev = function(kifu, config) {
  var move   = kifu.prev();
  var from   = move['from'];
  var to     = move['to'];
  var black  = move['black'];
  var piece  = to['piece'];
  var stand  = move['stand'];

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
  return boardCell(x, y, config['suffix']).empty();
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
    var suffix = config['suffix'];

    config['element'].append(source.replace(/%suffix%/g, suffix));

    boardSet(kifu.board_init.board(), config);

    playerSet(info, suffix);

    $('#jsb_next_'+suffix).click(function() {
      return moveNext(kifu, config);
    });

    $('#jsb_prev_'+suffix).click(function() {
      return movePrev(kifu, config);
    });
  };
  return $.ajax(ajax_opts);
};


})(jQuery);

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2: */
