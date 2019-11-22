const MixedNormalizer = require('./mixed');

module.exports = class NumberNormalizer extends MixedNormalizer {
    static normalize(field, next, previous) {
        return next === undefined ? next : Number(next);
    }

    static denormalize(field, next, previous) {
        return next === undefined ? next : Number(next);
    }
};
