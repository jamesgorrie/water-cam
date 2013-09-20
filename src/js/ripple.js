var Ripple = (function() {

var canvas = document.getElementById('c'),
    /** @type {CanvasRenderingContext2D} */
    ctx = canvas.getContext('2d'),
    // width = 610,
    // height = 410,
    width = document.body.clientWidth,
    height = document.body.clientHeight,
    half_width = width >> 1,
    half_height = height >> 1,
    size = width * (height + 2) * 2,
    delay = 30,
    oldind = width,
    newind = width * (height + 3),
    riprad = 3,
    mapind,
    ripplemap = [],
    last_map = [],
    ripple,
    texture,
    line_width = 20,
    step = line_width * 2,
    count = height / line_width;

canvas.width = width;
canvas.height = height;

var bg = new Image();
bg.onload = function() {
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.scale(1.75, 1);
    ctx.arc((width/3.5), (height/2), (width/3.5), 0, 2 * Math.PI, false);
    ctx.clip();
    ctx.scale(1, 1);
    ctx.drawImage(this, 0, 0);
    texture = ctx.getImageData(0, 0, width, height);
    ripple = ctx.getImageData(0, 0, width, height);
    setInterval(run, delay);
};
bg.src = 'src/img/i2.jpg';

for (var i = 0; i < size; i++) {
    last_map[i] = ripplemap[i] = 0;
}

/**
 * Main loop
 */
function run() {
    newframe();
    ctx.putImageData(ripple, 0, 0);
}
texture = ctx.getImageData(0, 0, width, height);
ripple = ctx.getImageData(0, 0, width, height);
setInterval(run, delay);

/**
 * Disturb water at specified point
 */
function disturb(dx, dy) {
    dx <<= 0;
    dy <<= 0;
    riprad = Math.floor(Math.random() * 10) + 3;

    for (var j = dy - riprad; j < dy + riprad; j++) {
        for (var k = dx - riprad; k < dx + riprad; k++) {
            ripplemap[oldind + (j * width) + k] += 512;
        }
    }
}

/**
 * Generates new ripples
 */
function newframe() {
    var i, a, b, data, cur_pixel, new_pixel, old_data;

    i = oldind;
    oldind = newind;
    newind = i;

    i = 0;
    mapind = oldind;

    // create local copies of variables to decrease
    // scope lookup time in Firefox
    var _width = width,
        _height = height,
        _ripplemap = ripplemap,
        _mapind = mapind,
        _newind = newind,
        _last_map = last_map,
        _rd = ripple.data,
        _td = texture.data,
        _half_width = half_width,
        _half_height = half_height;

    for (var y = 0; y < _height; y++) {
        for (var x = 0; x < _width; x++) {
            data = (
                _ripplemap[_mapind - _width] +
                _ripplemap[_mapind + _width] +
                _ripplemap[_mapind - 1] +
                _ripplemap[_mapind + 1]) >> 1;

            data -= _ripplemap[_newind + i];
            data -= data >> 5;

            _ripplemap[_newind + i] = data;

            //where data=0 then still, where data>0 then wave
            data = 1024 - data;

            old_data = _last_map[i];
            _last_map[i] = data;

            if (old_data != data) {
                //offsets
                a = (((x - _half_width) * data / 1024) << 0) + _half_width;
                b = (((y - _half_height) * data / 1024) << 0) + _half_height;

                //bounds check
                if (a >= _width) a = _width - 1;
                if (a < 0) a = 0;
                if (b >= _height) b = _height - 1;
                if (b < 0) b = 0;

                new_pixel = (a + (b * _width)) * 4;
                cur_pixel = i * 4;

                _rd[cur_pixel] = _td[new_pixel];
                _rd[cur_pixel + 1] = _td[new_pixel + 1];
                _rd[cur_pixel + 2] = _td[new_pixel + 2];
            }

            ++_mapind;
            ++i;
        }
    }

    mapind = _mapind;
}

// generate random ripples
var rnd = Math.random;
setInterval(function() {
    disturb(rnd() * width, rnd() * height);
}, 100);

return { disturb: disturb };

});