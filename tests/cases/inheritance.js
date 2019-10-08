
const { Parent, Child } = require('../models');
module.exports.models = [Parent, Child];

module.exports.title = 'Inheritance model';
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
        throw new Error('Error on parent method call');
    }

    if (instance.sayHelloTo(1) !== 'Hello you') {
        throw new Error('Error on parent method call');
    }

    if (instance.toUpperCase() !== 'HELLO') {
        throw new Error('Error on method inheritance');
    }

    if (!instance.serialize()) {
        throw new Error('Error on inheritance serializer');
    }

    resolve(instance.serialize());
};
