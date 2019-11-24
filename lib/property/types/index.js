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

const ArrayType = require('./array');
const BooleanType = require('./boolean');
const DateType = require('./date');
const MixedType = require('./mixed');
const ModelType = require('./model');
const NumberType = require('./number');
const StringType = require('./string');

module.exports.ArrayType = ArrayType;
module.exports.BooleanType = BooleanType;
module.exports.DateType = DateType;
module.exports.MixedType = MixedType;
module.exports.ModelType = ModelType;
module.exports.NumberType = NumberType;
module.exports.StringType = StringType;

module.exports.get = (_field) => {
    const closure = (field) => {
        switch (field.kind) {
            case FIELD_KIND_MIXED:
                return MixedType;
            case FIELD_KIND_BOOLEAN:
                return BooleanType;
            case FIELD_KIND_NUMBER:
                return NumberType;
            case FIELD_KIND_STRING:
                return StringType;
            case FIELD_KIND_DATE:
                return DateType;
            case FIELD_KIND_MODEL:
                return ModelType;
            case FIELD_KIND_ARRAY:
                return ArrayType;
            case FIELD_KIND_CALLBACK:
                field.schema.parse(field, field.value());
                return closure(field);
            default:
                return MixedType;
        }
    };
    return closure(_field);
};
