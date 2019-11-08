const Model = require('../model');
const ArrayPropertyDefiner = require('./array');
const MixedPropertyDefiner = require('./mixed');
const ModelPropertyDefiner = require('./model');
const SimplePropertyDefiner = require('./simple');
const { SELF, TYPE_KEY, OPTIONS_KEY } = require('../constants');

/**
 * Define properties from a schema
 * @param {ModelClass} instance - instance which have properties
 * @param {Object} schema - schema to define
 * @param {Object} params - parameters value for schema
 * @returns {ModelClass} instance
 */
module.exports.define = (instance, schema, params) => {
    for (let key in schema) {
        if (schema.hasOwnProperty(key)) {
            if (key === 'uuid') {
                throw new Error('Field "uuid" is automatically set');
            }

            const definer = module.exports.get(instance, key, schema[key]);
            definer.assign(instance, key, schema[key]);
            definer.define(instance, key, schema[key]);
            if (params[key] !== undefined && params[key] !== null) {
                instance.props[`_${key}`] = definer.normalize(definer.check(params[key]));
            }
        }
    }
};

/**
 * Get the correct property definer by type
 * @param {ModelClass} instance
 * @param {String} key
 * @param {undefined|null|Boolean|Number|String|ModelClass|Array|Object} type
 * @param {Object} options - Options passed on property definer
 * @returns MixedPropertyDefiner
 */
module.exports.get = (instance, key, type, options = {}) => {
    const _typeof = typeof type;
    // Mixed style
    if (type === null || _typeof === 'undefined' || type === undefined) {
        return new MixedPropertyDefiner(instance, key, type, options);
    }

    // Boolean style
    if (_typeof === 'boolean' || type === Boolean) {
        return new SimplePropertyDefiner(instance, key, type, options, 'boolean', Boolean);
    }

    // Number style
    if (_typeof === 'number' || type === Number) {
        return new SimplePropertyDefiner(instance, key, type, options, 'number', Number);
    }

    // String style
    if (_typeof === 'string' || type === String) {
        if (type === SELF) {
            return new ModelPropertyDefiner(instance, key, instance.constructor, options);
        }
        return new SimplePropertyDefiner(instance, key, type, options, 'string', String);
    }

    // Model style
    if (_typeof === 'function' && type.prototype instanceof Model) {
        return new ModelPropertyDefiner(instance, key, type, options);
    }

    if (_typeof === 'object' || type === Object) {
        if (Array.isArray(type)) {
            // Array style
            return new ArrayPropertyDefiner(instance, key, type, options);
        }

        if (type[TYPE_KEY]) {
            // Options style
            if (type[OPTIONS_KEY]) {
                return module.exports.get(instance, key, type[TYPE_KEY], type[OPTIONS_KEY]);
            }
            return module.exports.get(instance, key, type[TYPE_KEY], options);
        } else {
            // Object style
            /* Auto-generate inter-model class with PascalCase name */
            const subname = `${instance.constructor.name}_${toPascalCase(key)}`;
            const subentity = require('../library').get(subname);
            const entity = subentity ? subentity : require('../factory').create(subname, type, { virtual: true });

            return module.exports.get(instance, key, entity, options);
        }
    }

    // Mixed style
    return new MixedPropertyDefiner(instance, key, type, options);
};

module.exports.serialize = (instance, schema, populate = true, depth = 512) => {
    const single = (value, key, schema) => {
        if (!value) return value;
        if (value instanceof Model) {
            if (depth === 0) return value.uuid;
            switch (typeof populate) {
                case 'function':
                    return populate(value, key, schema);
                case 'string': case 'boolean':
                default:
                    if (!populate && !value.constructor.virtual) {
                        return value.uuid;
                    }
                    return value.serialize(populate, --depth);
            }
        }
        return value;
    };

    let serialized = { uuid: instance.uuid };
    for (let key in schema) {
        if (schema.hasOwnProperty(key)) {
            if (Array.isArray(schema[key])) {
                serialized[key] = instance.props[key].map(value => single(value, key, schema[key][0]));
            } else {
                serialized[key] = single(instance.props[key], key, schema[key]);
            }
        }
    }

    return serialized;
};

module.exports.deserialize = (instance, schema, props) => {
    if (props.uuid) instance._uuid = props.uuid;
    for (let key in schema) {
        if (schema.hasOwnProperty(key) && props[key]) {
            instance.props[key] = props[key];
        }
    }
};

const toPascalCase = (text) => text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, '');
