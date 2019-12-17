const Fractale = require('../../lib');
const _ = require('../utils');

module.exports.title = 'Metadata model';
module.exports.name = 'metadata';
module.exports.tutorialized = true;

module.exports.resolver = (resolve) => {
    const { Metadata } = module.exports.get();
    const instance = new Metadata({
        metadata: { key: 'Foo', data: { key: 'Bar', value: 12 } }
    });

    _.test(instance.metadata.key, 'Foo', 'Error on metadata accessor');

    const metadata = instance.metadata;
    metadata.key = 'decomposition';

    _.test(instance.metadata.key, 'decomposition', 'Error on metadata accessor with decomposition');

    instance.metadata.key = 'dot';
    _.test(instance.metadata.key, 'dot', 'Error on metadata accessor with dot');

    instance.metadata = { key: 'assign' };
    _.test(instance.metadata.key, 'assign', 'Error on metadata accessor with assign');
    _.test(instance.metadata.data.key, 'Bar', 'Error on metadata accessor with assign');

    instance.metadata = { data: { key: 'after', value: 13 } };
    _.test(instance.metadata.key, 'assign', 'Error on metadata accessor with bracket');
    _.test(instance.metadata.data.key, 'after', 'Error on metadata accessor with bracket');
    _.test(instance.metadata.data.value, 13, 'Error on metadata accessor with bracket');

    resolve(instance);
};

module.exports.create = () => {
    const Metadata = Fractale.create('Metadata', {
        metadata: {
            key: String,
            data: {
                key: String,
                value: undefined
            }
        },
    });

    return { Metadata };
};

let models;
module.exports.get = () => {
    if (models) return models;
    return models = module.exports.create();
};

module.exports.used = () => {
    return module.exports.get().Metadata;
};
