var
  util = require('util'),
  events = require('events');

var
  AsyncQueue = require('./AsyncQueue'),
  Directory = require('./Directory'),
  Hasher = require('./Hasher');

var DupeManager = function DupeManager() {
  DupeManager.super_.apply(this, arguments);
}

util.inherits(DupeManager, AsyncQueue);

DupeManager.prototype.add = function(folder) {
  if (typeof(folder) == 'string') {
    folder = new Directory(folder);
  }

  var self = this;

  folder.on('file_found', function(file) {
    //console.log(self + ': Found file: ' + file);
    self.emit('file', file);
  });

  folder.on('folder_found', function(folder) {
    //console.log(self + ': Adding folder: ' + folder);
    self.add(folder);
  });

  DupeManager.super_.prototype.add.apply(self, arguments);
}

DupeManager.prototype.toString = function() {
  return '*DupeManager';
}

module.exports = DupeManager;
