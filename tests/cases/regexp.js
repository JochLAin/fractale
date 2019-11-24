const { DetailedError } = require('../error');
const { Regexped } = require('../models');
module.exports.models = [Regexped];

module.exports.title = 'RegExp model';
module.exports.name = 'regexp-model';
module.exports.tutorialized = true;

module.exports.resolver = (resolve) => {
    const regexped = new Regexped({
        item_1: 'Foo',
        item_2: 'Bar',
    });

    console.log(regexped.serialize());

    resolve();
};
