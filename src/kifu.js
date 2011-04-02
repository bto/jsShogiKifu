/*
 * Kifu.js
 */
(function(window) {


var _Kifu = window.Kifu;

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
  format: function(format) {
    if (format) {
      this._format = format;
    }
    return this._format;
  },

  parse: function(format) {
    if (format) {
      this.format(format);
    }
    var method = 'parseAs' + Kifu.capitalize(this.format());
    return this[method]();
  },

  parseAsCsa: function() {
  },

  source: function(source) {
    if (source) {
      this._source = source;
    }
    return this._source;
  }
});

Kifu.extend({
  initialize: function(source, format) {
    this.source(Kifu.load(source));
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


window.Kifu = Kifu;
})(window);

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2: */
