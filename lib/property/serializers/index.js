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

const ArraySerializer = require('./array');
const BooleanSerializer = require('./boolean');
const DateSerializer = require('./date');
const MixedSerializer = require('./mixed');
const ModelSerializer = require('./model');
const NumberSerializer = require('./number');
const StringSerializer = require('./string');

module.exports.ArraySerializer = ArraySerializer;
module.exports.BooleanSerializer = BooleanSerializer;
module.exports.DateSerializer = DateSerializer;
module.exports.MixedSerializer = MixedSerializer;
module.exports.ModelSerializer = ModelSerializer;
module.exports.NumberSerializer = NumberSerializer;
module.exports.StringSerializer = StringSerializer;

module.exports.get = (_field) => {
    const closure = (field) => {
        switch (field.kind) {
            case FIELD_KIND_MIXED:
                return MixedSerializer;
            case FIELD_KIND_BOOLEAN:
                return BooleanSerializer;
            case FIELD_KIND_NUMBER:
                return NumberSerializer;
            case FIELD_KIND_STRING:
                return StringSerializer;
            case FIELD_KIND_DATE:
                return DateSerializer;
            case FIELD_KIND_MODEL:
                return ModelSerializer;
            case FIELD_KIND_ARRAY:
                return ArraySerializer;
            case FIELD_KIND_CALLBACK:
                field.schema.parse(field, field.value());
                return closure(field);
            default:
                return MixedSerializer;
        }
    };
    return closure(_field);
};
