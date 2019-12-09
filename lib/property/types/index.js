'use strict';

class IncorrectTypeError extends Error {
    constructor(type, expected, received) {
        super();
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, IncorrectTypeError);
        }
        this.name = 'IncorrectTypeError';
        this.type = type;
        this.expected = expected;
        this.received = received;

        const key = `${type.schema.classname}.${type.options.forked_key || type.key}`;
        const value = received && received.ƒ_entity ? `'${received.constructor.name}'` : `'${typeof received}'`;
        this.message = `Expecting "${key}" to be ${this.expected} but get ${value}`;
    }
}

/**
 * Define property on an instance of Model
 *
 * @class PropertyType
 * @param {Schema} schema
 * @param {String} key
 * @param {*} input
 * @param {Object} options
 *
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
module.exports = class ƒ_type {
    constructor(schema, key, input, options) {
        this.schema = schema;
        this.key = key;
        this.input = input;
        this.options = options;
    }

    static get IncorrectTypeError() {
        return IncorrectTypeError;
    }

    fork(key) {
        return new this.constructor(
            this.schema,
            this.key,
            this.input,
            Object.assign({}, this.options, {
                forked_key: key
            })
        );
    }

    is(type) {
        const _typeof = typeof type;
        if (_typeof === 'string') {
            return this.constructor.name === type;
        } else if (_typeof === 'function') {
            return this.constructor.name === type.name;
        } else if (_typeof === 'object') {
            return type instanceof this.constructor;
        }
    }

    match(key) {
        if (this.key instanceof RegExp) {
            if (key instanceof RegExp) key = key.toString();
            if (this.key.toString() === key) return true;
            return this.key.test(key);
        }
        return this.key === key;
    }

    /**
     * Expose the value
     *
     * @param {Property} property
     * @returns {*}
     */
    expose(property) {
        return property.value || undefined;
    }

    /**
     * Flatten the value
     *
     * @param {*} value
     * @returns {*}
     */
    flatten(value) {
        return value || undefined;
    }

    /**
     * Format the value
     *
     * @param {*} next
     * @param {*} current
     * @returns {*}
     */
    format(next, current) {
        this.validate(next);
        return this.normalize(next, current);
    }

    /**
     * Normalize the value
     *
     * @param {*} next
     * @param {*} current
     * @returns {*}
     */
    normalize(next, current) {
        return this.flatten(next);
    }

    /**
     * Serialize the value
     *
     * @param {*} value
     * @param {Object} options
     * @returns {*}
     */
    serialize(value, options) {
        return value || undefined;
    }

    /**
     * Validate if value correspond on property type
     *
     * @param value
     */
    validate(value) {
        if (value === undefined) return;
        if (!this.options.validator) return;

        if (typeof this.options.validator === 'function') {
            if (!this.options.validator(value, this.value)) {
                throw new Error(`Invalid value, got ${JSON.stringify(value)}`);
            }
        } else if (typeof this.options.validator === 'object') {
            if (this.options.validator.hasOwnProperty('eq')) {
                if (value !== this.options.validator.eq) {
                    throw new Error(`Expected value equal to ${JSON.stringify(this.options.validator.eq)}, got ${JSON.stringify(value)}`);
                }
            }
            if (this.options.validator.hasOwnProperty('neq')) {
                if (value === this.options.validator.neq) {
                    throw new Error(`Expected value different of ${JSON.stringify(this.options.validator.neq)}, got ${JSON.stringify(value)}`);
                }
            }
            if (this.options.validator.hasOwnProperty('in')) {
                if (!Array.isArray(this.options.validator.in)) {
                    throw new Error(`Expected array as value for in this.options.validator, got ${typeof this.options.validator.in}`);
                }
                if (!this.options.validator.in.includes(value)) {
                    throw new Error(`Expected value in ${JSON.stringify(this.options.validator.in)}, got ${JSON.stringify(value)}`);
                }
            }
            if (this.options.validator.hasOwnProperty('notin')) {
                if (!Array.isArray(this.options.validator.notin)) {
                    throw new Error(`Expected array as value for notin this.options.validator, got ${typeof this.options.validator.notin}`);
                }
                if (this.options.validator.notin.includes(value)) {
                    throw new Error(`Expected value not in ${JSON.stringify(this.options.validator.notin)}, got ${JSON.stringify(value)}`);
                }
            }
        }
    }

    createIncorrectTypeError(expected, received, type) {
        if (!type) type = this;
        return new IncorrectTypeError(type, expected, received);
    };

    toJSON() {
        return 'undefined';
    }
};

const types = [
    require('./mixed'),
    require('./boolean'),
    require('./number'),
    require('./bigint'),
    require('./regexp'),
    require('./string'),
    require('./date'),
    require('./model'),
    require('./array'),
    require('./array/buffer'),
    require('./array/int8'),
    require('./array/int8'),
    require('./array/uint8'),
    require('./array/uint8_clamped'),
    require('./array/int16'),
    require('./array/uint16'),
    require('./array/int32'),
    require('./array/uint32'),
    require('./array/float32'),
    require('./array/float64'),
    require('./array/bigint64'),
    require('./array/biguint64'),
].sort((a, b) => {
    return b.priority - a.priority;
});

module.exports.get = () => types;
module.exports.add = (type) => {
    const _typeof = typeof type;
    if (_typeof !== 'function') {
        throw new Error(`Expected class got ${typeof type}(${type})`);
    }
    if (!(type instanceof ƒ_type)) {
        throw new Error(`The type ${type.name} doesn't extend the base property type`);
    }
    if (!type.evaluate) {
        throw new Error(`The type ${type.name} doesn't have an evaluate static method`);
    }
    if (!type.priority) {
        Object.defineProperty(type, 'priority', { value: 0 });
    }
    types.push(type);
    types.sort((a, b) => b.priority - a.priority);
};
