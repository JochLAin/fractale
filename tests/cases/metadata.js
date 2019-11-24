const { DetailedError } = require('../error');
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

    if (instance.metadata.key !== 'Foo') {
        throw new DetailedError('Error on metadata accessor', `Expected "Foo" got "${instance.metadata.key}"`);
    }

    const metadata = instance.metadata;
    metadata.key = 'decomposition';

    if (instance.metadata.key !== 'decomposition') {
        throw new DetailedError('Error on metadata accessor with decomposition', `Expected "decomposition" got "${instance.metadata.key}"`);
    }

    instance.metadata.key = 'dot';
    if (instance.metadata.key !== 'dot') {
        throw new DetailedError('Error on metadata accessor with dot', `Expected "dot" got "${instance.metadata.key}"`);
    }

    instance.metadata = { key: 'assign' };
    if (instance.metadata.key !== 'assign') {
        throw new DetailedError('Error on metadata accessor with assign', `Expected "assign" got "${instance.metadata.key}"`);
    }
    if (!instance.metadata.data) {
        throw new DetailedError('Error on metadata accessor with assign', `Expected "Compound_Metadata_Data" got "${instance.metadata.data}"`);
    }
    if (instance.metadata.data.key !== 'Bar') {
        throw new DetailedError('Error on metadata accessor with assign', `Expected "Bar" got "${instance.metadata.data.key}"`);
    }

    instance.metadata = { data: { key: 'after', value: 13 } };
    if (instance.metadata.key !== 'assign') {
        throw new DetailedError('Error on metadata accessor with bracket', `Expected "assign" got "${instance.metadata.key}"`);
    }
    if (instance.metadata.data.key !== 'after') {
        throw new DetailedError('Error on metadata accessor with bracket', `Expected "after" got "${instance.metadata.data.key}"`);
    }
    if (instance.metadata.data.value !== 13) {
        throw new DetailedError('Error on metadata accessor with bracket', `Expected "13" got "${instance.metadata.data.value}"`);
    }

    resolve(instance);
};
