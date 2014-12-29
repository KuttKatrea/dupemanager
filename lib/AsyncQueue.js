var eventslib = require('events'),
  utillib = require('util');

var AsyncQueue = function AsyncQueue(maxConcurrent) {
  this.max_concurrent_ = maxConcurrent || 8;
  this.running_ = false;
  this.completed_ = false;
  this.pending_ = [];
};

utillib.inherits(AsyncQueue, eventslib.EventEmitter);

AsyncQueue.prototype.next = function() {
  var self = this;

  //console.log(self + '.next()');
  //console.log(self + ': Max Concurrent: ' + self.max_concurrent_);
  //console.log(self + ': Pending: ' + self.pending_);
  //console.log(self + ': Current: ' + self.current_);

  if (self.pending_.length <= 0) {
    //console.log('No more pending. Wainitng for: ', self.current_.length);

    if (self.current_.length <= 0) {

      if (!this.completed_) {
        this.completed_ = true;
        self.emit("complete")
      }

    }

    return;
  }

  if (self.current_.length <= self.max_concurrent_) {
    //console.log(self + ': Running Next');
    var nextElement = self.pending_.shift();

    self.current_.push(nextElement);

    nextElement.on('complete', function() {
      //console.log('element Complete')

      var idx = self.current_.indexOf(nextElement);
      self.current_.splice(idx, 1);
      self.next();
    });

    //console.log(self + ': Next is ' + nextElement);

    nextElement.run();
  } else {
    //console.log('Max running');
  }
}

AsyncQueue.prototype.run = function() {
  //console.log(this + '.run')

  if (this.running_) {
    throw new Error(this + ": Already running");
  }

  this.running_ = true;
  this.current_ = [];

  var toLaunch = this.max_concurrent_ <= this.pending_.length ? this.max_concurrent_ : this.pending_.length;

  //console.log(this + ': Running ' + (this.max_concurrent_ || this.pending_.length) + ' threads');

  for (i = 0; i < toLaunch; i += 1) {
    this.next();
  }
}

AsyncQueue.prototype.add = function(element) {
  //console.log(this + '.add: ' + element)
  if (this.completed_)
    throw new Error(this + ": Already completed");

  this.pending_.push(element);
};

AsyncQueue.prototype.toString = function() {
  return '*AsyncQueue';
};

module.exports = AsyncQueue;
