const _ = require('../utils');
const Fractale = require('../../lib');
const { Simple, Compound, Method, Class } = require('../models');

module.exports.title = 'Stringify test';
module.exports.name = 'stringify-test';
module.exports.tutorialized = false;

module.exports.resolver = (resolve) => {
    _.test(Fractale.stringify(Simple), `const Simple = Fractale.create("Simple", {mixed:undefined,boolean:Boolean,number:Number,string:String,date:Date});`, 'Error on simple stringify method');
    _.test(Fractale.stringify(Compound), `const Compound = Fractale.create("Compound", Simple, {boards:[String],metadata:{key:String,data:{key:String,value:undefined}},collections:[{key:String,value:String}]});`, 'Error on simple stringify method');
    _.test(Fractale.stringify(Method), `const Method = Fractale.create("Method", {signature:{name:String,variables:[Variable]},body:String});`, 'Error on simple stringify method');
    _.test(Fractale.stringify(Class, { dependencies: true }), `const Variable = Fractale.create("Variable", {name:String,value:undefined,static:Boolean,scope:String});\n\nconst Method = Fractale.create("Method", {signature:{name:String,variables:[Variable]},body:String});\n\nconst Class = Fractale.create("Class", {uses:[Fractale.SELF],name:String,inheritance:Fractale.SELF,properties:[Variable],methods:[Method]});`, 'Error on simple stringify method');

    resolve();
};
