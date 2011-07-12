/*
 * csa.js
 *
 * Copyright 2011, Masato Bito
 * Licensed under the MIT license.
 *
 */
(function(Kifu) {
Kifu.Csa = (function(kifu) { return new Kifu.Csa.initialize(kifu); });
Kifu.Csa.extend = Kifu.Csa.prototype.extend = Kifu.extend;


Kifu.Csa.prototype.extend({
  parse: function() {
    var lines = this.toLines(this.kifu.info.source);
    var l = lines.length;
    for (var i = 0; i < l; i++) {
      var line = lines[i];
      this.parseByLine(line);
    }

    return this;
  },

  parseByLine: function(line) {
    var kifu = this.kifu;

    if (line == '+') {
      kifu.info.player_start = 'black';
      return true;
    } else if (line == '-') {
      kifu.info.player_start = 'white';
      return true;
    } else if (line.substr(0, 2) == "'*") {
      kifu.moves.addComment(line.substr(2));
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
        options.black = value.charAt(0) == '+' ? true : false;
        value = value.substr(1);
        break;
      }

      kifu.moves.addSpecial(value, options);
      return true;

    case '+':
    case '-':
      var from = [line.charAt(1)-'0', line.charAt(2)-'0'];
      var to   = [line.charAt(3)-'0', line.charAt(4)-'0'];
      var piece = line.substr(5, 2);
      var black = line.charAt(0) == '+' ? true : false;
      kifu.moves.addMove(from, to, piece, {black: black});
      return true;

    case 'N':
      var player = 'player_' + (line.charAt(1) == '+' ? 'black' : 'white');
      kifu.info[player] = line.substr(2);
      return true;

    case 'P':
      switch (line.charAt(1)) {
      case 'I':
        kifu.suite_init.hirate();
        for (var i = 0; ; i++) {
          var p_info = line.substr(2+i*4, 4);
          if (p_info.length < 4) {
            break;
          }
          var x     = p_info.charAt(0) - '0';
          var y     = p_info.charAt(1) - '0';
          var piece = p_info.substr(2);
          kifu.suite_init.cellRemove(x, y, piece);
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
            kifu.suite_init.standDeploy(piece, black);
          } else {
            kifu.suite_init.cellDeploy(x, y, piece, black);
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
          kifu.suite_init.cellDeploy(x, y, piece, black);
        }
        return true;
      }
      return false;

    case 'T':
      var period = parseInt(line.substr(1));
      kifu.moves.addPeriod(period);
      return true;

    case 'V':
      kifu.info.version = line.substr(1);
      return true;
    }

    return false;
  },

  toLines: function(source) {
    var result = [];
    var lines = source.replace(/,(\r?\n|\r)/g, '').split(/\r?\n|\r/);
    var l = lines.length;
    for (var i = 0; i < l; i++) {
      var line = lines[i];
      if (line) {
        result.push(lines[i]);
      }
    }
    return result;
  }
});

Kifu.Csa.extend({
  initialize: function(kifu) {
    this.kifu = kifu;
  }
});


Kifu.Csa.initialize.prototype = Kifu.Csa.prototype
})(Kifu);

// Local variables:
// indent-tabs-mode: nil
// js2-basic-offset: 2
// end:
// vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2:
