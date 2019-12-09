const Fractale = require('../../lib');
const _ = require('../utils');

module.exports.title = 'RegExp key model';
module.exports.name = 'regexp';
module.exports.tutorialized = true;

module.exports.resolver = (resolve) => {
    const { ModelWithRegExpAsKey } = module.exports.get();
    const instance = new ModelWithRegExpAsKey({
        item_1: 'Foo',
        item_2: 'Bar',
    });

    _.test(instance.item_1, 'Foo', 'Error on regexp key accessor with type string');
    _.test(instance.item_2, 'Bar', 'Error on regexp key accessor with type string');

    resolve();
};

module.exports.create = () => {
    const regexp = /item_\d+/gi;
    const ModelWithRegExpAsKey = Fractale.create('ModelWithRegExpAsKey', {
        [regexp]: String,
    });

    return { ModelWithRegExpAsKey };
};

let models;
module.exports.get = () => {
    if (models) return models;
    return models = module.exports.create();
};
