
const Model = require('../model');
const ArrayPropertyDefiner = require('./array');
const MixedPropertyDefiner = require('./mixed');
const ModelPropertyDefiner = require('./model');
const SimplePropertyDefiner = require('./simple');
const { SELF } = require('../constants');

// Get the correct property definer by type
module.exports.get = (instance, key, type, options) => {
    // Mixed style
    if (type === null || ['undefined'].includes(typeof type) || type === undefined) {
        return new MixedPropertyDefiner(instance, key, type, options);
    }

    // Boolean style
    if (['boolean'].includes(typeof type) || type === Boolean) {
        return new SimplePropertyDefiner(instance, key, type, options, 'boolean', Boolean);
    }

    // Number style
    if (['number'].includes(typeof type) || type === Number) {
        return new SimplePropertyDefiner(instance, key, type, options, 'number', Number);
    }

    // String style
    if (['string'].includes(typeof type) || type === String) {
        if (type === SELF) {
            return new ModelPropertyDefiner(instance, key, instance.constructor, options);
        }
        return new SimplePropertyDefiner(instance, key, type, options, 'string', String);
    }

    // Model style
    if (['function'].includes(typeof type) && type.prototype instanceof Model) {
        return new ModelPropertyDefiner(instance, key, type, options);
    }

    if (['object'].includes(typeof type) || type === Object) {
        // Array style
        if (Array.isArray(type)) {
            return new ArrayPropertyDefiner(instance, key, type, options);
        }

        if (type.__type) {
            // Options style
            if (type.__options) {
                return module.exports.get(instance, key, type.__type, type.__options);
            }
            return module.exports.get(instance, key, type.__type, options);
        } else {
            /* Auto-generate inter-model class with PascalCase name */
            const name = `${instance.constructor.name}_${key.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, '')}`;
            const encyclopedia = require('../library').get(name);
            const model = encyclopedia ? encyclopedia.model : require('../factory').create(name, type, null, true);

            // Object style
            return module.exports.get(instance, key, model, options);
        }
    }

    // Mixed style
    return new MixedPropertyDefiner(instance, key, type, options);
};
