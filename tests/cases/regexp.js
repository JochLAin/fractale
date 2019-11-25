const { DetailedError } = require('../error');
const { Regexped } = require('../models');
module.exports.models = [Regexped];

module.exports.title = 'RegExp model';
module.exports.name = 'regexp-model';
module.exports.tutorialized = true;

module.exports.resolver = (resolve) => {
    const instance = new Regexped({
        item_1: 'Foo',
        item_2: 'Bar',
    });

    let expected;

    expected = 'Foo';
    if (instance.item_1 !== expected) {
        throw new DetailedError('Error on regexp key accessor with type string', `Expected "${expected}" got "${instance.item_1}"`);
    }

    expected = 'Bar';
    if (instance.item_2 !== expected) {
        throw new DetailedError('Error on regexp key accessor with type string', `Expected "${expected}" got "${instance.item_2}"`);
    }

    resolve();
};
