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
      cell.append(pieceImgTag(piece, config));
    }
  }
};

var pieceImgTag = function(piece, config) {
  var name = piece['piece'].toLowerCase();
  if (!piece['black']) {
    name += '_r';
  }
  var image_url = config['url_prefix'] + '/images/' + name + '.png';

  return '<img src="' + image_url + '" />';
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
    config['element'].append(source.replace(/%suffix%/g, config['suffix']));
    boardSet(kifu.boardInit(), config);
  };
  return $.ajax(ajax_opts);
};


})(jQuery);

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2: */
