const _ = require('../utils');
const { Compound } = require('../models');
module.exports.models = [Compound];

module.exports.title = 'Metadata model';
module.exports.name = 'metadata-model';
module.exports.tutorialized = true;

module.exports.resolver = (resolve) => {
    const instance = new Compound({
        string: 'Hello world',
        boards: ['Lorem ipsum', 'Dolores sit amet'],
        metadata: { key: 'Foo', data: { key: 'Bar', value: 12 }}
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
