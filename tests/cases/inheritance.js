const Fractale = require('../../lib');
const _ = require('../utils');

module.exports.title = 'Inheritance model';
module.exports.name = 'inheritance';
module.exports.tutorialized = true;

module.exports.resolver = (resolve) => {
    const { Inheritance_Parent } = module.exports.get();
    const instance = new Inheritance_Parent({
        value: 'Hello',
        children: [
            { value: 'world' },
            { value: 'you' },
        ]
    });

    _.test(instance.sayHelloTo(0), 'Hello world', `Expected "Hello world" got "${instance.sayHelloTo(0)}"`);
    _.test(instance.sayHelloTo(1), 'Hello you', 'Error on parent method call');
    _.test(instance.toUpperCase(), 'HELLO', 'Error on method inheritance');

    resolve(instance);
};

module.exports.create = () => {
    const Inheritance_Child = Fractale.create('Inheritance_Child', {
        value: String,
    });
    Inheritance_Child.prototype.toUpperCase = function () {
        return this.value.toUpperCase();
    };
    Inheritance_Child.prototype.toLowerCase = function () {
        return this.value.toLowerCase();
    };

    const Inheritance_Parent = Fractale.create('Inheritance_Parent', Inheritance_Child, {
        children: [Inheritance_Child],
    });
    Inheritance_Parent.prototype.sayHelloTo = function (index) {
        return `${this.value} ${this.children[index].value}`;
    };

    return { Inheritance_Child, Inheritance_Parent };
};

let models;
module.exports.get = () => {
    if (models) return models;
    return models = module.exports.create();
};

module.exports.used = () => {
    return module.exports.get().Inheritance_Parent;
};
