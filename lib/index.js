const factory = require('./factory');
const helpers = require('./helpers');
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
 * Fractale color shortcut
 * @param {Color} Color
 */
module.exports.Color = helpers.Color;

/**
 * Keyword used for self-referenced model
 * @param {String} SELF
 */
module.exports.SELF = 'ƒ_self';

/**
 * Factory that create models
 * @param {Factory} factory
 */
module.exports.factory = factory;

/**
 * Fractale helpers
 * @param {Object} helpers
 * @see helpers
 */
module.exports.helpers = helpers;

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
    const entity = library.get.call(library, ...args);
    if (!entity) return entity;
    return entity.proxy;
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
 * Proxy to async model type
 * @method
 */
module.exports.from = (name) => {
    return { ƒ_from: name };
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
    return { ƒ_type: type, ƒ_options: options };
};

/**
 * Stringify a model
 * @method
 */
module.exports.stringify = (model, options = {}) => {
    const { space, dependencies } = options;
    if (!dependencies) return model.stringify(space);

    const deps = model.getDependencies();
    return [].concat(model.stringify(space), Object.values(deps).reverse().map(model => model.stringify(space))).reverse().join("\n\n");
};
