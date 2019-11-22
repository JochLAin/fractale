const MixedNormalizer = require('./mixed');

module.exports = class BooleanNormalizer extends MixedNormalizer {
    static normalize(field, next, previous) {
        return next === undefined ? next : Boolean(next);
    }

    static denormalize(field, next, previous) {
        return next === undefined ? next : Boolean(next);
    }
};
