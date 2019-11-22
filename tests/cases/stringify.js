const { DetailedError } = require('../error');
const Fractale = require('../../lib');
const { Simple, Compound, Method, Class } = require('../models');

module.exports.title = 'Stringify test';
module.exports.name = 'stringify-test';
module.exports.tutorialized = false;

module.exports.resolver = (resolve) => {
    const simple = Fractale.stringify(Simple);
    const SIMPLE = `const Simple = Fractale.create("Simple", {mixed:undefined,boolean:Boolean,number:Number,string:String,date:Date});`;
    if (simple !== SIMPLE) {
        throw new DetailedError('Error on simple stringify method', `Expected: ${SIMPLE}\nGot: ${simple}`);
    }

    const compound = Fractale.stringify(Compound);
    const COMPOUND = `const Compound = Fractale.create("Compound", Simple, {boards:[String],metadata:{key:String,data:{key:String,value:undefined}},collections:[{key:String,value:String}]});`;
    if (compound !== COMPOUND) {
        throw new DetailedError('Error on compound stringify method', `Expected: ${COMPOUND}\nGot: ${compound}`);
    }

    const method = Fractale.stringify(Method);
    const METHOD = `const Method = Fractale.create("Method", {signature:{name:String,variables:[Variable]},body:String});`;
    if (method !== METHOD) {
        throw new DetailedError('Error on method stringify method', `Expected: ${METHOD}\nGot: ${method}`);
    }

    const classe = Fractale.stringify(Class, { dependencies: true });
    const CLASS = `const Variable = Fractale.create("Variable", {name:String,value:undefined,static:Boolean,scope:String});\n\nconst Method = Fractale.create("Method", {signature:{name:String,variables:[Variable]},body:String});\n\nconst Class = Fractale.create("Class", {uses:[Fractale.SELF],name:String,inheritance:Fractale.SELF,properties:[Variable],methods:[Method]});`;
    if (classe !== CLASS) {
        throw new DetailedError('Error on class stringify method', `Expected: ${CLASS}\nGot: ${classe}`);
    }

    resolve();
};
