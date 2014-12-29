var fslib = require('fs'),
    cryptolib = require('crypto'),
    utillib = require('util');

var
  AsyncQueue = require('./AsyncQueue'),
  HashGroup = require('./HashGroup');

var Hasher = function Hasher() {
  this.hash_list_ = [];
  this.hash_map_ = {};
  this.file_list_ = [];

  Hasher.super_.apply(this, arguments);
}

utillib.inherits(Hasher, AsyncQueue);

Hasher.prototype.add = function(element) {
  var self = this;

  element.on('complete', function() {
    var hashgroup;

    if (element.Hash in self.hash_map_) {
      hashgroup = self.hash_map_[element.Hash];
    } else {
      hashgroup = new HashGroup(element.Hash);
      self.hash_map_[element.Hash] = hashgroup;
      self.hash_list_.push(hashgroup);
    }

    hashgroup.add(element);
    self.file_list_.push(element);
  });

  Hasher.super_.prototype.add.apply(this, arguments);
}

Hasher.prototype.toString = function() {
  return '*Hasher';
}

module.exports = Hasher;
