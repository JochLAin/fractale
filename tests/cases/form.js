const Fractale = require('../../lib');
const _ = require('../utils');

module.exports.title = 'Form usage';
module.exports.name = 'form-usage';
module.exports.tutorialized = true;

module.exports.resolver = (resolve) => {
    const { Form_Parent, Form_Child } = module.exports.get();
    const parent = new Form_Parent({ value: 'foo' });
    const child = new Form_Child({ parent: parent.uuid, value: 'bar' });

    _.test(child.value, 'bar', 'Error on form setter');
    _.test(child.parent.value, 'foo', 'Error on form setter');

    resolve(child);
};

module.exports.create = () => {
    const Form_Parent = Fractale.create('Form_Parent', {
        value: String,
    });
    const Form_Child = Fractale.create('Form_Child', {
        parent: Form_Parent,
        value: String,
    });

    return { Form_Parent, Form_Child };
};

let models;
module.exports.get = () => {
    if (models) return models;
    return models = module.exports.create();
};

module.exports.used = () => {
    return module.exports.get().Form_Child;
};
