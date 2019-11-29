const Fractale = require('../../lib');
const _ = require('../utils');

module.exports.title = 'Simple model';
module.exports.name = 'simple';
module.exports.tutorialized = true;

module.exports.resolver = (resolve) => {
    const { Simple } = module.exports.get();
    const instance = new Simple({
        mixed: 'It\'s dangerous to go alone! Take this.',
        boolean: false,
        number: 31,
        string: 'Lorem ipsum',
        date: '2000-01-01',
    });

    _.test(instance.mixed, 'It\'s dangerous to go alone! Take this.', 'Error on simple accessor with type mixed');
    _.test(instance.boolean, false, 'Error on simple accessor with type boolean');
    _.test(instance.number, 31, 'Error on simple accessor with type number');
    _.test(instance.string, 'Lorem ipsum', 'Error on simple accessor with type string');

    instance.mixed = -1;
    instance.boolean = true;
    instance.number = 42;
    instance.string = 'Dolor sit amet';

    _.test(instance.mixed, -1, 'Error on simple accessor with type mixed after change');
    _.test(instance.boolean, true, 'Error on simple accessor with type boolean after change');
    _.test(instance.number, 42, 'Error on simple accessor with type number after change');
    _.test(instance.string, 'Dolor sit amet', 'Error on simple accessor with type string after change');

    resolve(instance);
};

module.exports.create = () => {
    const Simple = module.exports.Simple = Fractale.create('Simple', {
        mixed: null,
        boolean: Boolean,
        number: Number,
        string: String,
        date: Date,
    });

    return { Simple };
};

let models;
module.exports.get = () => {
    if (models) return models;
    return models = module.exports.create();
};

module.exports.used = () => {
    return module.exports.get().Simple;
};
