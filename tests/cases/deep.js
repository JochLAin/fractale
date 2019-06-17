
const { Class, Program } = require('../models');
module.exports.models = [Class];

module.exports.title = 'Deep model';
module.exports.tutorialized = true;

module.exports.resolver = (resolve) => {
    const a = new Class({
        name: 'A',
        variables: [
            {name: 'a', value: 0},
        ],
        methods: [
            {signature: {name: 'getA'}},
            {signature: {name: 'setA', properties: [{name: 'a'}]}}
        ]
    });

    const b = new Class({
        name: 'B',
        variables: [
            {name: 'b', value: 0},
        ],
        methods: [
            {signature: {name: 'getB'}},
            {signature: {name: 'setB', properties: [{name: 'b'}]}}
        ]
    });

    const c = new Class({
        name: 'C',
        inheritance: b,
        variables: [
            {name: 'c', value: 0},
        ],
        methods: [
            {signature: {name: 'getC'}},
            {signature: {name: 'setC', properties: [{name: 'c'}]}}
        ]
    });

    const program = new Program({
        uses: [a, b],
        class: c
    });

    if (program.uses[0].name !== 'A') {
        throw new Error('Error on deep accessor with brace');
    }
    if (program.props.use(1).name !== 'B') {
        throw new Error('Error on deep accessor with function singular');
    }
    if (program.class.inheritance.name !== 'B') {
        throw new Error('Error on deep accessor');
    }

    if (!program.serialize()) {
        throw new Error('Error on deep serialize');
    }

    resolve(program.serialize());
};
