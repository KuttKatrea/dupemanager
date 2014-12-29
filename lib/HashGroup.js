var HashGroup = function HashGroup(hash) {
  this.Hash = hash;
  this.Files = [];
};

HashGroup.prototype.add = function(file) {
  if (file.Hash != this.Hash) {
    throw new Error('The hashes dont match');
  }

  if (file.getHashGroup() != null) {
    throw new Error('This file already belongs to another HashGroup');
  }

  this.Files.push(file);
  file.setHashGroup(this);
};

HashGroup.prototype.toString = function() {
  return '*HashGroup[' + this.Hash + ': ' + this.Files + ']';
}

module.exports = HashGroup;
