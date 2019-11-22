const {
    FIELD_KIND_MIXED,
    FIELD_KIND_BOOLEAN,
    FIELD_KIND_NUMBER,
    FIELD_KIND_STRING,
    FIELD_KIND_DATE,
    FIELD_KIND_MODEL,
    FIELD_KIND_ARRAY,
    FIELD_KIND_CALLBACK
} = require('../../constants');

const ArrayValidator = require('./array');
const BooleanValidator = require('./boolean');
const DateValidator = require('./date');
const MixedValidator = require('./mixed');
const ModelValidator = require('./model');
const NumberValidator = require('./number');
const StringValidator = require('./string');

module.exports.ArrayValidator = ArrayValidator;
module.exports.BooleanValidator = BooleanValidator;
module.exports.DateValidator = DateValidator;
module.exports.MixedValidator = MixedValidator;
module.exports.ModelValidator = ModelValidator;
module.exports.NumberValidator = NumberValidator;
module.exports.StringValidator = StringValidator;

module.exports.get = (_field) => {
    const closure = (field) => {
        switch (field.kind) {
            case FIELD_KIND_MIXED:
                return MixedValidator;
            case FIELD_KIND_BOOLEAN:
                return BooleanValidator;
            case FIELD_KIND_NUMBER:
                return NumberValidator;
            case FIELD_KIND_STRING:
                return StringValidator;
            case FIELD_KIND_DATE:
                return DateValidator;
            case FIELD_KIND_MODEL:
                return ModelValidator;
            case FIELD_KIND_ARRAY:
                return ArrayValidator;
            case FIELD_KIND_CALLBACK:
                field.schema.parse(field, field.value());
                return closure(field);
            default:
                return MixedValidator;
        }
    };
    return closure(_field);
};
