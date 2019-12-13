const Fractale = require('../../lib');
const _ = require('../utils');

module.exports.title = 'Self-reference model';
module.exports.name = 'reference';
module.exports.tutorialized = true;

module.exports.resolver = (resolve) => {
    const { Self } = module.exports.get();
    const instance_1 = new Self({ value: 'foo' });
    const instance_2 = new Self({ self: { self: instance_1, value: 'bar' }, value: 'hello' });

    _.test(instance_1.value, 'foo', 'Error on deep accessor variable name');
    _.test(instance_2.self.value, 'bar', 'Error on self-reference accessor');
    _.test(instance_2.self.self.value, 'foo', 'Error on double self-reference accessor');
    _.test(instance_2.self.self.self, undefined, 'Error infinite self-reference accessor');

    resolve(instance_2);
};

module.exports.create = () => {
    const Self = Fractale.create('Self', {
        self: Fractale.SELF,
        value: String,
    });

    return { Self };
};

let models;
module.exports.get = () => {
    if (models) return models;
    return models = module.exports.create();
};

module.exports.used = () => {
    return module.exports.get().Self;
};
