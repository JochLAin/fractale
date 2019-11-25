
class IncorrectTypeError extends Error {
    constructor(field, expected, type) {
        super();
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, IncorrectTypeError);
        }
        this.name = 'IncorrectTypeError';
        this.field = field;
        this.key = `${field.schema.classname}.${field.key}`;
        this.expected = expected;
        this.type = type;
        this.message = `Expecting "${this.key}" to be ${this.expected} but get ${this.type}`;
    }
}

module.exports.IncorrectTypeError = IncorrectTypeError;
module.exports.createIncorrectTypeError = (field, expected, type, bypass = false) => {
    if (!bypass) {
        type = type.ƒ_entity ? `'${type.constructor.name}'` : `'${typeof type}'`;
        if (field.ƒ_array) type = `array of ${type}`;
    }
    return new IncorrectTypeError(field, expected, type);
};
