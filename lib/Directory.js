var fslib = require('fs');
var pathlib = require('path');
var utillib = require('util');
var events = require('events');

var File = require('./File');

var Directory = function Directory(path) {
  this.Path = pathlib.resolve(path);
  Directory.super_.apply(this);
};

utillib.inherits(Directory, events.EventEmitter);

Directory.prototype.run = function run() {
  var pending_paths = {};
  var self = this;

  fslib.readdir(this.Path, onReadDir);

  function validateCompletion() {
    //console.log(self + ': Validate completion')

    for (var any_path in pending_paths) {
      if (pending_paths.hasOwnProperty(any_path)) {
        //console.log(self + ': Still Pending: ' + pending_paths);
        return false;
      }

    }

    //console.log(self + ': Walk Complete');
    self.emit('complete');
    return true;
  }

  function getFileStatCallback(filepath) {

    return function onFileStat(err, stats) {
      delete pending_paths[filepath];

      if (err) {
        //console.error(self + '.onFileStat: ' + filepath +'\nError: ' + err);
      } else {
        //console.log(self + '.onFileStat:' + filepath);

        if (stats.isDirectory()) {
          self.emit('folder_found', new Directory(filepath));
        }

        if (stats.isFile()) {
          self.emit('file_found', new File(filepath));
        }

        //console.log(self + ': Ignorado: ' + filepath);
      }

      validateCompletion();
    }
  }

  function onReadDir(err, files) {
    //console.log(self + ': Has files: ' + files)
    if (err) {
      //console.error('onReadDir', err);
      self.emit('error');
      return;
    }

    if (files.length == 0) {
      //console.error("Dir empty")
      validateCompletion();
    }

    for (var i = 0, l = files.length; i < l; i += 1) {
      var fullpath = pathlib.join(self.Path, files[i]);
      //console.log(self + ': Stating: ' + fullpath);

      pending_paths[fullpath] = 1;

      fslib.lstat(fullpath, getFileStatCallback(fullpath));
    }
  }
};

Directory.prototype.toString = function() {
  return '*Directory[' + this.Path + ']';
}

module.exports = Directory;
