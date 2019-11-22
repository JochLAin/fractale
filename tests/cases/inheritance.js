const { DetailedError } = require('../error');
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

    if (instance.sayHelloTo(0) !== 'Hello world') {
        throw new DetailedError('Error on parent method call', `Expected "Hello world" got "${instance.sayHelloTo(0)}"`);
    }

    if (instance.sayHelloTo(1) !== 'Hello you') {
        throw new DetailedError('Error on parent method call', `Expected "Hello you" got "${instance.sayHelloTo(1)}"`);
    }

    if (instance.toUpperCase() !== 'HELLO') {
        throw new DetailedError('Error on method inheritance', `Expected "HELLO" got "${instance.toUpperCase()}"`);
    }

    resolve(instance);
};
