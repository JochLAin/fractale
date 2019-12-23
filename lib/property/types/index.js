/**
 * Define property on an instance of Model
 *
 * @class PropertyType
 * @param {Schema} schema
 * @param {String} key
 * @param {*} generator
 * @param {*} input
 * @param {Object} options
 * @param {Object} options.validator
 *
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
module.exports = class ƒ_type {
    constructor(schema, key, generator, input, { validator, ...options } = {}) {
        this.schema = schema;
        this.key = key;
        this.generator = generator;
        this.options = options;
        this.ℹ_regexp = key instanceof RegExp;
        this.ƒ_regexp = this.ℹ_regexp && key.toString();
        this.validator = this.parseValidator(validator);
        try {
            if (input !== undefined && input !== this.generator) {
                this.validate(input, { subvalidate: true });
                Object.assign(this.options, { default: input });
            }
        } catch (error) {}
    }

    static get IncorrectTypeError() {
        return IncorrectTypeError;
    }

    static get ValidatorError() {
        return ValidatorError;
    }

    build(next, current, key) {
        if (!this.ℹ_regexp) return this.format(next, current);
        if (key instanceof RegExp) key = key.toString();

        if (this.ƒ_regexp === key) {
            const built = {};
            for (let idx = 0, keys = Object.keys(next), length = keys.length; idx < length; idx++) {
                Object.assign(built, {
                    [keys[idx]]: this.format(next[keys[idx]], current[keys[idx]]),
                });
            }
            return built;
        }

        if (typeof key !== 'string') return;
        const value = this.format(next, current[key]);
        return Object.assign({}, current, { [key]: value });
    }

    display(property, key) {
        if (!this.ℹ_regexp) return this.expose(property);
        if (this.ℹ_regexp) key = key.toString();

        // TODO collection of subproperty
        if (this.ƒ_regexp === key) return this.expose(property);
        if (typeof key !== 'string') return;
        return property.explode(key).get(key);
    }

    serialize(value, options) {
        if (value === undefined) return value;
        if (!this.ℹ_regexp) return this.shape(value, options);
        const serialized = {};
        for (let idx = 0, keys = Object.keys(value), length = keys.length; idx < length; idx++) {
            Object.assign(serialized, {
                [keys[idx]]: this.shape(value[keys[idx]], options)
            });
        }
        return serialized;
    }

    fork(key) {
        return new this.constructor(
            this.schema,
            key,
            this.generator,
            undefined,
            this.options
        );
    }

    sub(key) {
        return new this.constructor(
            this.schema,
            this.key,
            this.generator,
            Object.assign({}, this.options, {
                subkey: key
            })
        );
    }

    /**
     * Test if type corresponds to schema field type
     *
     * @param {*} type
     * @return {boolean}
     */
    is(type) {
        const _typeof = typeof type;
        if (_typeof === 'string') {
            return this.constructor.name === type;
        } if (_typeof === 'function') {
            return this.constructor.name === type.name;
        } if (_typeof === 'object') {
            return type instanceof this.constructor;
        }
    }

    /**
     * Test if key corresponds to schema field key
     *
     * @param {RegExp|String} key
     * @return {boolean}
     */
    match(key) {
        if (!this.ℹ_regexp) return this.key === key;
        if (this.ℹ_regexp) key = key.toString();
        if (this.ƒ_regexp === key) return true;
        if (typeof key !== 'string') return false;
        return this.key.test(key);
    }

    /**
     * Expose the value
     *
     * @param {Property} property
     * @return {*}
     */
    expose(property) {
        return property.value || undefined;
    }

    /**
     * Flatten the value
     *
     * @param {*} value
     * @return {*}
     */
    flatten(value) {
        return value || undefined;
    }

    /**
     * Format the value
     *
     * @param {*} next
     * @param {*} current
     * @return {*}
     */
    format(next, current) {
        if (this.options.transform instanceof Function) {
            next = this.options.transform(next);
        }
        this.validate(next);
        return this.normalize(next, current);
    }

    /**
     * Normalize the value
     *
     * @param {*} next
     * @param {*} current
     * @return {*}
     */
    normalize(next, current) {
        return this.flatten(next);
    }

    /**
     * Serialize the value
     *
     * @param {*} value
     * @param {Object} options
     * @return {*}
     */
    shape(value, options) {
        if (value === undefined || value === null) return;
        return value;
    }

    parseValidator(validator) {
        if (typeof validator === 'object') {
            if (Object.prototype.hasOwnProperty.call(validator, 'in')) {
                if (!Array.isArray(validator.in)) {
                    throw this.createIncorrectValidatorTypeError('in', 'array', typeof validator.in);
                }
            }
            if (Object.prototype.hasOwnProperty.call(validator, 'notin')) {
                if (!Array.isArray(validator.notin)) {
                    throw this.createIncorrectValidatorTypeError('notin', 'array', typeof validator.notin);
                }
            }
        }
        return validator;
    }

    /**
     * Validate if value correspond on property type
     *
     * @param value
     */
    validate(value) {
        if (value === undefined || value === null) {
            if (!this.options.required) return;
            throw this.createValidatorError('required', value, 'to be define');
        }
        if (!this.validator) return;

        if (typeof this.validator === 'function') {
            if (!this.validator(value)) {
                throw this.createValidatorError('custom', value, 'validated by custom function');
            }
        } else if (typeof this.validator === 'object') {
            if (Object.prototype.hasOwnProperty.call(this.validator, 'eq')) {
                if (value !== this.validator.eq) {
                    throw this.createValidatorError('eq', value, `equal to ${this.validator.eq}`);
                }
            }
            if (Object.prototype.hasOwnProperty.call(this.validator, 'neq')) {
                if (value === this.validator.neq) {
                    throw this.createValidatorError('neq', value, `different of ${this.validator.neq}`);
                }
            }
            if (Object.prototype.hasOwnProperty.call(this.validator, 'in')) {
                if (!this.validator.in.includes(value)) {
                    throw this.createValidatorError('in', value, `in [${this.validator.in.join(', ')}]`);
                }
            }
            if (Object.prototype.hasOwnProperty.call(this.validator, 'notin')) {
                if (this.validator.notin.includes(value)) {
                    throw this.createValidatorError('notin', value, `not in [${this.validator.notin.join(', ')}]`);
                }
            }
        }
    }

    createIncorrectTypeError(expected, received, type) {
        if (!type) type = this;
        return new IncorrectTypeError(type, expected, received);
    }

    createIncorrectValidatorTypeError(key, expected, received) {
        return new IncorrectValidatorTypeError(this, key, expected, received);
    }

    createValidatorError(key, value, operation) {
        return new ValidatorError(this, key, operation, value);
    }

    toBasic(replacer) {
        const value = undefined;
        if (replacer instanceof Function) return replacer(value, this);
        return value;
    }

    toJSON() {
        return 'undefined';
    }
};

