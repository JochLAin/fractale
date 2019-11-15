const { DetailedError } = require('../error');
const Fractale = require('../../lib');
const { TYPE_KEY, OPTIONS_KEY } = require('../../lib/constants');
const { Simple, Compound, Method, Class } = require('../models');

module.exports.title = 'Stringify model';
module.exports.tutorialized = false;

module.exports.resolver = (resolve) => {

    const simple = Fractale.stringify(Simple);
    const SIMPLE = `const Simple = Fractale.create("Simple", {mixed:undefined,boolean:Boolean,number:Number,string:String});`;
    if (simple !== SIMPLE) {
        throw new DetailedError('Error on simple stringify method', `Expected: ${SIMPLE}\nGot: ${simple}`);
    }

    const compound = Fractale.stringify(Compound);
    const COMPOUND = `const Compound = Fractale.create("Compound", Simple, {boards:[String],metadata:{key:String,data:{key:String,value:undefined}},collections:[{key:String,value:String}]});`;
    if (compound !== COMPOUND) {
        console.log(Fractale.stringify(Compound, null, 4));
        throw new DetailedError('Error on compound stringify method', `Expected: ${COMPOUND}\nGot: ${compound}`);
    }

    const method = Fractale.stringify(Method);
    const METHOD = `const Method = Fractale.create("Method", {signature:{name:String,variables:[Variable]},body:String});`;
    if (method !== METHOD) {
        throw new DetailedError('Error on method stringify method', `Expected: ${METHOD}\nGot: ${method}`);
    }

    const classe = Fractale.stringify(Class);
    const CLASS = `const Class = Fractale.create("Class", {uses:[Fractale.SELF],name:String,inheritance:Fractale.SELF,properties:[Variable],methods:[Method]});`;
    if (classe !== CLASS) {
        throw new DetailedError('Error on class stringify method', `Expected: ${CLASS}\nGot: ${classe}`);
    }

    resolve();
};
