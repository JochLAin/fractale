const _ = require('../utils');
const { Simple } = require('../models');

module.exports.models = [Simple];
module.exports.title = 'Simple model';
module.exports.name = 'simple-model';
module.exports.tutorialized = true;

module.exports.resolver = (resolve) => {
    const instance = new Simple({
        mixed: 'It\'s dangerous to go alone! Take this.',
        boolean: false,
        number: 31,
        string: 'Lorem ipsum'
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
