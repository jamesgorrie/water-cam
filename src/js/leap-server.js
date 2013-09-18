var Leap = require('../../node_modules/leapjs/lib/index'),
    lm = new Leap.Controller({ host: '0.0.0.0', port: 1337 });

lm.connect();