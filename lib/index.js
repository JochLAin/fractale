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
 * @param {Class} Color - The color class
 */
module.exports.Color = helpers.Color;

/**
 * Keyword used for self-referenced model
 * @param {String} SELF - Value for self reference
 */
module.exports.SELF = 'ƒ_self';

/**
 * Factory that create models
 * @param {Factory} factory - Fractale factory
 * @see Factory
 */
module.exports.factory = factory;

/**
 * Fractale helpers
 * @param {Object} helpers - Object containing helpers
 * @see helpers
 */
module.exports.helpers = helpers;

/**
 * Library that register models
 * @param {Library} library - Fractale library for models
 */
module.exports.library = library;

/**
 * Memory that register model instances
 * @param {Memory} memory - Fractale memory for entities
 */
module.exports.memory = memory;

/**
 * Proxy to Factory createModel method
 * @method
 * @see Factory#createModel
 */
module.exports.create = (...args) => {
    return factory.createModel.call(factory, ...args);
};

/**
 * Proxy to Library get method
 * @method
 * @see Library#get
 */
module.exports.get = (...args) => {
    const entity = library.get.call(library, ...args);
    if (!entity) return entity;
    return entity.proxy;
};

/**
 * Proxy to Option set method
 * @method
 * @see Option#set
 */
module.exports.setOption = (...args) => {
    return options.set.call(options, ...args);
};

/**
 * Proxy to Option get method
 * @method
 * @see Option#get
 */
module.exports.getOption = (...args) => {
    return options.get.call(options, ...args);
};

/**
 * Set the Model base class
 * @method
 * @param {Model} _Model - The model class to use
 */
module.exports.setModel = (...args) => {
    return models.set.call(models, ...args);
};

/**
 * Set the Model base class
 * @method
 * @return {Model}
 * @see Model
 */
module.exports.getModel = (...args) => {
    return models.get.call(models, ...args);
};

/**
 * Proxy to async model type
 * @method
 * @param {Model|String} name - Model's name or Model itself
 */
module.exports.from = (name) => {
    return { ƒ_from: name };
};

/**
 * Proxy to Factory validate method
 * @method
 * @see Factory#validate
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
 * @param {Model} model - Model to stringify
 * @param {Object} options
 * @param {Number} options.space - Number of space to use for JSON.stringify
 * @param {Boolean} options.dependencies - Define if model dependencies must be stringify with
 */
module.exports.stringify = (model, options = {}) => {
    const { space, dependencies } = options;
    if (!dependencies) return model.stringify(space);

    const deps = model.getDependencies();
    return [].concat(model.stringify(space), Object.values(deps).reverse().map(model => model.stringify(space))).reverse().join("\n\n");
};
