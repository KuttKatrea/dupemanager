#!/usr/bin/env node

var app = require('commander');

app
  .usage('[options] <folder ...>')
  .parse(process.argv);

if (app.args.length == 0) {
  app.help();
}

var
  DupeManager = require('./DupeManager'),
  Hasher = require('./Hasher');

var
  dupemanager = new DupeManager(),
  hasher = new Hasher();

for (var i = 0; i < app.args.length; i += 1) {
  dupemanager.add(app.args[i]);
}

dupemanager.on('file', onFileFound);
dupemanager.on('complete', onDirectoriesProcessed);
dupemanager.run();

hasher.on('complete', onHasherComplete);

function onFileFound(file) {
  //console.log("Adding file to hasher: " + file)
  hasher.add(file);
}

function onDirectoriesProcessed() {
  console.warn('DupeManager Completed. Running Hasher');
  //console.log(hasher.file_list_);
  hasher.run();
}

function onHasherComplete() {
  console.warn('Hasher Completed')

  for (var i = 0; i < hasher.hash_list_.length; i += 1) {
    var hashgroup = hasher.hash_list_[i];

    if (hashgroup.Files.length > 1) {
      console.log(hashgroup.Hash);

      for (var j = 0; j < hashgroup.Files.length; j += 1) {
        console.log(hashgroup.Files[j].Path);
      }

      console.log();
    }
  }

}
