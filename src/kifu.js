/*
 * Kifu.js
 */
(function(window) {


var _Kifu = window.Kifu;

var Kifu = (function() {
});

Kifu.extend = Kifu.prototype.extend = function(source) {
  for (var property in source) {
    this[property] = source[property];
  }
  return this;
}

Kifu.prototype.extend({
});

Kifu.extend({
  noConflict: function() {
    window.Kifu = _Kifu;
    return Kifu;
  }
});


window.Kifu = Kifu;
})(window);

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2: */
