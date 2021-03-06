const { stringify } = require('../../utils');
const ƒ_type = require('./index');

module.exports = class ƒ_boolean extends ƒ_type {
    constructor(schema, key, input, options) {
        super(schema, key, Boolean, input, options);
    }

    static evaluate(input, type) {
        return type === 'boolean'
            || type === 'string' && ['bool', 'boolean'].includes(input)
            || type === 'function' && input === Boolean
        ;
    }

    static get priority() {
        return 10;
    }

    expose(property) {
        return property.value === undefined ? property.value : this.generator(property.value);
    }

    flatten(value) {
        return value === undefined ? value : this.generator(value);
    }

    shape(value, options) {
        return value === undefined ? value : this.generator(value);
    }

    validate(value) {
        if (this.options.required && value === undefined || value === null) {
            throw this.createValidatorError('required', value, 'to be define');
        }
        if (typeof value !== 'boolean') {
            throw this.createIncorrectTypeError('boolean || undefined', value);
        }

        if (!this.validator) return;
        super.validate(value);
    }

    toBasic(replacer) {
        const value = Boolean;
        if (replacer instanceof Function) return replacer(value, this);
        return value;
    }

    toJSON() {
        if (Object.keys(this.options).length) {
            return `Fractale.with(${this.generator.name}, ${stringify(this.options)})`;
        }
        return this.generator.name;
    }
};
