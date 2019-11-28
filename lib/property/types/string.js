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

    serialize(value) {
        return value === undefined ? value : this.input(value);
    }

    validate(value) {
        if (value === undefined) return;
        if (typeof value !== 'string') {
            throw this.createIncorrectTypeError('string || undefined', value);
        }

        if (!this.options.validator) return;
        ƒ_type.prototype.validate.call(this, value);
        const { validator } = this.options;
        if (typeof validator === 'object') {
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
                if (validator.like instanceof RegExp) {
                    if (!validator.like.test(value)) {
                        throw new Error(`Expected value like ${validator.like.toString()}, got ${JSON.stringify(value)}`);
                    }
                } else {
                    throw new Error(`Expected String || RegExp as value for like validator, got ${typeof validator.like}`);
                }
            }
        }
    }

    toJSON() {
        return this.input.name;
    }
};
