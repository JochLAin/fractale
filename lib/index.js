const CONSTANTS = require('./constants');
const factory = require('./factory');
const library = require('./library');
const memory = require('./memory');
const options = require('./options');
const Model = require('./model/base');
const models = require('./model');

/**
 * Module endpoint
 * @module Fractale
 *
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */

/**
 * Keyword used for self-referenced model
 * @param {string} SELF
 */
module.exports.SELF = CONSTANTS.SELF;

/**
 * Factory that create models
 * @param {Factory} factory
 */
module.exports.factory = factory;

/**
 * Library that register models
 * @param {Library} library
 */
module.exports.library = library;

/**
 * Memory that register model instances
 * @param {Memory} memory
 */
module.exports.memory = memory;

/**
 * Proxy to Factory createModel method
 * @method
 * @see Factory
 */
module.exports.create = (...args) => {
    return factory.createModel.call(factory, ...args);
};

/**
 * Proxy to Library get method
 * @method
 * @see Library
 */
module.exports.get = (...args) => {
    return library.get.call(library, ...args);
};

/**
 * Proxy to Option set method
 * @method
 * @see Option
 */
module.exports.setOption = (...args) => {
    return options.set.call(options, ...args);
};

/**
 * Proxy to Option get method
 * @method
 * @see Option
 */
module.exports.getOption = (...args) => {
    return options.get.call(options, ...args);
};

/**
 * Set the Model base class
 * @method
 */
module.exports.setModel = (...args) => {
    return models.set.call(models, ...args);
};

/**
 * Set the Model base class
 * @method
 * @see Model
 */
module.exports.getModel = (...args) => {
    return models.get.call(models, ...args);
};

/**
 * Proxy to async Library get model
 * @method
 * @see Library
 */
module.exports.from = (name) => {
    return () => this.get(name);
};

/**
 * Proxy to Factory validate method
 * @method
 * @see Factory
 */
module.exports.validate = (...args) => {
    return factory.constructor.validate.call(factory, ...args);
};

/**
 * Helper to create type with options
 * @method
 * @param {undefined|Boolean|Number|String|Date|Model|Array|Object} type - Property type
 * @param {Object} options - Options pass to type
 */
module.exports.with = (type, options) => {
    return { [CONSTANTS.TYPE_KEY]: type, [CONSTANTS.OPTIONS_KEY]: options };
};

/**
 * Stringify a model
 * @method
 */
module.exports.stringify = (model, options = {}) => {
    const { space, dependencies } = options;
    if (!dependencies) return Model.stringify(model, space);

    const deps = Model.getDependencies(model);
    return [].concat(Model.stringify(model, space), Object.values(deps).reverse().map(model => Model.stringify(model, space))).reverse().join("\n\n");
};
