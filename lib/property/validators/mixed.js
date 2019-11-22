const models = require('../../model');

class IncorrectTypeError extends Error {
    constructor(field, expected, type) {
        super();
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, IncorrectTypeError);
        }
        this.name = 'IncorrectTypeError';
        this.field = field;
        this.key = `${field.schema.classname}.${field.key}`;
        this.expected = expected;
        this.type = type;
        this.message = `Expecting "${this.key}" to be ${this.expected} but get ${this.type}`;
    }
}

/**
 * @class
 */
module.exports = class MixedValidator {
    static createIncorrectTypeError(field, expected, type, keepType = false) {
        if (!keepType) type = type instanceof models.get() ? `'${type.constructor.name}'` : `'${typeof type}'`;
        return new IncorrectTypeError(field, expected, type);
    }

    /**
     * Validate if value correspond on property type
     * @method
     * @param {Field} field
     * @param value
     */
    static validate(field, value) {
        if (value !== undefined && field.options.validator) {
            const validator = field.options.validator;
            if (typeof validator === 'function') {
                if (!validator(value, field.value)) {
                    throw new Error(`Invalid value for ${field.schema.classname}.${field.key}`);
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
    }
};

module.exports.IncorrectTypeError = IncorrectTypeError;
