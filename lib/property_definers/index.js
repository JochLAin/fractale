
const Model = require('../model');
const ArrayPropertyDefiner = require('./array');
const MixedPropertyDefiner = require('./mixed');
const ModelPropertyDefiner = require('./model');
const SimplePropertyDefiner = require('./simple');
const { SELF, TYPE_KEY, OPTIONS_KEY } = require('../constants');

/**
 * Get the correct property definer by type
 * @param {ModelClass} instance
 * @param {String} key
 * @param {undefined|null|Boolean|Number|String|ModelClass|Array|Object} type
 * @param {Object} options - Options passed on property definer
 * @returns MixedPropertyDefiner
 */
module.exports.get = (instance, name, key, type, options = {}) => {
    const _typeof = typeof type;
    // Mixed style
    if (type === null || _typeof === 'undefined' || type === undefined) {
        return new MixedPropertyDefiner(instance, name, key, type, options);
    }

    // Boolean style
    if (_typeof === 'boolean' || type === Boolean) {
        return new SimplePropertyDefiner(instance, name, key, type, options, 'boolean', Boolean);
    }

    // Number style
    if (_typeof === 'number' || type === Number) {
        return new SimplePropertyDefiner(instance, name, key, type, options, 'number', Number);
    }

    // String style
    if (_typeof === 'string' || type === String) {
        if (type === SELF) {
            return new ModelPropertyDefiner(instance, name, key, instance.constructor, options);
        }
        return new SimplePropertyDefiner(instance, name, key, type, options, 'string', String);
    }

    // Model style
    if (_typeof === 'function' && type.prototype instanceof Model) {
        return new ModelPropertyDefiner(instance, type.name, key, type, options);
    }

    if (_typeof === 'object' || type === Object) {
        if (Array.isArray(type)) {
            // Array style
            return new ArrayPropertyDefiner(instance, name, key, type, options);
        }

        if (type[TYPE_KEY]) {
            // Options style
            if (type[OPTIONS_KEY]) {
                return module.exports.get(instance, name, key, type[TYPE_KEY], type[OPTIONS_KEY]);
            }
            return module.exports.get(instance, name, key, type[TYPE_KEY], options);
        } else {
            // Object style

            const subname = `${name}_${toPascalCase(key)}`;
            /* Auto-generate inter-model class with PascalCase name */
            const encyclopedia = require('../library').get(subname);
            const entity = encyclopedia ? encyclopedia.entity : require('../factory').create(subname, type, { virtual: true });

            return module.exports.get(instance, subname, key, entity, options);
        }
    }

    // Mixed style
    return new MixedPropertyDefiner(instance, name, key, type, options);
};

const toPascalCase = (text) => text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, '');