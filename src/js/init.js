(function(){
  var tracker = new AdvanceTracker();

  var left = document.querySelector('#foot-left');
  var right = document.querySelector('#foot-right');
  var distance = document.querySelector('#distance');
  var stepCount = document.querySelector('#stepCount');
  
  var stepping = function (side) {
    return function (touchEv) { tracker.step(touchEv, side) };
  }
  
  document.body.addEventListener('touchmove', function (touchEv) {
    touchEv.preventDefault();
  }, false);
  
  left.addEventListener('touchstart', stepping('left'), false);
  left.addEventListener('touchmove', stepping('left'), false);
  left.addEventListener('touchend', stepping('left'), false);
  
  right.addEventListener('touchstart', stepping('right'), false);
  right.addEventListener('touchmove', stepping('right'), false);
  right.addEventListener('touchend', stepping('right'), false);
  
  function frame () {
    distance.textContent = tracker.advance + "px";
    stepCount.textContent = tracker.stepCount + "歩";
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  
})();