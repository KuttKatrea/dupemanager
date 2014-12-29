var
  eventslib = require('events'),
  utillib = require('util'),
  cryptolib = require('crypto'),
  fslib = require('fs');

var File = function File(path) {
  this.Path = path;
  this.Hash = null;
}

utillib.inherits(File, eventslib.EventEmitter);

File.prototype.getHashGroup = function() {
  return this.hashGroup_;
}

File.prototype.setHashGroup = function(hashgroup) {
  return this.hashGroup_ = hashgroup;
}

File.prototype.run = function() {
  //console.log(File, this.Path, "Calculating Hash")

  var self = this;
  var shasum = cryptolib.createHash('md5');
  /*.update('Apple').digest("hex");
  var sha1 = cryptolib.createHash('sha1').update('Apple').digest("hex");
  var sha256 = cryptolib.createHash('sha256').update('Apple').digest("hex");
  */

  var s = fslib.ReadStream(this.Path);

  s.on('error', function(err) {
    self.emit('error');
  });

  s.on('data', function(d) { shasum.update(d); });
  s.on('end', function() {
      var d = shasum.digest('hex');
      self.Hash = d;

      //console.log('File', self.Path, "Hash Calculated")

      self.emit('complete');
  });
}

File.prototype.toString = function() {
  return '*File[' + this.Path + ']';
}

module.exports = File;
