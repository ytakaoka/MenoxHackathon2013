function Feet () {
  this.advance = 0;
  this.landAt = null;
  this.pitch = 0;
  this.stepCount = 0;
};

Feet.prototype.land = function (at) {
  if (0 < this.advance) { this.stepCount++; }
  
  this.landAt = at;
  this.pitch = 0;
  this.stepCount++;
}

Feet.prototype.push = function (to) {
  if (this.landAt === null) { return; }
  this.pitch = to - this.landAt;
}

Feet.prototype.kickOff = function () {
  this.landAt = null;
}


function AdvanceTracker(){
  this.advance = 0;
  this.foot = {
    left : new Feet(),
    right : new Feet()
  };
};

AdvanceTracker.prototype.getAdvance = function () {
  return this.advance + this.foot.left.pitch + this.foot.right.pitch;
}

AdvanceTracker.prototype.getStepCount = function () {
  return this.foot.left.stepCount + this.foot.right.stepCount;
}

AdvanceTracker.prototype.step = function (type, touch, feet) {
  var feet = this.foot[feet];
  
  if (type === 'touchstart') {
    this.advance += feet.pitch;
    if (this.interval < feet.pitch) {
      this.onInterval();
    }
    feet.land(touch.clientY);
  } else if (type === 'touchend') {
    feet.kickOff();
  } else if (type === 'touchmove') {
    feet.push(touch.clientY);
  }
}

