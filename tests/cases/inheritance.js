const _ = require('../utils');
const { Parent, Child } = require('../models');
module.exports.models = [Parent, Child];

module.exports.title = 'Inheritance model';
module.exports.name = 'inheritance-model';
module.exports.tutorialized = true;

module.exports.resolver = (resolve) => {
    const instance = new Parent({
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
