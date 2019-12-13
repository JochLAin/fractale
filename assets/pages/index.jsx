const Fractale = require('../../lib');

window.Fractale = Fractale;
Fractale.memory.provider = 'idb';
require('../../tests/index').run();
