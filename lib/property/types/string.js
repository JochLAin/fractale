const MixedType = require('./mixed');

module.exports = class StringType extends MixedType {
    static normalize(field, next, previous) {
        return next === undefined ? next : String(next);
    }

    static denormalize(field, next, previous) {
        return next === undefined ? next : String(next);
    }

    static deserialize(field, value) {
        return value === undefined ? value : String(value);
    }

    static serialize(field, value, options = {}) {
        return value === undefined ? value : String(value);
    }

    static validate(field, value) {
        if (value !== undefined && typeof value !== 'string') {
            throw StringType.createIncorrectTypeError(field,'string || undefined', value);
        }

        MixedType.validate(field, value);
        if (value !== undefined && field.options.validator) {
            const validator = field.options.validator;
            if (typeof validator === 'object') {
                if (validator.hasOwnProperty('like')) {
                    if (typeof validator.like === 'string') {
                        const match = REGEXP_MATCH.match(validator.like);
                        if (match) {
                            validator.like = new RegExp(match[1], match[2]);
                        } else if (validator.like.match(/^%([\s\S]+)%$/)) {
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
                        if (!value.match(validator.like)) {
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
