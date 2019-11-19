const models = require('../model');

/**
 * Define property on an instance of Model
 * @class
 * @param {Model} instance
 * @param {Field} field
 * @param {Boolean} compound
 */
class MixedPropertyDefiner {
    constructor(instance, field, compound) {
        this.instance = instance;
        this.field = field;
        this.compound = compound;
        this.index = undefined;
        this.value = undefined;
    }

    /**
     * Prepare property default value
     * @method
     */
    get() {
        return this.getter()();
    }

    /**
     * Prepare property default value
     * @method
     */
    set(value) {
        return this.setter()(value);
    }

    /**
     * Define getter and setter on instance property(ies)
     * @method
     */
    define() {
        Object.defineProperty(this.instance.props, this.key, {
            get: this.getter(),
            set: this.setter(),
        });
    }

    /**
     * Get the function which returns the value denormalized
     * @method
     * @returns {Function}
     */
    getter() {
        return () => {
            return this.denormalize(this.value);
        };
    }

    /**
     * Get the function which gets the value normalized
     * @method
     * @returns {Function}
     */
    setter() {
        return (value) => {
            if (!this.validate(value)) return false;

            const previous = this.value;
            value = this.normalize(value);
            if (value !== previous) {
                this.value = value;
                this.instance.emit('change', {
                    key: this.key,
                    value: this.value,
                    previous
                });
            }
            return this.value;
        };
    }

    /**
     * Normalize the value
     * @param value
     * @param previous
     * @returns {*}
     */
    normalize(value, previous) {
        return value || undefined;
    }

    /**
     * Denormalize the value
     * @param value
     * @method
     */
    denormalize(value) {
        return value || undefined;
    }

    /**
     * Validate if value correspond on property type
     * @method
     * @param value
     */
    validate(value) {
        if (value !== undefined && this.field.options.validator) {
            const validator = this.field.options.validator;
            if (typeof validator === 'function') {
                if (validator(value, this.field.value)) {
                    throw new Error(`Invalid value for ${this.field.schema.name}.${this.field.key}#${this.instance.uuid}`);
                }
            } else if (typeof validator === 'object') {
                if (validator.hasOwnProperty('eq')) {
                    if (value !== validator.eq) {
                        throw new Error(`Expected value equal to ${JSON.stringify(validator.eq)}, got ${JSON.stringify(value)}`);
                    }
                }
                if (validator.hasOwnProperty('neq')) {
                    if (value === validator.neq) {
                        throw new Error(`Expected value different of ${JSON.stringify(validator.neq)}, got ${JSON.stringify(value)}`);
                    }
                }
                if (validator.hasOwnProperty('in')) {
                    if (!Array.isArray(validator.in)) {
                        throw new Error(`Expected array as value for in validator, got ${typeof validator.in}`);
                    }
                    if (!validator.in.includes(value)) {
                        throw new Error(`Expected value in ${JSON.stringify(validator.in)}, got ${JSON.stringify(value)}`);
                    }
                }
                if (validator.hasOwnProperty('notin')) {
                    if (!Array.isArray(validator.notin)) {
                        throw new Error(`Expected array as value for notin validator, got ${typeof validator.notin}`);
                    }
                    if (validator.notin.includes(value)) {
                        throw new Error(`Expected value not in ${JSON.stringify(validator.notin)}, got ${JSON.stringify(value)}`);
                    }
                }
            }
        }
        return true;
    }

    get key() {
        return this.field.key;
    }

    /**
     * Get the value into instance properties
     * @method
     */
    get value() {
        if (this.compound && this.index !== undefined) {
            return this.instance.props[`_${this.key}`][this.index];
        }
        return this.instance.props[`_${this.key}`];
    }

    /**
     * Set the value into instance properties
     * @param value
     * @method
     */
    set value(value) {
        if (this.compound && this.index !== undefined) {
            return this.instance.props[`_${this.key}`][this.index] = value;
        }
        return this.instance.props[`_${this.key}`] = value;
    }
}

class IncorrectTypeError extends Error {
    constructor(definer, key, expected, type) {
        super();
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, IncorrectTypeError);
        }
        this.name = 'IncorrectTypeError';
        this.message = `Expecting "${key}" to be ${expected} but get '${type}'`;
        this.definer = definer;
        this.key = key;
        this.expected = expected;
        this.type = type;
    }
}

MixedPropertyDefiner.IncorrectTypeError = IncorrectTypeError;
MixedPropertyDefiner.createIncorrectTypeError = (definer, expected, type, keepType = false) => {
    if (!keepType) type = type instanceof models.get() ? type.constructor.name : typeof type;
    return new IncorrectTypeError(definer, `${definer.instance.constructor.name}.${definer.field.key}`, expected, type);
};

module.exports = MixedPropertyDefiner;
