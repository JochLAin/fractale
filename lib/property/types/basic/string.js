'use strict';

const { createIncorrectTypeError } = require('../../../errors');
const ƒ_type = require('../base');

module.exports = class ƒ_string extends ƒ_type {
    constructor(field, input) {
        super(field, input);
        this.value = String;
    }

    static evaluate(input, type) {
        return type === 'string'
            || type === 'function' && input === String
        ;
    }

    static get priority() {
        return -10;
    }

    normalize(next) {
        return next === undefined ? next : String(next);
    }

    denormalize(next) {
        return next === undefined ? next : String(next);
    }

    deserialize(value) {
        return value === undefined ? value : String(value);
    }

    serialize(value) {
        return value === undefined ? value : String(value);
    }

    validate(value) {
        if (value !== undefined && typeof value !== 'string') {
            throw createIncorrectTypeError(this.field,'string || undefined', value);
        }

        ƒ_type.prototype.validate.call(this, value);
        if (value !== undefined && this.field.options.validator) {
            const validator = this.field.options.validator;
            if (typeof validator === 'object') {
                if (validator.hasOwnProperty('like')) {
                    if (typeof validator.like === 'string') {
                        const match = validator.like.match(/^\/(.+)\/([gmixXsuUAJD]+)?$/);
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
    }
};
