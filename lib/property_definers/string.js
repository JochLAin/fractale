const Model = require('../model');
const MixedPropertyDefiner = require('./mixed');

class StringPropertyDefiner extends MixedPropertyDefiner {
    normalize(value) {
        return value && String(value);
    }

    denormalize(value) {
        return value && String(value);
    }

    validate(value) {
        if (value !== undefined && typeof value !== 'string') {
            const type = value instanceof Model ? value.constructor.name : typeof value;
            throw StringPropertyDefiner.createIncorrectTypeError(this,'string || undefined', type);
        }

        MixedPropertyDefiner.prototype.validate.call(this, value);
        if (this.field.options.validator) {
            const validator = this.field.options.validator;
            if (typeof validator === 'object') {
                if (validator.hasOwnProperty('like')) {
                    if (typeof validator.like === 'string') {
                        if (validator.like.match(/^%([\s\S]+)%$/)) {
                            const match = validator.like.match(/^%([\s\S]+)%$/);
                            validator.like = new RegExp(`${match[1]}`);
                        } else if (validator.like.match(/^([\s\S]+)%$/)) {
                            const match = validator.like.match(/^%([\s\S]+)%$/);
                            validator.like = new RegExp(`^${match[1]}`);
                        } else if (validator.like.match(/^%([\s\S]+)$/)) {
                            const match = validator.like.match(/^%([\s\S]+)%$/);
                            validator.like = new RegExp(`${match[1]}$`);
                        } else {
                            validator.like = new RegExp(`^${validator.like}$`);
                        }
                    }
                    if (validator.like instanceof RegExp) {
                        if (value && !value.match(validator.like)) {
                            throw new Error(`Expected value like ${validator.like.toString()}, got ${JSON.stringify(value)}`);
                        }
                    } else {
                        throw new Error(`Expected string || regexp as value for like validator, got ${typeof validator.like}`);
                    }
                }
            }
        }

        return true;
    }
}

module.exports = StringPropertyDefiner;
