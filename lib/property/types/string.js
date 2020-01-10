const { stringify } = require('../../utils');
const ƒ_type = require('./index');

module.exports = class ƒ_string extends ƒ_type {
    constructor(schema, key, input, options) {
        super(schema, key, String, input, options);
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
        return property.value === undefined ? property.value : this.generator(property.value);
    }

    flatten(value) {
        return value === undefined ? value : this.generator(value);
    }

    shape(value, options) {
        return value === undefined ? value : this.generator(value);
    }

    parseValidator(validator) {
        validator = super.parseValidator(validator);
        if (typeof validator !== 'object') return validator;
        if (Object.prototype.hasOwnProperty.call(validator, 'like')) {
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
        if (this.options.required && value === undefined || value === null) {
            throw this.createValidatorError('required', value, 'to be define');
        }
        if (typeof value !== 'string') {
            throw this.createIncorrectTypeError('string || undefined', value);
        }

        if (!this.validator) return;
        super.validate(value);
        if (typeof this.validator === 'object') {
            if (Object.prototype.hasOwnProperty.call(this.validator, 'like')) {
                if (!this.validator.like.test(value)) {
                    throw new Error(`Expected value like ${this.validator.like.toString()}, got ${JSON.stringify(value)}`);
                }
            }
        }
    }

    toBasic(replacer) {
        const value = String;
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
