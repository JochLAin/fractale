const CONSTANTS = require('../constants');
const models = require('../model');
const _ = require('../utils');
const ArrayPropertyDefiner = require('./array');
const BooleanPropertyDefiner = require('./boolean');
const DatePropertyDefiner = require('./date');
const MixedPropertyDefiner = require('./mixed');
const ModelPropertyDefiner = require('./model');
const NumberPropertyDefiner = require('./number');
const StringPropertyDefiner = require('./string');

/**
 * Define properties from a schema
 * @param {Model} instance - object where define schema
 * @param {Schema} schema - schema to define
 * @param {Object} params - parameters value for schema
 */
module.exports.define = (instance, schema, params) => {
    schema.fields.forEach((field) => {
        const definer = module.exports.get(instance, field);
        definer.set(params[field.key]);
        definer.define();
    });
};

/**
 * Get the correct property definer by type
 * @param {Model} instance - object where define schema
 * @param {Field} field
 * @param {Boolean} compound
 * @returns MixedPropertyDefiner
 */
module.exports.get = (instance, field, compound = false) => {
    const closure = (type) => {
        switch (type) {
            case CONSTANTS.FIELD_TYPE_MIXED:
                return MixedPropertyDefiner;
            case CONSTANTS.FIELD_TYPE_BOOLEAN:
                return BooleanPropertyDefiner;
            case CONSTANTS.FIELD_TYPE_NUMBER:
                return NumberPropertyDefiner;
            case CONSTANTS.FIELD_TYPE_STRING:
                return StringPropertyDefiner;
            case CONSTANTS.FIELD_TYPE_DATE:
                return DatePropertyDefiner;
            case CONSTANTS.FIELD_TYPE_MODEL:
                return ModelPropertyDefiner;
            case CONSTANTS.FIELD_TYPE_ARRAY:
                return ArrayPropertyDefiner;
            case CONSTANTS.FIELD_TYPE_CALLBACK:
                field.schema.parse(field, field.value());
                return closure(field.type);
            default:
                return MixedPropertyDefiner;
        }
    };

    const PropertyDefiner = closure(field.type);
    return new PropertyDefiner(instance, field, compound);
};

module.exports.serialize = (instance, populate = true, depth = 512) => {
    const Model = models.get();
    const single = (value, key, type) => {
        if (!value) return value;
        if (!(value instanceof Model)) return value;
        if (depth === 0) return value.uuid;
        switch (typeof populate) {
            case 'function':
                return populate(value, key, type);
            case 'string':
            case 'boolean': default:
                if (!populate) return value.uuid;
                return value.serialize(populate, depth - 1);
        }
    };

    return instance.constructor.schema.values.reduce((accu, field) => {
        const value = instance.props[field.key];
        if (!value) return accu;
        if (!Array.isArray(field.type)) {
            return Object.assign({}, accu, {
                [field.key]: single(instance.props[field.key], field.key, field.type)
            });
        } else if (!populate) {
            return Object.assign({}, accu, {
                [field.key]: instance.props[field.key].toArray()
            });
        } else {
            return Object.assign({}, accu, {
                [field.key]: instance.props[field.key].map(value => single(value, field.key, field.subfield.type))
            });
        }
    }, { uuid: instance.uuid });
};

module.exports.deserialize = (instance, props) => {
    if (props.uuid) instance._uuid = props.uuid;
    for (const key in props) {
        if (props.hasOwnProperty(key)) {
            if (instance.constructor.schema.keys.includes(key)) {
                instance.props[key] = props[key];
            }
        }
    }
};
