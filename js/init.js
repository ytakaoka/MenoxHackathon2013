(function () {
  var tracker = new AdvanceTracker();
  var walker = new StreetWalker(path);

  var left = document.querySelector('#foot-left');
  var right = document.querySelector('#foot-right');
  var road = document.querySelector('#road');
  var streetView = document.querySelector('#streetview');
  var distance = document.querySelector('#distance');
  var stepCount = document.querySelector('#stepCount');
  var streetView = document.querySelector('#streetview');
  
  var schema = location.protocol !== 'file:' ? '' : 'http:';
  var lastFrame = 0;
  
  function stepping (side) {
    return function (touchEv) {
      var touches = touchEv.touches, i;
      if (!touchEv.touches || (i = touches.length) <= 0) {
        tracker.step(touchEv.type, null, side);
      }
      while (i--) {
        if (touches[i].target !== touchEv.target) { continue; }
        tracker.step(touchEv.type, touches[i], side);
        requestAnimationFrame(frame);
        return;
      }
    };
  }
  
  function pxToMeter (px) {
    return (px / 16).toFixed(2) * 1;
  }
  
  var getViewUrl = (function () {
    var w = streetView.clientWidth;
    var h = streetView.clientHeight;
    return function (latlng) {
      return schema + '//maps.googleapis.com/maps/api/streetview?size=' + w + 'x' + h
      + '&location=' + latlng.lat + ',' + latlng.lng
      + '&fov=90&heading=' + latlng.heading + '&pitch=0&sensor=false';
    };
  })();
  
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
    var advance_px = tracker.getAdvance();
    var advance = pxToMeter(tracker.getAdvance());
    var totalDistance = pxToMeter(advance);
    
    if (0.7 < totalDistance - lastFrame) {
      requestAnimationFrame(updateView);
      lastFrame = totalDistance;
    }
    
    distance.textContent = totalDistance;
    stepCount.textContent = tracker.getStepCount();
    
    road.style['background-position'] = '0 ' + advance_px % road.clientHeight + 'px';
  };
  
  function updateView () {
    var advance_px = tracker.getAdvance();
    var advance = pxToMeter(tracker.getAdvance());
    var now = new Date().getTime();
    
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.open('GET', getViewUrl(walker.takeView(advance)), true);
    xhr.addEventListener('load', function () {
      if (this.status !== 200) { return; }
      streetView.style['background-image'] = 'url(' + URL.createObjectURL(this.response) + ')';
    });
    
    xhr.send('');
  }
  updateView();
})();
