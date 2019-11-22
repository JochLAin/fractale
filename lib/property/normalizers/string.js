const MixedNormalizer = require('./mixed');

module.exports = class StringNormalizer extends MixedNormalizer {
    static normalize(field, next, previous) {
        return next === undefined ? next : String(next);
    }

    static denormalize(field, next, previous) {
        return next === undefined ? next : String(next);
    }
};
