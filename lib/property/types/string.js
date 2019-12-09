'use strict';

const ƒ_type = require('./index');

module.exports = class ƒ_string extends ƒ_type {
    constructor(schema, key, input, options) {
        super(schema, key, input, options);
        this.input = String;
    }

    static evaluate(input, type) {
        return type === 'string'
            || type === 'function' && input === String
        ;
    }

    static get priority() {
        return -10;
    }

    expose(property) {
        return property.value === undefined ? property.value : this.input(property.value);
    }

    flatten(value) {
        return value === undefined ? value : this.input(value);
    }

    shape(value, options) {
        return value === undefined ? value : this.input(value);
    }

    parseValidator(validator) {
        validator = super.parseValidator(validator);
        if (typeof validator !== 'object') return validator;
        if (validator.hasOwnProperty('like')) {
            if (typeof validator.like === 'string') {
                const match = validator.like.match(/^\/(.+)\/([gmixXsuUAJD]*)?$/);
                if (match) {
                    validator.like = new RegExp(match[1], match[2]);
                } else if (/^%([\s\S]+)%$/.test(validator.like)) {
                    const match = validator.like.match(/^%([\s\S]+)%$/);
                    validator.like = new RegExp(`${match[1]}`);
                } else if (/^([\s\S]+)%$/.test(validator.like)) {
                    const match = validator.like.match(/^%([\s\S]+)%$/);
                    validator.like = new RegExp(`^${match[1]}`);
                } else if (/^%([\s\S]+)$/.test(validator.like)) {
                    const match = validator.like.match(/^%([\s\S]+)%$/);
                    validator.like = new RegExp(`${match[1]}$`);
                } else {
                    validator.like = new RegExp(`^${validator.like}$`);
                }
            }
            if (!(validator.like instanceof RegExp)) {
                throw this.createIncorrectValidatorTypeError('like', 'string || RegExp', typeof validator.like);
            }
        }
        return validator;
    }

    validate(value) {
        if (value === undefined) return;
        if (typeof value !== 'string') {
            throw this.createIncorrectTypeError('string || undefined', value);
        }

        if (!this.validator) return;
        super.validate(value);
        if (typeof this.validator === 'object') {
            if (this.validator.hasOwnProperty('like')) {
                if (!this.validator.like.test(value)) {
                    throw new Error(`Expected value like ${this.validator.like.toString()}, got ${JSON.stringify(value)}`);
                }
            }
        }
    }

    toJSON() {
        return this.input.name;
    }
};
