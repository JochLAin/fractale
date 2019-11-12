
const { Complex } = require('../models');
module.exports.models = [Complex];

module.exports.title = 'Complex model';
module.exports.tutorialized = true;

module.exports.resolver = (resolve) => {
    const instance = new Complex({

    });

    if (instance.firstname !== 'Jocelyn') {
        throw new Error('Error on form setter');
    }
    if (!instance.serialize()) {
        throw new Error('Error on form serializer');
    }

    resolve(instance.serialize());
};
