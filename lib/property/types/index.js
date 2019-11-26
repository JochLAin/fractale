'use strict';

const BooleanType = require('./boolean');
const DateType = require('./date');
const MixedType = require('./mixed');
const ModelType = require('./model');
const NumberType = require('./number');
const StringType = require('./string');

module.exports.BooleanType = BooleanType;
module.exports.DateType = DateType;
module.exports.MixedType = MixedType;
module.exports.ModelType = ModelType;
module.exports.NumberType = NumberType;
module.exports.StringType = StringType;

module.exports.get = (_field) => {
    const closure = (field) => {
        switch (field.kind) {
            case 'ƒ_mixed':
                return MixedType;
            case 'ƒ_boolean':
                return BooleanType;
            case 'ƒ_number':
                return NumberType;
            case 'ƒ_string':
                return StringType;
            case 'ƒ_date':
                return DateType;
            case 'ƒ_model':
                return ModelType;
            case 'ƒ_callback':
                field.schema.parse(field, field.value());
                return closure(field);
            default:
                return MixedType;
        }
    };
    return closure(_field);
};
