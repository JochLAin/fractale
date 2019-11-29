const Fractale = require('../../lib');
const _ = require('../utils');

module.exports.title = 'Deep model';
module.exports.name = 'deep';
module.exports.tutorialized = false;

module.exports.resolver = (resolve) => {
    const { Class, Program } = module.exports.get();

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

    const program = new Program({ classes: [a, b, c] });

    _.test(a.properties[0].name, 'a', 'Error on deep accessor variable name');
    _.test(c.uses[0].name, 'A', 'Error on deep accessor with brace');
    _.test(c.inheritance.name, 'B', 'Error on deep accessor');

    resolve(program);
};

module.exports.create = () => {
    const Variable = Fractale.create('Deep_Variable', {
        name: String,
        value: null,
        static: Boolean,
        scope: Fractale.with(String, { values: ['private', 'protected', 'public'] })
    });

    const Method = Fractale.create('Deep_Method', {
        signature: {
            name: String,
            variables: [Variable]
        },
        body: String,
    });

    const Class = Fractale.create('Deep_Class', {
        uses: [Fractale.SELF],
        name: String,
        inheritance: Fractale.SELF,
        properties: [Variable],
        methods: [Method]
    });

    const Program = Fractale.create('Deep_Program', {
        classes: [Class],
    });

    return { Class, Method, Program, Variable };
};

let models;
module.exports.get = () => {
    if (models) return models;
    return models = module.exports.create();
};
