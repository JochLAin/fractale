
const { Compound } = require('../models');
module.exports.models = [Compound];

module.exports.title = 'Metadata model';
module.exports.tutorialized = true;

module.exports.resolver = (resolve) => {
    const instance = new Compound({
        string: 'Hello world',
        boards: ['Lorem ipsum', 'Dolores sit amet'],
        metadata: { key: 'Foo', data: { key: 'Bar', value: 12 }}
    });

    const metadata = instance.metadata;
    metadata.key = 'decomposition';

    if (instance.metadata.key !== 'decomposition') {
        throw new Error('Error on metadata accessor with decomposition');
    }

    instance.metadata.key = 'dot';
    if (instance.metadata.key !== 'dot') {
        throw new Error('Error on metadata accessor with dot');
    }

    instance.metadata = { key: 'assign' };
    if (instance.metadata.key !== 'assign') {
        throw new Error('Error on metadata accessor with assign');
    }

    instance.metadata = { data: { key: 'after', value: 'after' } };
    if (instance.metadata.key !== 'assign' || instance.metadata.data.key !== 'after') {
        throw new Error('Error on metadata accessor with bracket');
    }

    if (!instance.serialize()) {
        throw new Error('Error on metadata serializer');
    }

    resolve(instance.serialize());
};
