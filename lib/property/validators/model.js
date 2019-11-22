const MixedValidator = require('./mixed');

module.exports = class ModelValidator extends MixedValidator {
    static validate(field, value) {
        if (value !== undefined && typeof value !== 'string' && typeof value !== 'object') {
            throw MixedValidator.createIncorrectTypeError(field,  `${field.value.name} || uuid || undefined`, value);
        }
        MixedValidator.validate(field, value);
    }
};
