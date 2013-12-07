function AdvanceTracker(){
  this.stepCount = 0;
  this.advance = 0;
  this.createdAt = new Date().getTime();
};

AdvanceTracker.prototype.step = function (touchEvent, foot) {
  var delta;
  
  if (touchEvent.type === 'touchstart') {
    this.lastStepPosition = touchEvent.touches[0].clientY;
    return;
  }
  
  if (touchEvent.type === 'touchend') {
    this.stepCount++;
    return;
  }
  
  if (0 < touchEvent.touches.length) {
    delta = (touchEvent.touches[0].clientY - this.lastStepPosition);
    this.advance += delta;
    this.lastStepPosition = touchEvent.touches[0].clientY;
  }
}

