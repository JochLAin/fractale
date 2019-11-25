/**
 * Define property on an instance of Model
 *
 * @class MixedType
 *
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
module.exports = class MixedType {
    /**
     * Get the function which returns the value denormalized
     *
     * @param {Field} field
     * @param {*} current
     * @returns {*}
     */
    static get(field, current) {
        return field.denormalize(current);
    }

    /**
     * Normalize the value
     *
     * @param {Field} field
     * @param {*} next
     * @param {*} current
     * @returns {*}
     */
    static normalize(field, next, current) {
        return next || undefined;
    }

    /**
     * Denormalize the value
     *
     * @param {Field} field
     * @param {*} next
     * @param {*} current
     * @returns {*}
     */
    static denormalize(field, next, current) {
        return next || undefined;
    }

    /**
     * Serialize the value
     *
     * @param {Field} field
     * @param {*} value
     * @param {Object} options
     * @returns {*}
     */
    static serialize(field, value, options = {}) {
        return value || undefined;
    }

    /**
     * Deserialize the value
     *
     * @param {Field} field
     * @param {*} value
     * @returns {*}
     */
    static deserialize(field, value) {
        return value || undefined;
    }

    /**
     * Validate if value correspond on property type
     *
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
