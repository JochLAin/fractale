
const BasicModel = require('../index');
const ArrayPropertyDefiner = require('./array');
const BasicPropertyDefiner = require('./basic');
const ModelPropertyDefiner = require('./model');
const ObjectPropertyDefiner = require('./object');
const SimplePropertyDefiner = require('./simple');
const { SELF } = require('../constants');

module.exports.get = (instance, key, type, options) => {
    if (type === null || ['undefined'].includes(typeof type) || type === undefined) {
        return new BasicPropertyDefiner(instance, key, type, options);
    }

    if (['object'].includes(typeof type) || type === Object) {
        if (Array.isArray(type)) {
            return new ArrayPropertyDefiner(instance, key, type, options);
        }

        // Object style
        if (type.__type) {
            // Deeper options
            if (type.__options) {
                return module.exports.get(instance, key, type.__type, type.__options);
            }
            return module.exports.get(instance, key, type.__type, options);
        } else {
            const name = `${instance.constructor.name}_${key.toPascalCase()}`;
            const encyclopedia = require('../library').get(name);
            const model = encyclopedia ? encyclopedia.model : require('../factory').create(name, type);
            return module.exports.get(instance, key, model, options);
            // return new ObjectPropertyDefiner(instance, key, type, options);
        }
    }

    if (['boolean'].includes(typeof type) || type === Boolean) {
        return new SimplePropertyDefiner(instance, key, type, options, 'boolean', Boolean);
    }

    if (['number'].includes(typeof type) || type === Number) {
        return new SimplePropertyDefiner(instance, key, type, options, 'number', Number);
    }

    if (['string'].includes(typeof type) || type === String) {
        if (type === SELF) {
            return new ModelPropertyDefiner(instance, key, instance.constructor, options);
        }
        return new SimplePropertyDefiner(instance, key, type, options, 'string', String);
    }

    if (['function'].includes(typeof type) && type.prototype instanceof BasicModel) {
        return new ModelPropertyDefiner(instance, key, type, options);
    }

    return new BasicPropertyDefiner(instance, key, type, options);
};

String.prototype.toCamelCase = function () {
    return this
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index == 0 ? word.toLowerCase() : word.toUpperCase())
        .replace(/\s+/g, '')
    ;
};

String.prototype.toPascalCase = function () {
    return this
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
        .replace(/\s+/g, '')
    ;
};
