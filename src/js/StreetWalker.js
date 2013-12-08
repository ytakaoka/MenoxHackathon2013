function Line (from, to) {
  var spherical = google.maps.geometry.spherical;
  this.from = from;
  this.to = to;
  this.distance = spherical.computeDistanceBetween(from, to);
  this.heading = spherical.computeHeading(from, to);
}

function StreetWalker (path) {
  var GLatLng = google.maps.LatLng;
  var base = 6;
  this.path = 
  this.plan = StreetWalker.makePlan(
    path.reduce(function (acc, i) {
      var prev = acc[acc.length - 1];
      var curr = new GLatLng(i[0].toFixed(base)*1, i[1].toFixed(base)*1);
      if (!prev || prev.lat() !== curr.lat() || prev.lng() !== curr.lng()) {
        acc.push(curr);
      }
      return acc;
    }, [])
  );
  this.distance = StreetWalker._gSpherical.computeLength(this.path);
}

StreetWalker._gSpherical = google.maps.geometry.spherical;

StreetWalker.makePlan = function (path) {
  var first = new Line(path.shift(), path.shift());
  
  return path.reduce(function (acc, i) {
    var prev = acc[acc.length - 1];
    var curr = new Line(prev.to, i);
    acc.push(curr);
    return acc;
  }, [ first ] );
}

StreetWalker.prototype.takeView = function (distance) {
  if (distance < 0) { distance = 0; }
  distance = Math.floor(distance);
  if (this.distance < distance) { distance = this.distance; }
  
  var currentLine, currentDistance, currentLatLng;
  
  for (var i = 0, ceil = this.plan.length, s = 0; i < ceil; i++) {
    var line = this.plan[i];
    if (s < distance) {
      s += line.distance;
      continue;
    }
    currentLine = line;
    currentDistance = distance - s;
    break;
  }
  
  currentLatLng = StreetWalker._gSpherical.computeOffset(currentLine.from, currentDistance, currentLine.heading);
  
  return {
    lat : currentLatLng.lat(),
    lng : currentLatLng.lng(),
    heading : currentLine.heading
  };
};
