const { Class, Variable } = require('../models');
module.exports.models = [Class];

module.exports.title = 'Self-reference model';
module.exports.name = 'reference-model';
module.exports.tutorialized = true;

module.exports.resolver = (resolve) => {
    const _a = new Variable({ name: 'a', value: 0 });
    const a = new Class({
        name: 'A',
        properties: [_a],
        methods: [
            { signature: { name: 'getA' }},
            { signature: { name: 'setA', variables: [{ name: 'a' }] }}
        ]
    });

    const b = new Class({
        name: 'B',
        inheritance: a,
        properties: [
            { name: 'b', value: 0 },
        ],
        methods: [
            { signature: { name: 'getB' }},
            { signature: { name: 'setB', variables: [{ name: 'b' }] }}
        ]
    });

    const c = new Class({
        name: 'C',
        inheritance: b,
        properties: [
            { name: 'c', value: 0 },
        ],
        methods: [
            { signature: { name: 'getC' }},
            { signature: { name: 'setC', variables: [{ name: 'c' }] }}
        ]
    });

    if (a.properties[0].name !== 'a') {
        throw new Error('Error on deep accessor variable name');
    }
    if (c.inheritance.name !== 'B') {
        throw new Error('Error on self-reference accessor');
    }
    if (c.inheritance.inheritance.name !== 'A') {
        throw new Error('Error on double self-reference accessor');
    }
    if (c.inheritance.inheritance.inheritance) {
        throw new Error('Error infinite self-reference accessor');
    }

    resolve(c);
};
