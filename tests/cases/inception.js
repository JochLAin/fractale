const Fractale = require('../../lib');
const _ = require('../utils');

module.exports.title = 'Inception model';
module.exports.name = 'inception-model';
module.exports.tutorialized = true;

module.exports.resolver = (resolve) => {
    const { Inception_Child } = module.exports.get();
    const child = new Inception_Child({
        parent: { value: 'foo' },
        value: 'bar',
    });

    _.test(child.parent.value, 'foo', 'Error on inception setter with dot');

    const parent = child.parent;
    const value = 'hello world';
    parent.value = value;
    _.test(child.parent.value, value, 'Error on inception setter with dot');

    child.parent.value = 'foo';
    _.test(child.parent.value, 'foo', 'Error on deep setter with dot');

    resolve(child);
};

module.exports.create = () => {
    const Inception_Parent = Fractale.create('Inception_Parent', {
        value: String,
    });
    const Inception_Child = Fractale.create('Inception_Child', {
        parent: Inception_Parent,
        value: String,
    });

    return { Inception_Parent, Inception_Child };
};

let models;
module.exports.get = () => {
    if (models) return models;
    return models = module.exports.create();
};

module.exports.used = () => {
    return module.exports.get().Inception_Child;
};
