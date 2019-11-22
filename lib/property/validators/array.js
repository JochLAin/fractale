const MixedValidator = require('./mixed');

module.exports = class ArrayValidator extends MixedValidator {
    static createIncorrectItemTypeError(error) {
        const expected = `array of ${error.expected}`;
        const type = `array of ${error.type}`;
        throw ArrayValidator.createIncorrectTypeError(error.field, expected, type, true);
    };

    static validate(field, value) {
        if (!value) return;
        if (!Array.isArray(value)) {
            throw ArrayValidator.createIncorrectTypeError(field, 'array', value);
        }

        for (let index = 0, length = value.length; index < length; index++) {
            try {
                field.options.subfield.validate(value[index]);
            } catch (error) {
                if (!(error instanceof MixedValidator.IncorrectTypeError)) throw error;
                if (error.field.key !== field.key) throw error;
                throw ArrayValidator.createIncorrectItemTypeError(error);
            }
        }
    }
};
