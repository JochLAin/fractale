const MixedValidator = require('./mixed');

module.exports = class BooleanValidator extends MixedValidator {
    static validate(field, value) {
        if (value !== undefined && typeof value !== 'boolean') {
            throw BooleanValidator.createIncorrectTypeError(field,'boolean || undefined', value);
        }
        MixedValidator.validate(field, value);
    }
};
