/**
 * @class
 */
module.exports = class MixedNormalizer {
    /**
     * Dedenormalize the value
     * @param {Field} field
     * @param next
     * @param previous
     * @returns {*}
     */
    static normalize(field, next, previous) {
        return next || undefined;
    }

    /**
     * Normalize the value
     * @param {Field} field
     * @param next
     * @param previous
     * @method
     */
    static denormalize(field, next, previous) {
        return next || undefined;
    }
};
