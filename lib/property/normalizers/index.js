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

const ArrayNormalizer = require('./array');
const BooleanNormalizer = require('./boolean');
const DateNormalizer = require('./date');
const MixedNormalizer = require('./mixed');
const ModelNormalizer = require('./model');
const NumberNormalizer = require('./number');
const StringNormalizer = require('./string');

module.exports.ArrayNormalizer = ArrayNormalizer;
module.exports.BooleanNormalizer = BooleanNormalizer;
module.exports.DateNormalizer = DateNormalizer;
module.exports.MixedNormalizer = MixedNormalizer;
module.exports.ModelNormalizer = ModelNormalizer;
module.exports.NumberNormalizer = NumberNormalizer;
module.exports.StringNormalizer = StringNormalizer;

module.exports.get = (_field) => {
    const closure = (field) => {
        switch (field.kind) {
            case FIELD_KIND_MIXED:
                return MixedNormalizer;
            case FIELD_KIND_BOOLEAN:
                return BooleanNormalizer;
            case FIELD_KIND_NUMBER:
                return NumberNormalizer;
            case FIELD_KIND_STRING:
                return StringNormalizer;
            case FIELD_KIND_DATE:
                return DateNormalizer;
            case FIELD_KIND_MODEL:
                return ModelNormalizer;
            case FIELD_KIND_ARRAY:
                return ArrayNormalizer;
            case FIELD_KIND_CALLBACK:
                field.schema.parse(field, field.value());
                return closure(field);
            default:
                return MixedNormalizer;
        }
    };
    return closure(_field);
};
