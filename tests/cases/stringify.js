const Fractale = require('../../lib');
const _ = require('../utils');

module.exports.title = 'Stringify test';
module.exports.name = 'stringify';
module.exports.tutorialized = false;

module.exports.resolver = (resolve) => {
    const { Simple, Compound, Method } = module.exports.get();
    // _.test(Fractale.stringify(Simple), `const Stringify_Simple = Fractale.create("Stringify_Simple", {mixed:undefined,boolean:Boolean,number:Number,string:String,date:Date});`, 'Error on simple stringify method');
    // _.test(Fractale.stringify(Compound), `const Stringify_Compound = Fractale.create("Stringify_Compound", Stringify_Simple, {boards:[String],metadata:{key:String,data:{key:String,value:undefined}},collections:[{key:String,value:String}]});`, 'Error on simple stringify method');
    // _.test(Fractale.stringify(Method), `const Stringify_Method = Fractale.create("Stringify_Method", {signature:{name:String,variables:[Stringify_Variable]},body:String});`, 'Error on simple stringify method');

    resolve();
};

module.exports.create = () => {
    const Simple = Fractale.create('Stringify_Simple', {
        mixed: undefined,
        boolean: Boolean,
        number: Number,
        string: String,
        date: Date,
    });

    const Compound = Fractale.create('Stringify_Compound', Simple, {
        boards: [String],
        metadata: { key: String, data: { key: String, value: null } },
        collections: [{ key: String, value: String }],
    });

    const Variable = Fractale.create('Stringify_Variable', {
        name: String,
        value: null,
        static: Boolean,
        scope: Fractale.with(String, { values: ['private', 'protected', 'public'] })
    });

    const Method = Fractale.create('Stringify_Method', {
        signature: {
            name: String,
            variables: [Variable]
        },
        body: String,
    });

    return { Simple, Compound, Variable, Method };
};

let models;
module.exports.get = () => {
    if (models) return models;
    return models = module.exports.create();
};
