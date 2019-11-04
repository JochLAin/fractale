
const Fractale = require('../../lib');
const { Simple, Compound, Method, Class } = require('../models');

module.exports.title = 'Stringify model';
module.exports.tutorialized = false;

module.exports.resolver = (resolve) => {
    const simple = Fractale.stringify(Simple);
    const compound = Fractale.stringify(Compound);
    const method = Fractale.stringify(Method);
    const classe = Fractale.stringify(Class);

    if (simple !== `const Simple = Fractale.create("Simple", {"mixed":mixed,"boolean":Boolean,"number":Number,"string":String,"items":[String]});`) {
        throw new Error('Error on simple stringify method');
    }
    if (compound !== `const Compound = Fractale.create("Compound", {"mixed":mixed,"boolean":Boolean,"number":Number,"string":String,"items":[String],"boards":[String],"metadata":{"key":String,"data":{"key":String,"value":mixed}},"collections":[{"key":String,"value":String}]});`) {
        throw new Error('Error on compound stringify method');
    }
    if (method !== `const Variable = Fractale.create("Variable", {"name":String,"value":mixed,"static":Boolean,"scope":{"${Fractale.TYPE_KEY}":String,"${Fractale.OPTIONS_KEY}":{"values":["private","protected","public"]}}});\n\nconst Method = Fractale.create("Method", {"signature":{"name":String,"properties":[Variable]},"body":String});`) {
        throw new Error('Error on variable stringify method');
    }
    if (classe !== `const Variable = Fractale.create("Variable", {"name":String,"value":mixed,"static":Boolean,"scope":{"${Fractale.TYPE_KEY}":String,"${Fractale.OPTIONS_KEY}":{"values":["private","protected","public"]}}});\n\nconst Method = Fractale.create("Method", {"signature":{"name":String,"properties":[Variable]},"body":String});\n\nconst Class = Fractale.create("Class", {"name":String,"inheritance":Fractale.SELF,"variables":Variable,"methods":[Method]});`) {
        throw new Error('Error on class stringify method');
    }

    resolve();
};
