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

const ArrayPropertyDefiner = require('./array');
const BooleanPropertyDefiner = require('./boolean');
const DatePropertyDefiner = require('./date');
const MixedPropertyDefiner = require('./mixed');
const ModelPropertyDefiner = require('./model');
const NumberPropertyDefiner = require('./number');
const StringPropertyDefiner = require('./string');

module.exports.ArrayPropertyDefiner = ArrayPropertyDefiner;
module.exports.BooleanPropertyDefiner = BooleanPropertyDefiner;
module.exports.DatePropertyDefiner = DatePropertyDefiner;
module.exports.MixedPropertyDefiner = MixedPropertyDefiner;
module.exports.ModelPropertyDefiner = ModelPropertyDefiner;
module.exports.NumberPropertyDefiner = NumberPropertyDefiner;
module.exports.StringPropertyDefiner = StringPropertyDefiner;

module.exports.get = (_field) => {
    const closure = (field) => {
        switch (field.kind) {
            case FIELD_KIND_MIXED:
                return MixedPropertyDefiner;
            case FIELD_KIND_BOOLEAN:
                return BooleanPropertyDefiner;
            case FIELD_KIND_NUMBER:
                return NumberPropertyDefiner;
            case FIELD_KIND_STRING:
                return StringPropertyDefiner;
            case FIELD_KIND_DATE:
                return DatePropertyDefiner;
            case FIELD_KIND_MODEL:
                return ModelPropertyDefiner;
            case FIELD_KIND_ARRAY:
                return ArrayPropertyDefiner;
            case FIELD_KIND_CALLBACK:
                field.schema.parse(field, field.value());
                return closure(field);
            default:
                return MixedPropertyDefiner;
        }
    };
    return closure(_field);
};
