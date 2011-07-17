/*
 * move.js
 *
 * Copyright 2011, Masato Bito
 * Licensed under the MIT license.
 *
 */
(function(Kifu) {
Kifu.Move = (function() { return new Kifu.Move.initialize(); });
Kifu.Move.extend = Kifu.Move.prototype.extend = Kifu.extend;


Kifu.Move.prototype.extend({
  addComment: function(comment) {
    var move = this.records[this.records.length-1];
    move.comment = (move.comment || '') + comment + "\n";
    return this;
  },

  addMove: function(params) {
    var move = this.newMove();
    move.type = 'move';
    for (var property in params) {
      move[property] = params[property];
    }
    return this;
  },

  addPeriod: function(period) {
    this.records[this.records.length-1].period = period;
    return this;
  },

  addSpecial: function(type, options) {
    var move = this.newMove();
    move.type = type;
    for (var property in options) {
      move[property] = options[property];
    }
    return this;
  },

  clone: function() {
    var obj = new Kifu.Move;
    obj.records = Kifu.clone(this.records);
    return obj;
  },

  get: function(step) {
    return this.records[step];
  },

  getLastMoveNum: function() {
    var move;
    var len = this.records.length;
    if (len <= 1) return 0;

    move = this.records[len - 1];
    if (move.type != 'move') len--; // ignore 'TORYO'
    return len - 1;   // ignore 'init'
  },

  newMove: function() {
    var move = this.records[this.records.length-1];
    if (move.type) {
      this.records.push({});
      move = this.records[this.records.length-1];
    }
    return move;
  },

  setMove: function(num, params) {
    var records = this.records;
    records[num] || (records[num] = {});
    var move = records[num];
    move.type = 'move';
    for (var property in params) {
      move[property] = params[property];
    }
    return this;
  }
});

Kifu.Move.extend({
  initialize: function() {
    this.records = [{type: 'init'}];
  }
});


Kifu.Move.initialize.prototype = Kifu.Move.prototype;
})(Kifu);

// Local variables:
// indent-tabs-mode: nil
// js2-basic-offset: 2
// end:
// vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2:
