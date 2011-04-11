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
  var suffix      = config['suffix'];
  var move        = kifu.next();
  var x1          = move['from'][0];
  var y1          = move['from'][1];
  var x2          = move['to'][0];
  var y2          = move['to'][1];
  var black       = move['black'];
  var piece       = move['piece'];
  var stand_piece = move['stand'];

  if (x1 == 0) {
    standCell(black, piece, suffix).find('img').last().remove();
  } else {
    boardCell(x1, y1, suffix).empty();
  }

  boardCell(x2, y2, suffix).empty()
    .append(pieceImgTag(piece, black, config));

  if (stand_piece) {
    standCell(black, stand_piece, suffix)
      .append(pieceImgTag(stand_piece, black, config));
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

var playerSet = function(info, suffix) {
  $('#jsb_player_black_'+suffix).empty().append('▲'+info['player_black']);
  $('#jsb_player_white_'+suffix).empty().append('▽'+info['player_white']);
};

var standCell = function(black, piece, suffix) {
  var player = black ? 'black' : 'white';
  piece = piece.toLowerCase();
  return $('#jsb_stand_'+player+'_'+piece+'_'+suffix);
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
    var info   = kifu.info();
    var suffix = config['suffix'];

    config['element'].append(source.replace(/%suffix%/g, suffix));

    boardSet(kifu.boardInit(), config);

    playerSet(info, suffix);

    $('#jsb_next_'+suffix).click(function() {
      return moveNext(kifu, config);
    });
  };
  return $.ajax(ajax_opts);
};


})(jQuery);

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2: */
