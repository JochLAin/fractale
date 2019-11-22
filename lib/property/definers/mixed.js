/**
 * Define property on an instance of Model
 * @class
 * @param {Model} instance
 * @param {Field} field
 * @param {Boolean} compound
 */
module.exports = class MixedPropertyDefiner {
    /**
     * Get the function which returns the value denormalized
     * @method
     * @returns {Function}
     */
    static get(property) {
        return property.denormalize(property.value);
    }

    /**
     * Get the function which gets the value normalized
     * @method
     * @returns {Function}
     */
    static set(property, value) {
        property.validate(value);
        value = property.normalize(value, property.value);
        return property.value = value;
    }
};
