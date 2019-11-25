const { Class, Program } = require('../models');
module.exports.models = [Class];

module.exports.title = 'Deep model';
module.exports.name = 'deep-model';
module.exports.tutorialized = false;

module.exports.resolver = (resolve) => {
    const a = new Class({
        name: 'A',
        properties: [{ name: 'a', value: 0 }],
        methods: [
            { signature: { name: 'getA' }},
            { signature: { name: 'setA', variables: [{ name: 'a' }] }}
        ]
    });

    const b = new Class({
        name: 'B',
        properties: [
            { name: 'b', value: 0 },
        ],
        methods: [
            { signature: { name: 'getB' }},
            { signature: { name: 'setB', variables: [{ name: 'b' }] }}
        ]
    });

    const c = new Class({
        uses: [a, b],
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

    const program = new Program({
        classes: [a,b,c],
    });

    if (a.properties[0].name !== 'a') {
        throw new Error('Error on deep accessor variable name');
    }
    if (c.uses[0].name !== 'A') {
        throw new Error('Error on deep accessor with brace');
    }
    if (c.inheritance.name !== 'B') {
        throw new Error('Error on deep accessor');
    }

    resolve(program);
};
