const Fractale = require('../../../lib');
const _ = require('../../utils');

module.exports.title = 'Global options';
module.exports.name = 'global_options';
module.exports.tutorialized = true;

module.exports.resolver = (resolve) => {
    const { Global_Options } = module.exports.get();

    const instance = new Global_Options({
        transformed: 39,
    });

    _.test(instance.transformed, 39, 'Error on global option transform accessor with type percentage');

    instance.transformed = '10%';

    _.test(instance.transformed, 0.1, 'Error on global option transform accessor with type percentage');

    resolve(instance);
};

module.exports.create = () => {
    const Global_Options = Fractale.create('Global_Options', {
        transformed: Fractale.with(Number, {
            transform: (value) => {
                if (typeof value !== 'string') return value;
                if (value.indexOf('%') !== (value.length - 1)) return value;
                return Number(value.slice(0, -1)) / 100;
            }
        }),
    });
    return { Global_Options };
};

let models;
module.exports.get = () => {
    if (models) return models;
    return models = module.exports.create();
};

module.exports.used = () => {
    return module.exports.get().Global_Options;
};
