max = 0;
min = 0;
(function(Ripple) {

var Handsplash = function() {
  var l = new Leap.Controller({ enableGestures: true }),
      log = document.getElementById('d'),
      canvas = document.getElementById('m'),
      ctx = canvas.getContext('2d'),
      width = document.body.clientWidth,
      height = document.body.clientHeight,
      self = this,
      ripple = Ripple();
  
  canvas.width = width;
  canvas.height = height;

  ctx.lineWidth = 5;
  ctx.strokeStyle = '#000000';

  this.canvas = canvas;
  this.ctx = ctx;
  this.ripple = ripple;

  Leap.loop(this.loop.bind(this));
};

Handsplash.prototype.currentGesture = null;
Handsplash.prototype.canvas = null;
Handsplash.prototype.ctx = null;
Handsplash.prototype.after = {};
Handsplash.prototype.before = {};


Handsplash.prototype.loop = function(frame, done) {
  this.after = {};
  for (var i = 0; i < frame.pointables.length; i++) {
    this.after[frame.pointables[i].id] = frame.pointables[i];
  }

  this.draw();
  done();
};

Handsplash.prototype.draw = function() {
  var a, b,
      x, y;
  for (var id in this.after) {
    var b = this.before[id],
        a = this.after[id];

    if (!b) continue;
    
    x = (-(this.canvas.width / (a.tipPosition[0]+400))*150);
    y = a.tipPosition[2] + 500;

    this.ripple.disturb(x+200, y*1.5)
  }

  this.before = this.after;

  return true;
};

// gogogo
var init = function() { var handsplash = new Handsplash(); }; // init
window.addEventListener('load', init, false);

})(Ripple); // end