/**
 * @class IncorrectTypeError
 * @extends Error
 *
 * @param {PropertyType} type - Type which throw error
 * @param {String} expected - The expected type
 * @param {*} received - The received value
 */
const IncorrectTypeError = module.exports.IncorrectTypeError = class IncorrectTypeError extends Error {
    constructor(type, expected, received) {
        super();
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, IncorrectTypeError);
        }
        this.name = 'IncorrectTypeError';
        this.type = type;
        this.expected = expected;
        this.received = received;

        const key = `${type.schema.classname}.${type.options.subkey || type.key}`;
        const value = received && received.ƒ_entity ? `'${received.constructor.name}'` : `'${typeof received}'`;
        this.message = `Expecting "${key}" to be ${this.expected} but get ${value}`;
    }
};

/**
 * @class IncorrectValidatorTypeError
 * @extends Error
 *
 * @param {PropertyType} type - Type which throw error
 * @param {String} key - Validator key
 * @param {String} expected - The expected type
 * @param {String} received - The received type
 */
const IncorrectValidatorTypeError = module.exports.IncorrectValidatorTypeError = class IncorrectValidatorTypeError extends Error {
    constructor(type, key, expected, received) {
        super();
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, IncorrectValidatorTypeError);
        }
        this.name = 'IncorrectValidatorTypeError';
        this.type = type;
        this.key = key;
        this.expected = expected;
        this.received = received;

        this.message = `Error in validator "${this.key}"`;
        if (String(this.expected).length <= 80 && String(this.received).length <= 80) {
            this.message += `\nExpected ${this.expected} for ${this.type.schema.classname}.${this.type.key}.validator.${this.key} but got ${this.received}`;
        } else {
            this.message += `\nExpected ${this.expected} for ${this.type.schema.classname}.${this.type.key}.validator.${this.key}\nBut got ${this.received}`;
        }
    }
};

/**
 * @class ValidatorError
 * @extends Error
 *
 * @param {PropertyType} type - Type which throw error
 * @param {String} key - Validator key
 * @param {String} expected - The expected type
 * @param {String} received - The received type
 */
const ValidatorError = module.exports.ValidatorError = class ValidatorError extends Error {
    constructor(type, key, expected, received) {
        super();
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidatorError);
        }
        this.name = 'ValidatorError';
        this.type = type;
        this.key = key;
        this.expected = expected;
        this.received = received;

        this.message = `Error in validator "${this.key}"`;
        if (String(this.formatted).length <= 80 && String(this.received).length <= 80) {
            this.message += `\nExpected value ${this.expected} but got ${this.received}`;
        } else {
            this.message += `\nExpected value ${this.expected}\nBut got ${this.received}`;
        }
    }
};

const types = [];
module.exports.get = () => types;
module.exports.add = (type) => {
    const _typeof = typeof type;
    if (_typeof !== 'function') {
        throw new Error(`Expected class got ${typeof type}`);
    }
    if (!(type.prototype instanceof module.exports)) {
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

module.exports.add(require('./mixed'));
module.exports.add(require('./boolean'));
module.exports.add(require('./number'));
module.exports.add(require('./bigint'));
module.exports.add(require('./regexp'));
module.exports.add(require('./string'));
module.exports.add(require('./date'));
module.exports.add(require('./model'));
module.exports.add(require('./array'));
module.exports.add(require('./color'));
module.exports.add(require('./array/buffer'));
module.exports.add(require('./array/int8'));
module.exports.add(require('./array/int8'));
module.exports.add(require('./array/uint8'));
module.exports.add(require('./array/uint8_clamped'));
module.exports.add(require('./array/int16'));
module.exports.add(require('./array/uint16'));
module.exports.add(require('./array/int32'));
module.exports.add(require('./array/uint32'));
module.exports.add(require('./array/float32'));
module.exports.add(require('./array/float64'));
module.exports.add(require('./array/bigint64'));
module.exports.add(require('./array/biguint64'));
