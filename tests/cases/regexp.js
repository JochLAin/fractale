const Fractale = require('../../lib');
const _ = require('../utils');

module.exports.title = 'RegExp model';
module.exports.name = 'regexp-model';
module.exports.tutorialized = true;

const regexp = /item_\d+/gi;
const ModelWithRegExpAsKey = module.exports.ModelWithRegExpAsKey = Fractale.create('ModelWithRegExpAsKey', {
    [regexp]: String,
});

module.exports.models = [ModelWithRegExpAsKey];
module.exports.resolver = (resolve) => {
    const instance = new ModelWithRegExpAsKey({
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
