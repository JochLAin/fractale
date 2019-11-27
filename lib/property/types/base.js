'use strict';

module.exports = class ƒ_type {
    constructor(field, input) {
        this.field = field;
        this.input = input;
    }

    /**
     * Get the function which returns the value denormalized
     *
     * @param {*} current
     * @returns {*}
     */
    get(current) {
        return this.denormalize(current, undefined);
    }

    /**
     * Normalize the value
     *
     * @param {*} next
     * @param {*} current
     * @returns {*}
     */
    normalize(next, current) {
        return next || undefined;
    }

    /**
     * Denormalize the value
     *
     * @param {*} next
     * @param {*} current
     * @returns {*}
     */
    denormalize(next, current) {
        return next || undefined;
    }

    /**
     * Serialize the value
     *
     * @param {*} value
     * @param {Object} options
     * @returns {*}
     */
    serialize(value, options = {}) {
        return value || undefined;
    }

    /**
     * Deserialize the value
     *
     * @param {*} value
     * @returns {*}
     */
    deserialize(value) {
        return value || undefined;
    }

    /**
     * Validate if value correspond on property type
     *
     * @param value
     */
    validate(value) {
        if (value !== undefined && this.field.options.validator) {
            const validator = this.field.options.validator;
            if (typeof validator === 'function') {
                if (!validator(value, this.field.value)) {
                    throw new Error(`Invalid value for ${this.field.schema.classname}.${this.field.key}, got ${JSON.stringify(value)}`);
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

