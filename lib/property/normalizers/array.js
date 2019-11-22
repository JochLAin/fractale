const MixedNormalizer = require('./mixed');

module.exports = class ArrayNormalizer extends MixedNormalizer {
    static normalize(field, next, previous) {
        return (next || []).map((item) => {
            return field.options.subfield.normalize(item);
        });
    }

    static denormalize(field, next, previous) {
        return (next || []).map((item) => {
            return field.options.subfield.denormalize(item);
        });
    }
};
