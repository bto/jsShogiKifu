/*
 * jQuery ShogiBoard plugin
 *
 * Copyright 2011, Masato Bito
 * Licensed under the MIT license.
 *
 * 2011/06/03: Add move_to config option. (Kosako)
 * 2011/06/01: Add last-move highlight function. (Kosako)
 * 2011/06/01: Use space.gif for empty cell.     (Kosako)
 *
 */
(function($) {

var _suffix = 0;

var detectBrowser = function() {
  if (! jQuery.support.checkOn && jQuery.support.checkClone) {
    return 'ChromeOrSafari';
  }
  else if(jQuery.support.checkOn && jQuery.support.noCloneEvent && window.globalStorage) {
    return 'Firefox';
  }
  else if(jQuery.support.checkOn && jQuery.support.noCloneEvente && !window.globalStorage) {
    return 'Opera';
  }
  else if(! jQuery.support.noCloneEvent && jQuery.support.opacity) {
    return 'IE9';
  }
  else if(! jQuery.support.opacity) {
    if (! jQuery.support.style) {
      if (typeof document.documentElement.style.maxHeight != "undefined") {
        return 'IE7';
      }
      else {
	return 'IE6';
      }
    }
    else {
      return 'IE8';
    }
  }
  else {
    return 'Unknown';
  }
};

var SurmiseBrowser = detectBrowser();
SurmiseBrowser = 'IE9';

$.fn.shogiBoard = function(kifu, options) {
  /*
   * functions
   */
  var render;

  var cellPieceSet = function(x, y, piece, black) {
    var black_p = typeof black == 'string' ? black == 'black' : black;
    render(jsbElementBoardCell(x, y), piece, black_p);
  };

  var cellClear = function(x, y) {
    cellPieceSet(x, y, null, null);
  };

  var boardSet = function() {
    var board = kifu.suite.board;
    var stand = kifu.suite.stand;

    for (var x = 1; x <= 9; x++) {
      for (var y = 1; y <= 9; y++) {
        var piece = board[x][y];
        if (piece) {
          cellPieceSet(x, y, piece['piece'], piece['black']);
        } else {
          cellClear(x, y);
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

    setCurrToLastMove();
    moveStringSelect();
    commentSet();
  };

  var commentSet = function() {
    var comment = kifu.moves.get(kifu.step)['comment'];
    if (comment) {
      jsbElementById('comment').text(comment);
    } else {
      jsbElementById('comment').text('');
    }
    return true;
  };

  var getNumberPart = function(s) {
    var r = s.match(/\d+/);
    if (r && r[0].length > 0)
	return parseInt(r[0], 10);
    else
      return null;
  };

  var initialize = function(source) {
    var contents_id = '#jsb_contents_' + config['suffix'];

    config['this'].append(source.replace(/%suffix%/g, config['suffix']));

    if (config['board_cell_width']) {
      $(contents_id + ' .jsb_board td').width(config['board_cell_width']);
    }
    if (config['board_cell_height']) {
      $(contents_id + ' .jsb_board td').height(config['board_cell_height']);
    }

    if (config['piece_width']) {
      var width = getNumberPart(config['piece_width']);
      if (width) {
        width = width * 2 + 5;
        $(contents_id + ' .jsb_stand').width(width + 'px');
      }
    }
    else if (config['board_cell_width']) {
      var width = getNumberPart(config['board_cell_width']);
      if (width) {
	  width = (width - 4) * 2 + 5;
        $(contents_id + ' .jsb_stand').width(width + 'px');
      }
    }

    boardSet();
    playerSet();
    registerFunctions();
    moveStringsSet();

    if (config['move_to']) {
      var m = config['move_to'];
      var len = kifu.moves.getLastMoveNum();
      if (m == 'last' || m > len) m = len;

      moveTo(m);
      var list_box = jsbElementById('moves');
      var sh = $(list_box).attr('scrollHeight');
      var h  = $(list_box).height();
      var top = parseInt(sh * m / len + 0.5, 10);
      if (top > sh - h)  top = sh - h;
      $(list_box).attr('scrollTop', top);
    }
  };

  var jsbElementBoardCell = function(x, y) {
    return jsbElementById(x+'_'+y);
  };

  var jsbElementById = function(id) {
    return $('#jsb_' + id + '_' + config['suffix']);
  };

  var jsbElementStand = function(black, piece) {
    var player;
    if (typeof black == 'string') {
      player = black;
    } else {
      player = black ? 'black' : 'white';
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
      cellClear(from['x'], from['y']);
    }

    cellPieceSet(to['x'], to['y'], piece, black);

    if (stand) {
      standSet(black, stand['stand']);
    }

    lastMoveSet(to['x'], to['y']);
    moveStringSelect();
    commentSet();
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
      cellPieceSet(from['x'], from['y'], from['piece'], black);
    } else {
      standSet(black, from['piece']);
    }

    if (stand) {
      cellPieceSet(to['x'], to['y'], stand['piece'], !black);
      standRemove(black, stand['stand']);
    } else {
      cellClear(to['x'], to['y']);
    }

    setCurrToLastMove();
    moveStringSelect();
    commentSet();
  };

  var moveStringSelect = function(step) {
    if (!step) {
      step = kifu.step;
    }
    jsbElementById('moves').val(step);
  };

  var moveStringsSet = function() {
    var move_records = kifu.moves.records;
    var ele          = jsbElementById('moves');
    var nsp, mark;
    if (SurmiseBrowser == 'Firefox') {
      for (var i in move_records) {
        var move = move_records[i];
        if (move['str']) {
          if (i > 99) nsp = 0.5;
          else if (i > 9) nsp = 1.0;
          else nsp = 1.5;
          if (move['comment'] && move['comment'].length > 0) {
            nsp -= 0.5;
	    mark = '*';
          }
          else {
            mark = '';
          }
          ele.append($('<option>').attr({value: i}).
	        html(mark + '<span style="margin-left:' + nsp + 'em">' + i + ' '
                     + move['str'] + '</span>'));
        }
      }
    }
    else {
      for (var i in move_records) {
        var move = move_records[i];
        if (move['str']) {
          if (move['comment'] && move['comment'].length > 0) {
	    mark = '*';
          }
          else {
            mark = '';
          }
          ele.append($('<option>').attr({value: i}).
	        html(mark + ' ' + i + ' ' + move['str']));
	}
      }
    }

    ele.change(function() {
      return moveTo($(this).val());
    });
  };

  var moveTo = function(num) {
    kifu.moveTo(num);
    return boardSet();
  };

  var lastMoveCell = null;

  var lastMoveSet = function(x, y) {
    var color = config['highlight_last_move'];
    var cell = jsbElementBoardCell(x, y);
    if (! color) return ;
    if (cell == lastMoveCell) return ;
    if (lastMoveCell) $(lastMoveCell).css('background', 'transparent');
    $(cell).css('background', color);
    lastMoveCell = cell;
  };

  var lastMoveClear = function() {
    if (lastMoveCell) $(lastMoveCell).css('background', 'transparent');
    lastMoveCell = null;
  };

  var setCurrToLastMove = function() {
    var curr = kifu.currMove();
    if (curr) {
      var to = curr['to'];
      lastMoveSet(to['x'], to['y']);
    }
    else {
      lastMoveClear();
    }
  };

  var playerSet = function() {
    var info = kifu.info;
    jsbElementById('player_black').text('▲'+info['player_black'])
    jsbElementById('player_white').text('▽'+info['player_white'])
  };

  var standRemove = function(black, piece) {
    var black_p = typeof black == 'string' ? black == 'black' : black;
    jsbElementStand(black, piece).
      jsbSetNumber(function() { return this.jsbGetNumber() - 1; }).
      each(function() { render($(this), piece, black_p); });
  };

  var standRemoveAll = function(black) {
    for (var piece in Kifu.Suite.standEmpty()) {
      jsbElementStand(black, piece).jsbSetStand().jsbSetNumber(0).empty();
    }
  };

  var standSet = function(black, piece) {
    var black_p = typeof black == 'string' ? black == 'black' : black;
    render(jsbElementStand(black, piece).
           jsbSetNumber(function() { return this.jsbGetNumber() + 1; }),
           piece, black_p);
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
      return boardSet();
    });

    jsbElementById('last').click(function() {
      kifu.moveLast();
      return boardSet();
    });
  };

  var imageRenderer =
    function(images_url) {
      var SPACE_IMAGE_URL = './space.gif';
      var pieceImgUrl = function(piece, black_p) {
        if (! piece) {
          return SPACE_IMAGE_URL;
        }
        else {
          var name = piece.toLowerCase();
          if (name == 'ou') {
	    if (black_p) {
	      name = config['black_king'];
	    }
	    else {
	      name = config['white_king'] + '_r';
	    }
          }
          else {
            if (!black_p) {
              name += '_r';
            }
          }
          return images_url + '/' + name + '.png';
        }
      };
      var createImage = function(piece, black_p) {
        var image_url = pieceImgUrl(piece, black_p);
        return $('<img />').attr('src', image_url).
          width(config['piece_width']).
          height(config['piece_height']);
      };
      return function(cell, piece, black_p) {
        if (cell.jsbIsStand()) {
          var diff = cell.jsbGetNumber() - cell.children().length;
          if (diff > 0) {
            while (diff-- > 0) {
              cell.append(createImage(piece, black_p));
            }
          } else if (0 > diff) {
            while (0 > diff++) {
              cell.children(':last').remove();
            }
          }
        } else {
          cell.html(createImage(piece, black_p));
        }
      };
    };

  var textRenderer =
    function(fontsize) {
      if ($('style.jsb_style_text_renderer').length == 0) {
        $('head :first').before($('<style class="jsb_style_text_renderer" type="text/css">\n\
.jsb_text_piece {\n\
  display: block;\n\
  font-family: sans-serif;\n\
  line-height: 1.0;\n\
}\n\
.jsb_text_piece_white {\n\
  -webkit-transform: rotate(180deg);\n\
  -moz-transform: rotate(180deg);\n\
  -ms-transform: rotate(180deg);\n\
  -o-transform: rotate(180deg);\n\
  transform: rotate(180deg);\n\
  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=2);\n\
}\n\
</style>'));
      }
      var pieceToString = {
        FU: '歩',
        KY: '香',
        KE: '桂',
        GI: '銀',
        KI: '金',
        KA: '角',
        HI: '飛',
        OU: '王',
        TO: 'と',
        NY: '杏',
        NK: '圭',
        NG: '全',
        UM: '馬',
        RY: '竜'
      };

      var createPiece = function(piece, black_p) {
        if (piece) {
          var text = pieceToString[piece];
          if (piece == 'OU' && config[black_p ? 'black_king' : 'white_king'] == 'jewel_king')
            text = '玉';
          return $('<div class="jsb_text_piece" />').
            addClass(black_p ? 'jsb_text_piece_black' : 'jsb_text_piece_white').
            text(text).
            css({'font-size': fontsize});
        }
        return null;
      };

      return function(cell, piece, black_p) {
        if (cell.jsbIsStand()) {
          var diff = cell.jsbGetNumber() - cell.children().length;
          if (diff > 0) {
            while (diff-- > 0) {
              cell.append(createPiece(piece, black_p));
            }
          } else if (0 > diff) {
            while (0 > diff++) {
              cell.children(':last').remove();
            }
          }
        } else {
          cell.html(createPiece(piece, black_p));
        }
      };
    };

  /*
   * main
   */
  var config = {
    url_prefix: '.',
    black_king: 'jewel_king',
    white_king: 'king',
    highlight_last_move: '#BDB76B',
    piece_width:  '25px',
    piece_height: '25px',
    renderer: 'image'
  };
  if (options) {
    $.extend(config, options);
  }

  if (config['piece_image_width']) {
    config['piece_width'] = config['piece_image_width'];
  }
  if (config['piece_image_height']) {
    config['piece_height'] = config['piece_image_height'];
  }

  config['this'] = this;

  _suffix++;
  config['suffix'] = _suffix;

  if (config['template_id']) {
    initialize($('#'+config['template_id']).html());
  } else if (config['template_url']) {
    var ajax_opts = {};
    ajax_opts['dataType'] = 'text';
    ajax_opts['type']     = 'GET';
    ajax_opts['url']      = config['template_url'];
    ajax_opts['success']  = initialize;
    $.ajax(ajax_opts);
  } else if (config['template_src']) {
    initialize(config['template_src']);
  } else {
    initialize(_html);
  };

  render = config['renderer'];
  switch (render) {
  case 'image':
    render = imageRenderer(config['images_url'] || config['url_prefix'] + '/' + 'images');
    break;
  case 'text':
    render = textRenderer(config['piece_width']);
    break;
  }

  return this;
};

$.fn.extend({
  jsbSetStand: function() {
    return this.addClass('jsb_stand_piece');
  },
  jsbIsStand: function() {
    return this.hasClass('jsb_stand_piece');
  },
  jsbGetNumber: function() {
    return parseInt(this.attr('data-number') || '0');
  },
  jsbSetNumber: function(number_or_fn) {
    var number;
    if (typeof number_or_fn == 'function') {
      number = number_or_fn.apply(this, []);
    } else {
      number = parseInt(number_or_fn);
    }
    return this.attr('data-number', '' + number);
  }
});

var _html = '\
<style>\
.jsb_contents {\
  border-collapse: collapse;\
  border-spacing: 0;\
  margin:  0;\
  padding: 0;\
}\
\
  .jsb_header {\
    border-collapse: collapse;\
    border-spacing: 0;\
    margin:  0;\
    padding: 0;\
    width: 100%;\
  }\
\
    .jsb_player_black {\
      text-align: right;\
    }\
\
    .jsb_player_white {\
      text-align: left;\
    }\
\
    .jsb_controller {\
      text-align: center;\
    }\
\
  .jsb_moves {\
    width:  100px;\
    height: 100%;\
  }\
    .jsb_moves select {\
      width:  100%;\
      height: 100%;\
    }\
\
  .jsb_board_contents {\
    border-collapse: collapse;\
    border-spacing: 0;\
    margin:  0;\
    padding: 0;\
  }\
\
  .jsb_board_file_num {\
    font-size: x-small;\
    color: gray;\
  }\
\
  .jsb_board_rank_num {\
    font-size: x-small;\
    color: gray;\
  }\
\
    .jsb_stand {\
      width: 60px;\
    }\
\
    .jsb_board {\
      border-collapse: separate;\
      border-spacing: 0;\
      margin:  0;\
      padding: 0;\
      empty-cells: show;\
    }\
      .jsb_board td {\
        text-align: center;\
	vertical-align: center;\
        border: 1px #000000 solid;\
        height: 30px;\
        width:  30px;\
      }\
\
  .jsb_comment {\
    width:  400px;\
    height: 100%;\
  }\
    .jsb_comment textarea {\
      width:  100%;\
      height: 100%;\
    }\
</style>\
\
\
<table class="jsb_contents" id="jsb_contents_%suffix%">\
<tr>\
  <td></td>\
  <td><table class="jsb_header"><tr>\
    <th id="jsb_player_white_%suffix%" class="jsb_player_white"></th>\
    <td clsss="jsb_controller">\
      <input id="jsb_first_%suffix%" type="button" value="&lt;&lt;" />\
      <input id="jsb_prev_%suffix%"  type="button" value="&lt;" />\
      <input id="jsb_next_%suffix%"  type="button" value="&gt;" />\
      <input id="jsb_last_%suffix%"  type="button" value="&gt;&gt;" />\
    </td>\
    <th id="jsb_player_black_%suffix%" class="jsb_player_black"></th>\
  </tr></table></td>\
  <td></td>\
</tr>\
\
<tr>\
  <td class="jsb_moves">\
    <select id="jsb_moves_%suffix%" size="10">\
      <option value="0">開始局面</option>\
    </select>\
  </td>\
  <td><table class="jsb_board_contents"><tr>\
    <td id="jsb_stand_white_%suffix%" class="jsb_stand">\
      <span id="jsb_stand_white_fu_%suffix%"></span>\
      <span id="jsb_stand_white_ky_%suffix%"></span>\
      <span id="jsb_stand_white_ke_%suffix%"></span>\
      <span id="jsb_stand_white_gi_%suffix%"></span>\
      <span id="jsb_stand_white_ki_%suffix%"></span>\
      <span id="jsb_stand_white_ka_%suffix%"></span>\
      <span id="jsb_stand_white_hi_%suffix%"></span>\
    </td>\
    <td>\
      <table class="jsb_board">\
      <tr>\
        <th class="jsb_board_file_num">9</th>\
        <th class="jsb_board_file_num">8</th>\
        <th class="jsb_board_file_num">7</th>\
        <th class="jsb_board_file_num">6</th>\
        <th class="jsb_board_file_num">5</th>\
        <th class="jsb_board_file_num">4</th>\
        <th class="jsb_board_file_num">3</th>\
        <th class="jsb_board_file_num">2</th>\
        <th class="jsb_board_file_num">1</th>\
        <th></th>\
      </tr>\
      <tr>\
        <td id="jsb_9_1_%suffix%"></td>\
        <td id="jsb_8_1_%suffix%"></td>\
        <td id="jsb_7_1_%suffix%"></td>\
        <td id="jsb_6_1_%suffix%"></td>\
        <td id="jsb_5_1_%suffix%"></td>\
        <td id="jsb_4_1_%suffix%"></td>\
        <td id="jsb_3_1_%suffix%"></td>\
        <td id="jsb_2_1_%suffix%"></td>\
        <td id="jsb_1_1_%suffix%"></td>\
        <th class="jsb_board_rank_num">一</th>\
      </tr>\
      <tr>\
        <td id="jsb_9_2_%suffix%"></td>\
        <td id="jsb_8_2_%suffix%"></td>\
        <td id="jsb_7_2_%suffix%"></td>\
        <td id="jsb_6_2_%suffix%"></td>\
        <td id="jsb_5_2_%suffix%"></td>\
        <td id="jsb_4_2_%suffix%"></td>\
        <td id="jsb_3_2_%suffix%"></td>\
        <td id="jsb_2_2_%suffix%"></td>\
        <td id="jsb_1_2_%suffix%"></td>\
        <th class="jsb_board_rank_num">二</th>\
      </tr>\
      <tr>\
        <td id="jsb_9_3_%suffix%"></td>\
        <td id="jsb_8_3_%suffix%"></td>\
        <td id="jsb_7_3_%suffix%"></td>\
        <td id="jsb_6_3_%suffix%"></td>\
        <td id="jsb_5_3_%suffix%"></td>\
        <td id="jsb_4_3_%suffix%"></td>\
        <td id="jsb_3_3_%suffix%"></td>\
        <td id="jsb_2_3_%suffix%"></td>\
        <td id="jsb_1_3_%suffix%"></td>\
        <th class="jsb_board_rank_num">三</th>\
      </tr>\
      <tr>\
        <td id="jsb_9_4_%suffix%"></td>\
        <td id="jsb_8_4_%suffix%"></td>\
        <td id="jsb_7_4_%suffix%"></td>\
        <td id="jsb_6_4_%suffix%"></td>\
        <td id="jsb_5_4_%suffix%"></td>\
        <td id="jsb_4_4_%suffix%"></td>\
        <td id="jsb_3_4_%suffix%"></td>\
        <td id="jsb_2_4_%suffix%"></td>\
        <td id="jsb_1_4_%suffix%"></td>\
        <th class="jsb_board_rank_num">四</th>\
      </tr>\
      <tr>\
        <td id="jsb_9_5_%suffix%"></td>\
        <td id="jsb_8_5_%suffix%"></td>\
        <td id="jsb_7_5_%suffix%"></td>\
        <td id="jsb_6_5_%suffix%"></td>\
        <td id="jsb_5_5_%suffix%"></td>\
        <td id="jsb_4_5_%suffix%"></td>\
        <td id="jsb_3_5_%suffix%"></td>\
        <td id="jsb_2_5_%suffix%"></td>\
        <td id="jsb_1_5_%suffix%"></td>\
        <th class="jsb_board_rank_num">五</th>\
      </tr>\
      <tr>\
        <td id="jsb_9_6_%suffix%"></td>\
        <td id="jsb_8_6_%suffix%"></td>\
        <td id="jsb_7_6_%suffix%"></td>\
        <td id="jsb_6_6_%suffix%"></td>\
        <td id="jsb_5_6_%suffix%"></td>\
        <td id="jsb_4_6_%suffix%"></td>\
        <td id="jsb_3_6_%suffix%"></td>\
        <td id="jsb_2_6_%suffix%"></td>\
        <td id="jsb_1_6_%suffix%"></td>\
        <th class="jsb_board_rank_num">六</th>\
      </tr>\
      <tr>\
        <td id="jsb_9_7_%suffix%"></td>\
        <td id="jsb_8_7_%suffix%"></td>\
        <td id="jsb_7_7_%suffix%"></td>\
        <td id="jsb_6_7_%suffix%"></td>\
        <td id="jsb_5_7_%suffix%"></td>\
        <td id="jsb_4_7_%suffix%"></td>\
        <td id="jsb_3_7_%suffix%"></td>\
        <td id="jsb_2_7_%suffix%"></td>\
        <td id="jsb_1_7_%suffix%"></td>\
        <th class="jsb_board_rank_num">七</th>\
      </tr>\
      <tr>\
        <td id="jsb_9_8_%suffix%"></td>\
        <td id="jsb_8_8_%suffix%"></td>\
        <td id="jsb_7_8_%suffix%"></td>\
        <td id="jsb_6_8_%suffix%"></td>\
        <td id="jsb_5_8_%suffix%"></td>\
        <td id="jsb_4_8_%suffix%"></td>\
        <td id="jsb_3_8_%suffix%"></td>\
        <td id="jsb_2_8_%suffix%"></td>\
        <td id="jsb_1_8_%suffix%"></td>\
        <th class="jsb_board_rank_num">八</th>\
      </tr>\
      <tr>\
        <td id="jsb_9_9_%suffix%"></td>\
        <td id="jsb_8_9_%suffix%"></td>\
        <td id="jsb_7_9_%suffix%"></td>\
        <td id="jsb_6_9_%suffix%"></td>\
        <td id="jsb_5_9_%suffix%"></td>\
        <td id="jsb_4_9_%suffix%"></td>\
        <td id="jsb_3_9_%suffix%"></td>\
        <td id="jsb_2_9_%suffix%"></td>\
        <td id="jsb_1_9_%suffix%"></td>\
        <th class="jsb_board_rank_num">九</th>\
      </tr>\
      </table>\
    </td>\
    <td id="jsb_stand_black_%suffix%" class="jsb_stand">\
      <span id="jsb_stand_black_hi_%suffix%"></span>\
      <span id="jsb_stand_black_ka_%suffix%"></span>\
      <span id="jsb_stand_black_ki_%suffix%"></span>\
      <span id="jsb_stand_black_gi_%suffix%"></span>\
      <span id="jsb_stand_black_ke_%suffix%"></span>\
      <span id="jsb_stand_black_ky_%suffix%"></span>\
      <span id="jsb_stand_black_fu_%suffix%"></span>\
    </td>\
  </tr></table></td>\
  <td class="jsb_comment">\
    <textarea id="jsb_comment_%suffix%"></textarea>\
  </td>\
</tr>\
</table>\
';


})(jQuery);

// Local variables:
// indent-tabs-mode: nil
// js2-basic-offset: 2
// end:
// vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2:
